var express = require('express')
var router = express.Router()

var db = require('../sqlgo.js');
var roles = require('../roles.js');
//const app = require('../apiskb3.js');

//BODY PARSER
router.use(express.json());
router.use(express.urlencoded({
  extended: false,
  parameterLimit: 100000,
  limit: '50mb',
}));


// Master Product	
router
.route('/product')
	.get( (req, res) => {
		var	profile = {
			user      : req.body.userid,
			url       : '/master' + req.url || '',
		}
		// let queryWithSpace = req.query.search;
    // console.log(queryWithSpace)
    // let decodedQuery = decodeURIComponent(queryWithSpace);
		// console.log(decodedQuery)
		// text = req.query.search.replace('%20', ' ');
		// txt = '%'+ text + '%';

		const b  = '%'+ req.body.product + '%';
		console.log(profile, b);

		db.productList(b)
		.then(data => {
			//console.log(data)
			let i = req.query.isjson;
			//console.log('JSON : ', i)
			if(i==0){
				res.status(200).send(dt = data);
			} else {
				dt = JSON.stringify(data);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
			}

			//res.render('product', { profile, dt : data });
		})
		.catch( err => {console.log(err)})
	});

// Master Customer	
router
.route('/customer')
	.get( (req, res) => {
		let user = req.body.userid;
		let txt = '%'+ req.body.customer + '%';
		// text = req.query.search.replace('%20', ' ');
		// txt = '%'+ text + '%';		
		var	profile = {
			user      : user,
			url       : '/master' + req.url || '',
			// tab_access: req.session.tab_access,
			// imgProfile: req.session.imgProfile
		}
		console.log(profile, txt);

		db.customerList({txt, user})
		.then(data => {
			//console.log(data)
			let i = req.query.isjson;
			//console.log('JSON : ', i)
			if(i==0){
				res.status(200).send(dt = data);
			} else {
				dt = JSON.stringify(data);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
			}
	
		})
		.catch( err => {console.log(err)})
	});
	
router
	.route('/customerinfo')
	.get( (req, res) => {
		const b  = req.body;			
		var	profile = {
			user      : req.body.userid,
			url       : '/master' + req.url || '',
		}
		console.log(profile);

		db.customerInfo(b.idcustomer)
		.then(data => {
			//console.log(data)
			let i = req.query.isjson;
			console.log('JSON : ', i)
			if(i==0){
				res.status(200).send(dt = data);
			} else {
				dt = JSON.stringify(data);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
			}
	
		})
		.catch( err => {console.log(err)})
	});
	

// Sales User List	
router
.route('/salesuserlist')
	.get( (req, res) => {
		var	profile = {
			user      : req.body.userid,
			url       : '/master' + req.url || '',
		}

		const b  = req.body.userid;
		console.log(profile, b);

		db.salesUserList(b)
		.then(data => {
			//console.log(data)
			let i = req.query.isjson;
			//console.log('JSON : ', i)
			if(i==0){
				console.log('isnotjson')
				res.status(200).send(dt = data);
			} else {
				dt = JSON.stringify(data);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
			}
		})
		.catch( err => {console.log(err)})
	});

// Sales SubOrdinate
router
.route('/getsubordinate')
	.get( (req, res) => {
		var	profile = {
			user      : req.body.userid,
			url       : '/master' + req.url || '',
		}

		const b  = req.body.userid;
		console.log(profile, b);

		db.getSubOrdinate(b)
		.then(data => {
			//console.log(data)
			let i = req.query.isjson;
			//console.log('JSON : ', i)
			if(i==0){
				console.log('isnotjson')
				res.status(200).send(dt = data);
			} else {
				dt = JSON.stringify(data);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
			}
		})
		.catch( err => {console.log(err)})
	});


module.exports = router;

