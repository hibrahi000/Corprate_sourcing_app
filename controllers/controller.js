/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////RREQUIRE SECTION////////////////////////////////////


var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongo = require('mongo');
var nodemailer = require('nodemailer');
const v = require('node-input-validator');
const key = require('./config/keys');
const { check, validationResult } = require('express-validator/check');
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
 

const User = require('./models/users');






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


///////////////////////////////////////////DataBase Schemas//////////////////////////////

    //Add User Schema

    const purchSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: Date.now
        }
        
    });
    const purchUser = mongoose.model('purchUser', purchSchema);













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
                            user: key.email_userName_authentication,
                            pass: key.email_password_authentication
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



        ///////////////////////////////ABH PURCHASE Welcome PAGE/////////////////////////////////

                app.get('/ABH_Purchase_App', urlencodedParser,(req,res) =>{

                    res.render('welcome');
                });

        ///////////////////////////////ABH PURCHASE SITE LOGIN PAGE/////////////////////////////////
            app.get('/ABH-Purchase/Login', urlencodedParser, (req,res) =>{
                res.render('purchase/purchaseFill');
            });

            app.post('/ABH_Purchase', urlencodedParser, (req,res) =>{

            });





        ///////////////////////////////ABH PURCHASE SITE/////////////////////////////////////////////

            // app.get('/ABH_Purchase_App', (req,res)=>{
            //     res.render('purchase/purchaseFill');
            // });

            

            passport.use(new LocalStrategy(function(username, password, done) {
                User.findOne({ username: username }, function(err, user) {
                if (err) { return done(err); }
                    if (!user)
                    {
                            return done(null, false, { message: 'Incorrect username.' });
                    }
            
                        if (!user.validPassword(password))
                {
            
                        return done(null, false, { message: 'Incorrect password.' });
                        }
                return done(null, false, { message: 'Incorrect password.' });
                });
                }
            ));
            




        ///////////////////////////////ABH ADMIN LOGIN/////////////////////////////////////////////


        //login
        app.get('/ABH-Admin/login', (req,res)=>{
            res.render('admin/login');
        });

        app.post('/ADMIN/login', urlencodedParser, (req,res) =>{
            
                res.render('admin/dashboard');
            
        });


        ///////////////////////////////ABH ADMIN SITE/////////////////////////////////////////////
        // Dashboard

            //add user link
            app.get('/ABH_ADMIN/Dashboard/addUser', (req,res) =>{
                res.render('admin/addUser');
            });



            // handel add user post req
            app.post('/ABH_ADMIN/Dashboard/addUser', urlencodedParser, (req,res) =>{
                mongoose.connect(key.purchaseLoginMongoURI,{useNewUrlParser:true})
                .then(() => console.log('Connected to Purchase Login DB.....'))
                .catch(err => console.log(err));

                const { firstName, lastName, Email, user_name, password1, password2} = req.body;
                
            
                let errors = [];
                //check required fields
                if(!firstName || !lastName || !Email || !user_name || !password1 || !password2){
                    errors.push({msg: 'Please fill in all fields'});
                }
                
                if(Email.search(".com") == -1){
                    errors.push({msg: 'please put a .com or .net or .etc'});
                }

                if(password1 !== password2){
                    errors.push({msg: "Passwords do not match"});
                }

                if(password1.length < 6) {
                    errors.push({msg: 'Password should be at least 6 characters'}); 
                }
                
                if(errors.length > 0){
                    console.log(errors);
                    res.render('admin/addUser',{
                        errors,
                        prevFirstName :firstName, 
                        prevLastName :lastName, 
                        prevEmail: Email,
                        prevUserName: user_name, 
                        prevPass1: password1, 
                        prevPass2: password2
                    });
                }
                else{
                User.findOne({user_name: user_name})
                .then(user =>{
                    if(user){
                       //user exists
                       res.render('admin/addUser', {
                          errors,
                          firstName,
                          lastName,
                          Email,
                          user_name
                       }); 
                    }

                    else{

                    }
                });
                res.render('admin/dashBoard');
                console.log(req.body);
                }

                
               mongoose.disconnect(key.purchaseLoginMongoURI)
               .then(() => console.log('Disconnected From Purchase Login DB.....'))
                .catch(err => console.log(err));

                

        
                
            });

            //remove user Link
            app.get('/ABH_ADMIN/Dashboard/removeUser', (req,res) =>{
                res.render('admin/removeUser');
            });

        app.post('/ABH_ADMIN/Dashboard', urlencodedParser, (req,res) =>{
            res.render('admin/dashboard');
            console.log(req.body);

        });

};