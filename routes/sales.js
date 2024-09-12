var express = require('express')
var router = express.Router()

//var dm = require('../sqlgo.js');
var dm = require('../sqlso.js');
var roles = require('../roles.js');
//const app = require('../apiskb3.js');

//BODY PARSER
router.use(express.json());
router.use(express.urlencoded({
  extended: false,
  parameterLimit: 100000,
  limit: '50mb',
}));

//EXPRESS
router.use(function (req, res, next) {
  console.log('Connect as :', req.body.userid); //console.log('/sales' + req.url, "@", Date().toLocaleString());
  next();
});

// Modul Pesanan
router
.route('/basket')
	.get( (req, res) => {
		uid = req.query.search;
		var	profile = {
			user      : req.body.userid,
			url       : '/sales' + req.url || '',
			// tab_access: req.session.tab_access,
			// imgProfile: req.session.imgProfile
		}
		//console.log(req.body);

		dm.viewBasketByUser(uid)
		.then(data => {
			//console.log(data)
			dt = JSON.stringify(data);
			res.status(200).json({
				message: 'Token verified...',
				dt
			});
		
		})
		.catch( err => {
      console.log('Route Error : ', err)
			res.status(500).json({
				message: 'Internal Server Error...',
				dt : ''
			});
    })
	});

router
	.route('/addbasket')
	.post( (req, res)=> {
		const b  = req.body;
		//console.log('Post @Route: ', b);

		dm.addBasket(b)
		.then(result => {
			console.log('Middleware :', result)
			res.send(result);
		})
		.catch(err => {
			console.log(err);
			res.send(err);
		})

	});

router
	.route('/updbasket')
	.post( (req, res)=> {
		const b  = req.body;
		//console.log('Post @Route: ', b);

		dm.updBasket(b)
		.then(result => {
			console.log('Router :', result)
			res.send(result);
		})
		.catch(err => {
			console.log(err);
			res.send(err);
		})

	});

router
	.route('/updbasketcustomer')
	.put( (req, res)=> {
		const b  = req.body;
		//console.log('Post @Route: ', b);

		dm.updBasketCustomer(b)
		.then(result => {
			obj = Object.values(result);
			idc = obj[0];
			//dt = JSON.stringify(idc);
			console.log('Router :', idc )
			res.send(dt=idc);
		})
		.catch(err => {
			console.log(err);
			res.send(err);
		})

	});

router
	.route('/delbasket')
	.delete( (req, res)=> {
		const b  = req.body;
		//console.log('Post @Route: ', b);

		dm.delBasket(b)
		.then(result => {
			console.log('Middleware :', result)
			res.send(result);
		})
		.catch(err => {
			console.log(err);
			res.send(err);
		})

	});

// Modul Sales Quote
router
	.route('/genquotation')
	.post( (req, res) => {
		const b  = req.body;
		//console.log('Post @Route: ', b);

		dm.genQuotation(b)
		.then(result => {
			//console.log('Middleware :', result)
			let i = req.query.isjson;
			if(i==0){
				res.status(200).send(dt = result);
			} else {
				dt = JSON.stringify(result);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
	
			}
		})
		.catch(err => {
			console.log(err);
			res.send(err);
		})
	});

router
.route('/copyquotation')
	.post( (req, res) => {
		const b  = req.body;
		console.log('Post @Route: ', b);

		dm.copyQuotation(b)
		.then(result => {
			console.log('Middleware :', result)
			let i = req.query.isjson;
			if(i==0){
				res.status(200).send(dt = result);
			} else {
				dt = JSON.stringify(result);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
	
			}
		})
		.catch(err => {
			console.log(err);
			res.send(err);
		})
	});

router
	.route('/quotationbydate')
	.get( (req, res) => {
		var	profile = {
			user      : req.body.userid,
			url       : '/sales' + req.url || '',
		}
		const b  = req.body;
		if (!b.custname) {
			b.customer = '%'
			//console.log(b);
		} else {
			b.customer = '%' + b.custname + '%';
			console.log(b);
		}

		dm.getQuotationByDate(b)
		.then(data => {
			//console.log(data)
			dt = JSON.stringify(data);
			res.status(200).json({
				message: 'Token verified...',
				dt
			});
		})
		.catch( err => {
			console.log('Route Error : ', err)
			res.status(500).json({
				message: 'Internal Server Error...',
				dt : ''
			});
		})

	});

	router
	.route('/quotationbyproduct')
	.get( (req, res) => {
		var	profile = {
			user      : req.body.userid,
			url       : '/sales' + req.url || '',
		}
		const b  = req.body;

		dm.getQuotationByProduct(b)
		.then(data => {
			//console.log(data)
			dt = JSON.stringify(data);
			res.status(200).json({
				message: 'Token verified...',
				dt
			});
		})
		.catch( err => {
			console.log('Route Error : ', err)
			res.status(500).json({
				message: 'Internal Server Error...',
				dt : ''
			});
		})

	});

router
	.route('/quotationdetail')
	.get( (req, res) => {
		const b  = req.body;
		var	profile = {
			user      : req.body.userid,
			url       : '/sales' + req.url || '',
		}
		//b.sonumber = 'SO-00002';
		//console.log(b);
		dm.getQuotationDtl(b)
		.then(data => {
			let i = req.query.isjson;

			if(i==0){
				res.status(200).send(dt = data);
			} else {
				dt = JSON.stringify(data);
				//console.log(dt);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
			}			
		})
		.catch( err => {
      console.log('Route Error : ', err)
			res.status(500).json({
				message: 'Internal Srver Error...',
				dt : ''
			});
    })
	});

router
	.route('/stockbylocation')
	.get( (req, res) => {
		const b  = req.body;
		var	profile = {
			user      : req.body.userid,
			url       : '/sales' + req.url || '',
		}
		//b.sonumber = 'SO-00002';
		console.log(b);
		dm.getStockByLocation(b)
		.then(data => {
			let i = req.query.isjson;

			if(i==0){
				res.status(200).send(dt = data);
			} else {
				dt = JSON.stringify(data);
				console.log(dt);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
			}			
		})
		.catch( err => {
      console.log('Route Error : ', err)
			res.status(500).json({
				message: 'Internal Srver Error...',
				dt : ''
			});
    })
	});

	router
	.route('/setquotationstatus')
	.put( (req, res)=> {
		const b  = req.body;
		//console.log('Post @Route: ', b);

		dm.setQuotationStatus(b)
		.then(result => {
			obj = Object.values(result);
			idc = obj[0];
			//dt = JSON.stringify(idc);
			console.log('Router :', idc )
			res.send(dt=idc);
		})
		.catch(err => {
			console.log(err);
			res.send(err);
		})

	});

// Modul Sales Order
router
	.route('/salesorder')
	.get( (req, res) => {
		var	profile = {
			user      : req.body.userid,
			url       : '/sales' + req.url || '',
		}
		const b  = req.body;
		
		if (!b.custname) {
			b.customer = '%'
			//console.log(b);
		} else {
			b.customer = '%' + b.custname + '%';
			console.log(b);
		}

		dm.getSalesOrder(b)
		.then(data => {
			//console.log(data)
			dt = JSON.stringify(data);
			res.status(200).json({
				message: 'Token verified...',
				dt
			});
		})
		.catch( err => {
			console.log('Route Error : ', err)
			res.status(500).json({
				message: 'Internal Server Error...',
				dt : ''
			});
		})
	});

router
	.route('/salesorderdtl')
	.get( (req, res) => {
		const b  = req.body;
		var	profile = {
			user      : req.body.userid,
			url       : '/sales' + req.url || '',
		}
		//b.sonumber = 'SO-00002';
		//console.log(b);
		dm.getSODtl(b)
		.then(data => {
			let i = req.query.isjson;

			if(i==0){
				res.status(200).send(dt = data);
			} else {
				dt = JSON.stringify(data);
				//console.log(dt);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
			}			
		})
		.catch( err => {
      console.log('Route Error : ', err)
			res.status(500).json({
				message: 'Internal Srver Error...',
				dt : ''
			});
    })
	});


// Modul Delivery
router
	.route('/deliverybydate')
	.get( (req, res) => {
		var	profile = {
			user      : req.body.userid,
			url       : '/sales' + req.url || '',
		}
		const b  = req.body;

		if (!b.custname) {
			b.customer = '%'
			//console.log(b);
		} else {
			b.customer = '%' + b.custname + '%';
			console.log(b);
		}

		dm.getDeliveryByDate(b)
		.then(data => {
			//console.log(data)
			dt = JSON.stringify(data);
			res.status(200).json({
				message: 'Token verified...',
				dt
			});
		})
		.catch( err => {
			console.log('Route Error : ', err)
			res.status(500).json({
				message: 'Internal Server Error...',
				dt : ''
			});
		})

	});

router
	.route('/deliverydetail')
	.get( (req, res) => {
		const b  = req.body;
		var	profile = {
			user      : req.body.userid,
			url       : '/sales' + req.url || '',
		}
		//b.sonumber = 'SO-00002';
		//console.log(b);
		dm.getDeliveryDtl(b)
		.then(data => {
			let i = req.query.isjson;

			if(i==0){
				res.status(200).send(dt = data);
			} else {
				dt = JSON.stringify(data);
				//console.log(dt);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
			}			
		})
		.catch( err => {
      console.log('Route Error : ', err)
			res.status(500).json({
				message: 'Internal Srver Error...',
				dt : ''
			});
    })
	});

router
	.route('/setdelivered')
	.post( (req, res) => {
		const b  = req.body;
		//console.log('Post @Route: ', b);

		dm.setDelivered(b)
		.then(result => {
			console.log('Middleware :', result);
			if (result === 'Error') { return res.sendStatus(204);}

			let i = req.query.isjson;
			if(i==0){
				res.status(200).send(dt = result);
			} else {
				dt = JSON.stringify(result);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
			}
		})
		.catch(err => {
			console.log(err); //res.send(err);
			res.sendStatus(204);
		})

	});

router
  .route('/photodo')
	.get((req, res) => {
		var data = req.body;
		console.log(data);

		dm.getPhoto(data)
		.then(result => {
			if (result.length === 0) {
				console.log('Record : 0');
				res.status(200).json({dt:[], rec: 0});
			} else {
				var rec = result.length;

				dt = JSON.stringify(result);
				// console.log(dt);
				console.log('Record', rec);

				res.status(200).json({
					dt, rec
				});
			}
		})
		.catch((err) => {
			res.sendStatus(404, 'Data not found')
		})
	})
	.post((req, res) => {    //hasil format Object Array
    var data = req.body;
		//console.log(data);

		dm.addPhoto(data)
		.then(result => {
			//console.log(result)
			var dt = JSON.stringify(result)
			res.send(dt);
		})
  })	
	.delete((req, res)=> {
		const b  = req.body;
		//console.log('Post @Route: ', b);

		dm.delPhoto(b)
		.then(result => {
			console.log('Middleware :', result)
			res.send(result);
		})
		.catch(err => {
			console.log(err);
			res.send(err);
		})
	});

// Modul Sales Visit-Attendance
router
  .route('/visitplan')
	.get((req, res) => {
		var data = req.body;
		console.log(data);

		dm.getVisitPlan(data)
		.then(result => {
			if (result.length === 0) {
				res.status(200).json({dt:[], rec: 0});
			} else {
				var rec = result.length;
				dt = JSON.stringify(result);
				//console.log(dt);
				//console.log('Record', rec);

				res.status(200).json({
					dt, rec
				});
			}
		})
		.catch((err) => {
			res.sendStatus(404, 'Data not found')
		})
	})
	.post((req, res) => {    //hasil format Object Array
    var data = req.body;
		console.log(data);

		dm.addVisitPlan(data)
		.then(result => {
			//console.log(result)
			var dt = JSON.stringify(result)
			res.send(dt);
		})
  });

router
  .route('/visit')
	.get((req, res) => {
		var data = req.body;
		//console.log(data);

		dm.getSalesVisit(data)
		.then(result => {
			if (result.length === 0) {
				//console.log('Record : 0');
				res.status(200).json({dt:[], rec: 0});
			} else {
				var rec = result.length;

				dt = JSON.stringify(result);
				// console.log(dt);
				console.log('Record', rec);

				res.status(200).json({
					dt, rec
				});
			}
		})
		.catch((err) => {
			res.sendStatus(404, 'Data not found')
		})
	})
	.post((req, res) => {
    var data = req.body;
		//console.log(data);

		dm.addSalesVisit(data)
		.then(result => {
			//console.log(result)
			var dt = JSON.stringify(result)
			res.send(dt);
		})
  });

router
  .route('/cekvisit')
	.get((req, res) => {
		var data = req.body;
		console.log(data);

		dm.cekVisit(data)
		.then(result => {
			if (result.length === 0) {
				console.log('Record : 0');
				res.status(200).json({dt:[], rec: 0});
			} else {
				var rec = result.length;

				dt = JSON.stringify(result);
				console.log(dt);
				//console.log('Record', rec);

				res.status(200).json({
					dt, rec
				});
			}
		})
		.catch((err) => {
			res.sendStatus(404, 'Data not found')
		})
	});

router
  .route('/visitdetail')
	.get((req, res) => {
		var data = req.body;
		//console.log(data);

		dm.getVisitDetail(data)
		.then(result => {
			if (result.length === 0) {
				//console.log('Record : 0');
				res.status(200).json({dt:[], rec: 0});
			} else {
				var rec = result.length;

				dt = JSON.stringify(result);
				// console.log(dt);
				//console.log('Record', rec);

				res.status(200).json({
					dt, rec
				});
			}
		})
		.catch((err) => {
			res.sendStatus(404, 'Data not found')
		})
	});

router
  .route('/cekattendance')
	.get((req, res) => {
		var data = req.body;
		//console.log(data);

		dm.cekAttendance(data)
		.then(result => {
			if (result.length === 0) {
				//console.log('Record : 0');
				res.status(200).json({dt:[], rec: 0});
			} else {
				var rec = result.length;

				dt = JSON.stringify(result);
				console.log(dt);
				//console.log('Record', rec);

				res.status(200).json({
					dt, rec
				});
			}
		})
		.catch((err) => {
			res.sendStatus(404, 'Data not found')
		})
	});

router
  .route('/attendance')
	.get((req, res) => {
		var b = req.body;
		//console.log(data);

		if (!b.idpeople) {
			console.log('Unknown Employee ID');
		} else {
			dm.getAttendance(b)
			.then(data => {
				//console.log(data);
				dt = JSON.stringify(data);
				res.status(200).json({
					message: 'Token verified...',
					dt
				});
			})
			.catch( err => {
				console.log('Route Error : ', err)
				res.status(500).json({
					message: 'Internal Srver Error...',
					dt : ''
				});
			})
		}
	})
	.post((req, res) => {    //hasil format Object Array
    var data = req.body;
		//console.log(data);

		dm.addAttendance(data)
		.then(result => {
			//console.log('Return addAttendance', result.stat)
			(result.stat=='IN' || result.stat=='OUT')
			? dm.addSalesVisit(data)
			: {};

			var dt = JSON.stringify(result)
			res.send(dt);
		})
  });

module.exports = router;

