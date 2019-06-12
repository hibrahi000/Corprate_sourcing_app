var mongoose = require('mongoose');
var key = require('../controllers/config/keys');
var Schema = mongoose.Schema;
var mongo = require('mongo');
var Employee = require('../controllers/models/Employee');
db = mongo.connect(key.purchaseLoginMongoURI, { useNewUrlParser: true });
let iv = require('../controllers/api/inputValidator');
mongoose
	.connect(key.ABHPHARMA_DB_CONNECT_URI, { useNewUrlParser: true })
	.then(() => console.log('Connected to ABH Pharma DB.....'))
	.catch((err) => console.log('connection failed'));

const employee = Employee.Employee;
const vendor = require('../controllers/models/Vendor').Vendor;

const vendSearch = 'TESTINGVENDOR';
const catSearch = 'TESTCATEGORY2';
let materialList = [ 'Testing' ];
let materialListTemp = [];
let material = 'TEST123';

// vendor.find({}).then((doc) => {
// 	// console.log(doc);
// 	// console.log(test);
// 	let category = test.Categories[test.Categories.findIndex((c) => c.CategoryName === catSearch)];
// 	console.log(category);
// 	// let material = category[0].Materials.filter(m => m === material);
// 	// console.log(material)
// });

let arr = [ 'Hello', ' kdo+pasd', 'kasd-jmaskl', 'kamsd,' ];
// arr = arr.join('');
// console.log(arr);
let checks = [ ' ', '_', '+', ',' ];

let v = checks.forEach((c) => {
	let valid = true;
	arr.indexOf(c) === -1 ? valid : valid;
});
// console.log(v)

const formatValid = (array) => {
	array = array.join('');
	let checks = [ ' ', '-', '+', ',' ];
	let valid = true;
	checks.forEach((c) => {
		if (array.indexOf(c) === -1) {
			console.log(`Check: '${c}' PASS`);
			valid = false;
		} else {
			console.log(`Check: ${c} FAIL`);
		}
	});
	return valid;
};

let vv = iv.checkFormatAndToUpperCase(arr);
console.log(vv);
