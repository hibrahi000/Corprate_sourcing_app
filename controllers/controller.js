/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////RREQUIRE SECTION////////////////////////////////////


var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mogo = require('mongo');
var nodemailer = require('nodemailer');
var authent = require('./authentication');









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////VARIABLE SECTION////////////////////////////////////////




var urlencodedParser = bodyParser.urlencoded({ extended : false});




 const purchaseEmail = 'hashmatibrahimi0711@gmail.com';
 const vend_name = 'test';
 const subject = `ABH Invoice From RECIEVED: FROM: ${vend_name}`;
 
 var abhRequest = '12 Orders Of 50 Kilograms';
 var material = 'Alpha GPC 50%';
    
   


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////DATA BASE SECTION////////////////////////////////////////////////////////


///////////////////////////////////////////connect to database//////////////////////////////


 
mongoose.connect(authent.mongoose_connect_authentication, {useNewUrlParser: true});

        //create a schema - this is like a blue pring

        var todoSchema = new mongoose.Schema({
            item: String
        });

        var Todo = mongoose.model('Todo', todoSchema);














/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////GET POST REQ SECTION////////////////////////////////////////////////////////


module.exports = (app) =>{
//////////////////////ABH VENDOR SITE////////////////////////////////////////////////////////


        app.get('/ABH_Invoice_Form', (req,res) =>{
            res.render( 'vendor/vendorFill',{abhRequest: abhRequest, material: material });
            
        });
        
        app.post('/ABH_Invoice_Form', urlencodedParser, (req,res) =>{

            var itemOne = Todo(
                {
                        
                        
                    item : 'buy flowers'
                
                
                
                
                }).save((err)=>{
                if(err) {throw err;}
                else{
                console.log('item saved');}
                });
                
                var data = []
                var urlencodedParser = bodyParser.urlencoded({ extended: false });
                
                



            console.log(req.body);



            console.log("Authenticating");
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: authent.email_userName_authentication,
                    pass: authent.email_password_authentication
                }
           
            });
            console.log('authenticated');
            const mailOptions = {
                from: vend_name, // sender address
                to: purchaseEmail, // list of receivers
                subject: subject, // Subject line
                html: `
                Response from vendor:<br><br><br>
                Material: ${material}<br><br>
                ABH Requested: ${abhRequest}<br><br>
                Min Order Quantity: ${req.body.moqIn}  ${req.body.measurement}<br>
                Price: ${req.body.priceIn}<br>
                Date In Stock: ${req.body.dateInStock}<br><br><br><br>



                Payment Terms: ${req.body.payTerms}<br>
                Shipping Date ${req.body.shippingDate}<br><br><br><br>


                Shipping Company Name:${req.body.shipCompName}<br>
                Shipping Company Address 1: ${req.body.shipAddress1}<br>
                Shipping Company Address 2: ${req.body.shipAddress2}<br>
                Shipping Company City: ${req.body.shipCity}<br>
                Shipping Company State: ${req.body.shipState}<br>
                Shipping Company Zip-Code: ${req.body.shipZip}<br>
                Shipping Company Start-Hour: ${req.body.shipStartHour}<br>
                Shipping Company End-Hour: ${req.body.shipEndHour}<br>
                `
            };
        
        
            transporter.sendMail(mailOptions, function (err, info) {
                if(err)
                console.log('Couldnt send email' +err)
                else
                console.log(info);
            });
            
            res.redirect('http://abhpharma.com');

        





        }); 




///////////////////////////////ABH PURCHASE SITE/////////////////////////////////////////////

    app.get('/ABH_Purchase_App', (req,res)=>{
        res.render('purchase/purchaseFill');
    });

    app.post('/ABH_Purchase_App', urlencodedParser, (req,res) =>{

    });
     
    
};