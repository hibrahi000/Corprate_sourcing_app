var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mogo = require('mongo');
var urlencodedParser = bodyParser.urlencoded({ extended : false});
var nodemailer = require('nodemailer');
var todoController = require('./controllers/controller');




//setup template engine
app.set('view engine', 'ejs');

//static files 
app.use(express.static(__dirname + "/assets"))


//fire controlers
todoController(app);


//airtable function assign

//listen to port /
app.listen(3000);

console.log('You Are Listening To Port 3000');
console.log("-------------------------------");

