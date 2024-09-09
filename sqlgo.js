var {db, dbsfa} = require('./dbconfig');

var fs = require('fs');
var go = fs.readFileSync('./query/go.sql');
var q = JSON.parse(go);
const moment = require('moment');

async function findUser(userid) {
	try {
    const data = await db.one(q.tb_user.selectById, userid);
    if (data.id_people>0) {
      const sales = await db.one(q.tb_user.userInfo, data.id_people);
      data.namauser = sales.sales_nm;
      data.posisi = sales.sposition;

      const profile = await dbsfa.any(q.tb_user.cekprofile, data.userid);
      (profile.length > 0) ? data.isprofile = 1 : data.isprofile = 0;
    };
    
    //console.log(data);
    return data;
  } catch (error) {
    return error;
  }
};

async function findUserSFA(userid) {
	try {
    const data = await db.one(q.tb_user.selectBySFA, userid);
    if (data.id_people>0) {
      const sales = await db.oneOrNone(q.tb_user.userInfo, data.id_people);
      if (sales) {
        data.namauser = sales.sales_nm
        data.posisi   = sales.sposition
      } else {
        data.namauser = ''  // Isi dengan nilai default
        data.posisi   = ''
      }

      const profile = await dbsfa.any(q.tb_user.cekprofile, data.userid);
      (profile.length > 0) ? data.isprofile = 1 : data.isprofile = 0;
    } else {
      data.posisi   = ''
      data.isprofile = 0
    }
    
    //console.log(data);
    return data;
  } catch (error) {
    return error;
  }
};


async function changePasswd(par) {
	try{
		const data =  await db.any(q.tb_user.changePasswd, {par});
		//console.log(data);
		return data;
	}catch (error) {
		console.log('Error saat mengupdate data ' + error);
		return 'Error';
	}
};

async function addProfile(par) {
	try{
		const data =  await dbsfa.any(q.tb_user.addprofile, {par});
		//console.log(data);
		return data;
	}catch (error) {
		console.log('Error saat mengupdate data ' + error);
		return 'Error';
	}
};

async function getProfile(par) {
  try {
    const data = await db.any(q.dashboard.profile, {par})
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};


async function salesUserList(par) {
  try {
    const data = await db.any(q.tb_user.getsalesuser, par)
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

async function getSubOrdinate(par) {
  try {
    const data = await db.any(q.tb_user.getsubordinate, par)
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

//CUSTOMER
async function customerList(par) {
  try {
    const data = await db.any(q.tb_customer.customerListByUser, {par}) //---> Aplikasikan untuk Filter Sales Area
    //const data = await db.any(q.tb_customer.customerList, {par})     //---> All Customer
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

async function customerInfo(par) {
  try {
    //const data = await db.one(q.tb_customer.info, par)
    const data = await db.any(q.tb_customer.info, par)
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// Master Product
async function productList(par) {
	try {
    const data = await db.any(q.tb_product.productList, par);
    //console.log(data);
    return data;
    /*
    return db.task(async (t) => {
			const data = await db.any(q.tb_product.productList, par);
			//console.log(data);
			return data;
		});
    */
	}
	catch (error) {
		console.log('ERROR:', error);
	}
};

async function top5product() {
	try {
    const data = await db.any(q.tb_product.top5);
    //console.log(data);
    return data;
	}
	catch (error) {
		console.log('ERROR:', error);
	}
};

module.exports = {
  findUser, findUserSFA, changePasswd, addProfile, getProfile, 
  salesUserList, getSubOrdinate,
  productList, top5product,
  customerList, customerInfo
}