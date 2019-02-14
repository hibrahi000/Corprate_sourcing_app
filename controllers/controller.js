var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mogo = require('mongo');
var urlencodedParser = bodyParser.urlencoded({ extended : false});
var nodemailer = require('nodemailer');


//connect to database
mongoose.connect('mongodb://admin:admin123@ds018258.mlab.com:18258/abh_material', {useNewUrlParser: true});



//create a schema - this is like a blue pring

var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);

var itemOne = Todo({item : 'buy flowers'}).save((err)=>{
if(err) {throw err;}
else{
console.log('item saved');}
});

var data = [{item: 'get milk'}, {item:'walk dog'}, {item: 'kick some coding ass'}]
var urlencodedParser = bodyParser.urlencoded({ extended: false });

















module.exports = (app) =>{

    app.get('/', (req,res) =>{
        res.render( 'vendor/vendorFill');
        
    });
    
    app.post('/', urlencodedParser, (req,res) =>{
        console.log(req.body);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                   user: 'hashmatibrahimi0711@gmail.com',
                   pass: 'Hibrahi00!@#'
               }
           });
    
           const mailOptions = {
            from: 'TESTEMAIL', // sender address
            to: 'hibrahi000@icloud.com', // list of receivers
            subject: 'test', // Subject line
            html: '<p>this is a test</p>'// plain text body
          };
    
    
        transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
         });
        
        res.redirect('http://abhpharma.com');

    





     }); 








    






    app.get('/test', (req,res) =>{
        res.render( 'test');
    });









    app.get('/purchase', (req,res)=>{
        res.render('purchase/purchaseFill');
    });

     
    
};