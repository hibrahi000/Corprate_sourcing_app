var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended : false});
var nodemailer = require('nodemailer');



var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'key5VS3vwOhMgKa6w'
});
var base = Airtable.base('appuLLVZYd6a8K1mD');




var venNam = base('Table 1').find('Vendor Name', function(err, record) {
    if (err) { console.error(err); return; }
    console.log(record);
});




//setup template engine
app.set('view engine', 'ejs');

//static files 
app.use(express.static(__dirname + "/assets"))

app.get('/', (req,res) =>{
    res.render( 'index');
});
//fire controlers
























//airtable function assign










//listen to port /
app.listen(3000);

console.log('You Are Listening To Port 3000');
console.log("-------------------------------");

