require('dotenv').config();

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express();
const jwt = require('jsonwebtoken')
const cors = require('cors')
const fs = require('fs')
const axios = require('axios').default
const path   = require('path')

//Local Library
var dm     = require('./sqlgo.js');
var roles  = require('./roles.js');
var master  = require('./routes/master.js');
var sales  = require('./routes/sales.js');

//const urlroute = process.env.URLROUTE;

//EXPRESS
app.use(function (req, res, next) {
  console.log('' + req.url, "@", Date().toLocaleString(), "from", req.socket.remoteAddress);
  next();
});

app.use(`/profile`, express.static('photo/profile'));

//ROUTES
app.use(`/master`, master);
app.use(`/sales`, sales);


//EJS
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

//BODY-PARSER
app.use(express.json());
app.use(express.urlencoded({
  extended: false,
  parameterLimit: 100000,
  limit: '50mb',
}));

//CORS
app.use(cors());

app.get('/', (req, res) => {
  console.log(req.headers);
  //console.log(roles.refreshTokenList);
  res.sendStatus(204); //No_Content
});

app.post('/login', (req, res) => {
  //console.log(req.headers);
  let ver = req.headers.version;

  if (ver < 10011) {
    console.log(`Forbidden, version ${ver} expired!`);
    console.log('---------------------------------');
    let message = 'UNAUTHORIZED version control'
    return res.status(401).json({message})  //send('User/password invalid!')
  }
  
  var authheader = req.headers.authorization;
  if (!authheader) {
    console.log('User Unidentified(Kosong) !');
    console.log('---------------------------------');
    res.sendStatus(403)
    return
  }

  var usrHeader = new Buffer.from(authheader.split(' ')[1], 'base64')
  .toString()
  .split(':');
  //console.log(usrHeader) //(usrHeader); //authheader

  let user = dm.findUser(usrHeader[0])
  let pwd = usrHeader[1]

  //console.log(ver)
  user.then(isValid => {
    if (isValid) {
      if(isValid.password == pwd) {
        console.log(`${isValid.userid} is granted, with ver: ${ver}`);
        console.log('---------------------------------------');
        var authData = {
          username     : isValid.namauser,
          userid       : isValid.userid.toUpperCase(),
          namauser     : isValid.namauser,
          posisi       : isValid.posisi,
          tab_access   : isValid.tab_access,
          read_access  : isValid.read_access,
          write_access : isValid.write_access,
          id_people    : isValid.id_people,
          isprofile    : isValid.isprofile,
          division_access: isValid.division_access
          //dbase        : plant
        }

        let message = 'Success'
        let accessToken  = roles.generateAccessToken({userid : isValid.userid})
        //jwt.sign( {userid : isValid.userid}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
        let refreshToken = jwt.sign( {userid : isValid.userid}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '24h' })
        roles.refreshTokenList.push(refreshToken)
        //console.log(roles.refreshTokenList)

        return res.status(201).json({message, authData, accessToken, refreshToken})
      } else {
        console.log('User/password ' + usrHeader[0] + ' is not granted');
        console.log('---------------------------------');
        //data = {token : accessToken }
        let message = 'FORBIDDEN'
        return res.status(403).json({message})  //send('User/password invalid!')
      }
    }  
  })
});

app.post('/loginsfa', (req, res) => { 
  //console.log(req.headers);
  let ver = req.headers.version;
  let device = req.headers.deviceid || 'Unknown';

  if (ver < 10014) {
    console.log(`Forbidden, SFA version ${ver} expired!`);
    console.log('---------------------------------');
    let message = 'UNAUTHORIZED version control'
    return res.status(401).json({message})  //send('User/password invalid!')
  }
  
  var authheader = req.headers.authorization;
  if (!authheader) {
    console.log('User SFA Unidentified(Kosong) !');
    console.log('---------------------------------');
    res.sendStatus(403)
    return
  }

  var usrHeader = new Buffer.from(authheader.split(' ')[1], 'base64')
  .toString()
  .split(':');
  //console.log(usrHeader) //(usrHeader); //authheader
  let user = dm.findUserSFA(usrHeader[0])
  let pwd = usrHeader[1]
  //console.log(ver)
  user.then(isValid => {
    if (isValid) {
      if(isValid.password == pwd) {
        console.log(`${isValid.userid} is granted, with SFA ver: ${ver}`);
        console.log('---------------------------------------');
        var authData = {
          username     : isValid.namauser,
          userid       : isValid.userid.toUpperCase(),
          namauser     : isValid.namauser,
          posisi       : isValid.posisi,
          tab_access   : isValid.tab_access,
          read_access  : isValid.read_access,
          write_access : isValid.write_access,
          id_people    : isValid.id_people,
          isprofile    : isValid.isprofile,
          division_access: isValid.division_access
        }
        //console.log(authData)
        let message = 'Success'
        let accessToken  = roles.generateAccessToken({userid : isValid.userid})
        //jwt.sign( {userid : isValid.userid}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
        let refreshToken = jwt.sign( {userid : isValid.userid}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '24h' })
        roles.refreshTokenList.push(refreshToken)
        //console.log(roles.refreshTokenList)

        //Add Logger modul, notes, ivalue, userid
        var logger = {
          modul : 'GO_001',
          notes : `SFA ${ver}, DeviceID = ${device}`,
          ivalue: 1,
          userid: authData.userid,
          deviceid : device
        }

        dm.addLogger(logger)
        .then(result => {
          console.log(`${device} logged on`)
        })
        .catch((err) => {
          console.log('Error insert data logger!')
        })          

        return res.status(201).json({message, authData, accessToken, refreshToken})
      } else {
        console.log('User/password ' + usrHeader[0] + ' is not granted');
        console.log('---------------------------------');
        //data = {token : accessToken }
        let message = 'FORBIDDEN'
        return res.status(403).json({message})  //send('User/password invalid!')
      }
    }  
  })
});

app.post('/auth', roles.authToken,  function(req, res, next) {
  console.log(res.statusCode);
  res.sendStatus(200) 
});

app.post('/authRefresh', function(req, res, next) {
  const {user, token} = req.body
  if (token == null) return res.sendStatus(401)
  if (!roles.refreshTokenList.includes(token)) return res.sendStatus(403)
  const accessToken = roles.generateRefreshToken({userid : user}, token)
  res.json({ accessToken: accessToken })
});

app.put('/changepassword', roles.authToken, (req, res) => {
  var data = req.body;
  //console.log(data);

  dm.changePasswd(data)
  .then(result => {
    //console.log(result)
    var dt = JSON.stringify(result)
    
    if (result.length > 0) {
      res.status(200).json({dt})
      //res.send(dt);
    } else {
      res.sendStatus(404, 'Data not found')
    }
  }) 
});

app.post('/addprofile', roles.authToken, (req, res) => {
  var data = req.body;
  const base64Data =  data.photo; //"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";
  const base64Image = base64Data.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');
  const dir = 'photo/profile/' + data.userid +'.png'
  //console.log(data);

  dm.addProfile(data)
  .then(result => {
    (result) 
    ? (
      //console.log(result)
      // Menulis buffer ke file
      fs.writeFile(dir, imageBuffer, (err) => {
        if (err) {
          console.error('Gagal menulis file', err);
        } else {
          console.log('File berhasil dibuat');
        }
      })      
    ) : {}

    var dt = JSON.stringify(result)
    
    if (result.length > 0) {
      res.status(200).json({dt})
      //res.send(dt);
    } else {
      res.sendStatus(404, 'Error update Profile')
    }
  }) 
});

app.get('/getprofile', roles.authToken, (req, res) => {
  var data = req.body;
  //console.log(data);
  dm.getProfile(data)
  .then(result => {
    if (result.length === 0) {
      //console.log('Record : 0');
      res.status(200).json({dt:[], rec: 0});
    } else {
      var rec = result.length;
      dt = JSON.stringify(result);
      // console.log(dt);
      // console.log('Record', rec);

      res.status(200).json({
        dt, rec
      });
    }
  })
  .catch((err) => {
    res.sendStatus(404, 'Data not found')
  })  
});

app.listen(process.env.PORT, () => {
  console.log(`APISKB3 running at http://${process.env.HOST}:${process.env.PORT}`)
});
 