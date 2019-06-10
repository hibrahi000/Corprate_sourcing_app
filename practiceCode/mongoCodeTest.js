var mongoose = require('mongoose');
var key = require('../controllers/config/keys');
var Schema = mongoose.Schema;
var mongo = require('mongo');
var Employee = require('../controllers/models/Employee');
db = mongo.connect(key.purchaseLoginMongoURI, { useNewUrlParser: true });

mongoose
	.connect(key.ABHPHARMA_DB_CONNECT_URI, { useNewUrlParser: true })
	.then(() => {console.log('Connected to ABH Pharma DB.....'); console.log(logSomeName());})
	.catch((err) => console.log('connection failed'));

const employee = Employee.Employee;
const vendor = require('../controllers/models/Vendor').Vendor;
// employee.find({ FirstName: 'Hashmat' }, function(err, data) {
// 	if (err) throw err;
// 	var dat1 = { data };
// 	var dbDat = accessDBValue(dat1);
// 	console.log(dbDat.Email);
// });
// const userFromDb = employee.findOne({ name: 'Hashmat Ibrahimi' });

// console.log(Date() + '------------')



// vendor.findOne({VendorName: 'VENDORABHPHARMA'}).then((vdoc) => {
// 	let vProfile = vdoc;
// 	console.log(vProfile.Email.main)
// 	// for (let i = 0; i < vDoc.length ; i++) {
// 	// 	vDoc[i].key = [];
// 	// 	console.log(vDoc[i].VendorName)
// 	// 	console.log(vDoc[i].key)
// 	// 	vendor.findByIdAndUpdate(vDoc[i]._id, {key : vDoc[i].key }).then(() => console.log('update completed '));
// 	// }

// });

const logSomeName = async() =>{

	const testVendor = await vendor.findOne({VendorName: 'VENDORABHPHARMA'});

	return testVendor;
}
