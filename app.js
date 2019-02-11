var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mogo = require('mongo');
var urlencodedParser = bodyParser.urlencoded({ extended : false});
var nodemailer = require('nodemailer');





//setup template engine
app.set('view engine', 'ejs');

//static files 
app.use(express.static(__dirname + "/assets"))

app.get('/', (req,res) =>{
    res.render( 'index');
});
app.get('/demo', (req,res) =>{
    res.render( 'demo');
});
app.get('/test', (req,res) =>{
    res.render( 'test');
});
app.get('/purchase', (req,res)=>{
    res.render('purchaseFill');
});
//fire controlers



//airtable function assign

//listen to port /
app.listen(3000);

console.log('You Are Listening To Port 3000');
console.log("-------------------------------");

