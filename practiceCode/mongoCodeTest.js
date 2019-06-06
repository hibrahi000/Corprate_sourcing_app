var mongoose = require('mongoose');
var key = require('../controllers/config/keys');
var Schema = mongoose.Schema;
var mongo = require('mongo');
var Employee = require('../controllers/models/Employee');
db = mongo.connect(key.purchaseLoginMongoURI, { useNewUrlParser: true });

mongoose
	.connect(key.ABHPHARMA_DB_CONNECT_URI, { useNewUrlParser: true })
	.then(() => console.log('Connected to ABH Pharma DB.....'))
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



vendor.find({}).then((doc) => {
	let vDoc = doc;
	console.log(vDoc[0].Email);
	let i = 0;
	// for (i; i <vDoc.length ; i++) {
	// 	let email = {
	// 		main: vDoc[i].Email,
	// 		cc: []
	// 	};
	// 	vendor.findByIdAndUpdate(vDoc[i]._id, { Email: email }).then(() => console.log('update completed '));
	// }

});
