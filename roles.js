const express = require('express')
const app = express()
var jwt = require('jsonwebtoken')

app.use(express.json())
let refreshTokenList = []

const authToken = function(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  //console.log(token)
  if (token == null) {
    console.log('Token Forbidden!')
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, profile) => {
    if (err) {
      if (err.name=='TokenExpiredError') {
        //authRefreshToken()
        res.status(400).json({
          message: 'TokenExpiredError'
        });
      } else {
        console.log(err.name)
        res.sendStatus(403)
      }
    } else {
      next();
    }
  })
};

function generateRefreshToken(user, token) {
  console.log(token)
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    return accessToken = generateAccessToken({ userid : user })
    
    //res.json({ accessToken: accessToken })
  })
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
}

module.exports = {
  refreshTokenList, authToken, generateAccessToken, generateRefreshToken
};