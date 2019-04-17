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

var employee = Employee.Employee;

employee.find({ FirstName: 'Hashmat' }, function(err, data) {
	if (err) throw err;
	var dat1 = { data };
	var dbDat = accessDBValue(dat1);
	console.log(dbDat.Email);
});
const userFromDb = employee.findOne({ name: 'Hashmat Ibrahimi' });

function accessDBValue(dbReturn) {
	var user = JSON.stringify(dbReturn);
	var start = 9;
	var end = user.length - 2;
	var sliceString = user.slice(start, end);
	return JSON.parse(sliceString);
}

// console.log(Date() + '------------')
