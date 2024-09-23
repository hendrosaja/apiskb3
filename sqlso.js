var {db, dbsfa} = require('./dbconfig');

var fs = require('fs');
var go = fs.readFileSync('./query/go.sql');
var qgo = JSON.parse(go);

var so = fs.readFileSync('./query/so.sql');
var qso = JSON.parse(so);
const moment = require('moment');

//Basket Keranjang
async function viewBasketByUser(par) {
	try {
		const data = await db.any(qso.basket.byUser, par);
		//console.log(data);
		return data;
	}
	catch (error) {
		console.log('DB Error:', error);
	}
};

async function addBasket(par) {
	try {
		const data = await db.one(qso.basket.addBasket, { par });
		return data;
	} catch (error) {
		console.log('DB Error' + error);
		return 'Error';
	}
};

async function updBasket(par) {
	try{
		const data =  await db.one(qso.basket.setQty, {par});
		return data;
	}catch (error) {
		console.log('Error saat mengupdate data ' + error);
		return 'Error';
	}
};

async function delBasket(par) {
	try{
		const data =  await db.one(qso.basket.delBasket, {par});
		return data;
	}catch (error) {
		console.log('Error saat menghapus data ' + error);
		return 'Error';
	}
};

async function updBasketCustomer(par) {
	try{
		const data =  await db.any(qso.basket.setCustomer, {par});
		return data;
	}catch (error) {
		console.log('Error saat mengupdate data ' + error);
		return 'Error';
	}
};

//Sales Quotation (bi.tb_basket --> bi.tb_quotation)
async function genQuotation(par) {
	try {
		const data = await db.one(qso.order.genQuotation, { par });
		return data;
	} catch (error) {
		console.log('DB Error' + error);
		return 'Error';
	}
};

async function copyQuotation(par) {
	try {
		const data = await db.one(qso.order.copyQuotation, { par });
		return data;
	} catch (error) {
		console.log('DB Error' + error);
		return 'Error';
	}
};

async function getQuotationByDate(par) {
	try {
		const data = await db.any(qso.order.quotationbydate, {par});
		//console.log(data);
		for (let i = 0; i < data.length; i++) {
			data[i].tgl_dtz = moment(data[i].tgl_dt).format('YYYY-MM-DD');
			data[i].shipment_dtz = moment(data[i].shipment_dt).format('YYYY-MM-DD');
		}
		return data;
	}
	catch (error) {
		console.log('DB Error:', error);
	}
};

async function getQuotationByProduct(par) {
	try {
		const data = await db.any(qso.order.quotationbyproduct, {par});
		return data;
	}
	catch (error) {
		console.log('DB Error:', error);
	}
};

async function getQuotationDtl(par) {
	try {
		const data = await db.any(qso.order.quotationdetail, {par});
		for (let i = 0; i < data.length; i++) {
			data[i].tgl_dtz = moment(data[i].tgl).format('YYYY-MM-DD');
			data[i].shipment_dtz = moment(data[i].shipment_dt).format('YYYY-MM-DD');
		}
		//console.log(data);
		return data;
	}
	catch (error) {
		console.log('DB Error:', error);
	}
};

async function getStockByLocation(par) {
	try {
		const data = await db.any(qso.order.stockByLoc, {par});
		//console.log(data);
		return data;
	}
	catch (error) {
		console.log('DB Error:', error);
	}
};

async function setQuotationStatus(par) {
	try{
		const data =  await db.any(qso.order.setquotationstat, {par});
		return data;
	}catch (error) {
		console.log('Error saat mengupdate data ' + error);
		return 'Error';
	}
};

//Sales Order
async function getSalesOrder(par) {
	try {
		const data = await db.any(qso.order.salesOrder, {par});
		return data;
	}
	catch (error) {
		console.log('DB Error:', error);
	}
};

async function getSalesOrderDtl(par) {
	try {
		const data = await db.any(qso.order.salesOrderDtl, {par});
		//console.log(data);
		return data;
	}
	catch (error) {
		console.log('DB Error:', error);
	}
};

//Delivery Order
async function getDeliveryByDate(par) {
	try {
		const data = await db.any(qso.delivery.getListDO, {par});
		if (data.length>0) {
			var dof;
			for (let i = 0; i < data.length; i++) {
				data[i].tgl_dtz = moment(data[i].sj_date).format('YYYY-MM-DD');

				dof = data[i].sjmd_no
				const statdo = await dbsfa.any(qso.delivery.dofStatus, dof);
				(statdo.length>0) ? data[i].status = 1 : data[i].status = 0;
			}
		}
		//console.log(data);
		return data;
	}
	catch (error) {
		console.log('DB Error:', error);
	}
};

async function getDeliveryDtl(par) {
	try {
		const data = await db.any(qso.delivery.getDetailDO, {par});
		// for (let i = 0; i < data.length; i++) {
		// 	data[i].tgl_dtz = moment(data[i].tgl).format('YYYY-MM-DD');
		// 	data[i].shipment_dtz = moment(data[i].shipment_dt).format('YYYY-MM-DD');
		// }
		// console.log(data);
		return data;
	}
	catch (error) {
		console.log('DB Error:', error);
	}
};

async function getPhoto(par) {
	try {
    const data = await dbsfa.any(qso.delivery.getPhoto, {par});
    //console.log(data)
    return data;
  } catch (error) {
    return error;
  }
};

async function addPhoto(par) {
	try {
    const data = await dbsfa.any(qso.delivery.addPhoto, {par});
    return data;
  }
	catch (error) {
		return error;
	}
};

async function delPhoto(par) {
	try{
		console.log(par);
		const data =  await dbsfa.any(qso.delivery.delPhoto, {par});
		return data;
	}catch (error) {
		console.log('Error saat menghapus data ' + error);
		return 'Error';
	}
};

async function setDelivered(par) {
	try {
		const data = await dbsfa.one(qso.delivery.setDelivered, { par });
		return data;
	} catch (error) {
		console.log('DB Error :' + error);
		return 'Error';
	}
};

//Sales Visit - Attendance
async function getVisitPlan(par) {
	try {
    const data = await dbsfa.any(qso.visit.getVisitPlan, {par});
		console.log(data);
		/* // Untuk mengambil dari Master Customer beda DB
		for (let i = 0; i < data.length; i++) {
			 //console.log(data[i].id_customer)
			try {
				let datacust = await db.any(qgo.tb_customer.peopleName, data[i].id_customer);
				//console.log(datacust[0].nama)
				(datacust.length > 0) 
				? data[i].scustomer = datacust[0].nama 
				: data[i].scustomer = '';
			} catch (err) {
				console.log(err)
			}
		}
		*/
    return data;
  } catch (error) {
    return error;
  }
};

async function addVisitPlan(par) {
	try {
    const data = await dbsfa.any(qso.visit.addVisitPlan, {par});
		console.log(data);
    return data;
  }
	catch (error) {
		return error;
	}
};

async function getSalesVisit(par) {
	//console.log(par)
	try {
    const data = await dbsfa.any(qso.visit.getListVisit, {par});
		for (let i = 0; i < data.length; i++) {
			const ilead = data[i].islead;
			const idcust = data[i].id_customer;
			let customer = '-';

			(data[i].checkin=='-' || data[i].checkout=='-') 
			? data[i].status = 'Open'
			: data[i].status = 'Completed' ;

			(ilead==0)
			? customer = await db.one(qgo.tb_customer.peopleName, idcust)
			: customer = await db.one(qgo.tb_customer.leadName, idcust);

			data[i].custname = customer.nama;
		}
		 console.log(data)
    return data;
  } catch (error) {
    return error;
  }
};

async function addSalesVisit(par) {
	try {
    const data = await dbsfa.any(qso.visit.checkinout, {par});
    return data;
  }
	catch (error) {
		return error;
	}
};

async function cekVisit(par) {
	try {
		const data = await dbsfa.one(qso.visit.visitStatus, {par});
		//console.log(data)
		return data;
	} catch (error) {
		console.log('DB Error' + error);
		return 'Error';
	}
};

async function getVisitDetail(par) {
	try {
    const data = await dbsfa.any(qso.visit.visitDetail, {par});
    return data;
  } catch (error) {
    return error;
  }
};

async function cekAttendance(par) {
	try {
		const data = await db.one(qso.attendance.attStatus, {par});
		//console.log(data)
		return data;
	} catch (error) {
		console.log('DB Error' + error);
		return 'Error';
	}
};

async function addAttendance(par) {
	try {
    const data = await db.one(qso.attendance.addAbsensi, {par});
		return data;
  }
	catch (error) {
		return error;
	}
};

async function getAttendance(par) {
	try {
    const data = await db.any(qso.attendance.getAttendance, {par});
    return data;
  } catch (error) {
    return error;
  }
};

// Modul Leads
async function getLeads(par) {
	console.log(par)
	try {
    const data = await db.any(qso.leads.getLeads, {par});
		//console.log(data)
    return data;
  } catch (error) {
    return error;
  }
};

async function getLeadsById(par) {
	try {
    const data = await db.any(qso.leads.getLeadsById, {par});
		// console.log(data)
    return data;
  } catch (error) {
    return error;
  }
};

async function addLeads(par) {
	try {
    const data = await db.any(qso.leads.addLeads, {par});
    return data;
  }
	catch (error) {
		return error;
	}
};

async function updLeads(par) {
	try {
    const data = await db.any(qso.leads.updateLeads, {par});
    return data;
  }
	catch (error) {
		return error;
	}
};

module.exports = {
  viewBasketByUser, addBasket, updBasket, delBasket, updBasketCustomer,
	genQuotation, copyQuotation, getQuotationByDate, getQuotationByProduct,
	getQuotationDtl, setQuotationStatus,
	getSalesOrder, getSalesOrderDtl,
	getStockByLocation,
	getDeliveryByDate, getDeliveryDtl, getPhoto, addPhoto, delPhoto, setDelivered,
	getVisitPlan, addVisitPlan, 
	getSalesVisit,addSalesVisit,cekVisit, getVisitDetail,
	cekAttendance, addAttendance, getAttendance,
	getLeads, getLeadsById, addLeads, updLeads
}