

/////////////////////////////////////////RREQUIRE SECTION////////////////////////////////////


const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const db = require('./config/keys').ABHPHARMA_DB_CONNECT_URI;
const key =require('./config/keys');
const passport = require('passport');
LocalStrategy = require('passport-local').Strategy;

const mongoUtil = require('./mongoUtil.js');



/////////////////////////////////////VARIABLE SECTION////////////////////////////////////////


var employee = require('./models/Employee');

var urlencodedParser = bodyParser.urlencoded({ extended : false});




 const purchaseEmail = 'hashmatibrahimi0711@gmail.com';
 const vend_name = 'test';
 const subject = `ABH Invoice From RECIEVED: FROM: ${vend_name}`;
 
 var abhRequest = '12 Orders Of 50 Kilograms';
 var material = 'Alpha GPC 50%';
    
   



/////////////////DATA BASE SECTION////////////////////////////////////////////////////////







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

            



            




        ///////////////////////////////ABH ADMIN LOGIN/////////////////////////////////////////////

        
        //login
        app.get('/ABH-Admin/login', (req,res)=>{
            res.render('admin/login');
        });

        app.post('/ADMIN/login', urlencodedParser, (req,res,next) =>{
            
            passport.authenticate('local', {
                successRedirect : 'admin/dashboard',
                failureRedirect : 'admin/login',
                failureFlash : true
                
            })(req,res,next);
        });


        ///////////////////////////////ABH ADMIN SITE/////////////////////////////////////////////
        // Dashboard
        error = [];
            //add user link
            
            app.get('/ABH_ADMIN/Dashboard/addUser', (req,res) =>{
              
                firstName = '',
                lastName = '',
                user_name = '',
                Email = '',
                department = '',
                cell = '',
        
                res.render('admin/addUser',{error,firstName : firstName, lastName : lastName, user_name : user_name, Email: Email, department: department, cell : cell});
                console.log(firstName, lastName,user_name, Email, department, cell);
            });

            // handel add user post req
            app.post('/ABH_ADMIN/Dashboard/addPassword', urlencodedParser, (req,res) =>{
                

                const { firstName, lastName,user_name, Email, department, cell } = req.body;
                var scheduel = ['9 to 5','9 to 5','9 to 5','9 to 5','9 to 5',]
                console.log(req.body );

                mongoUtil.connectABHPharmaDB();

                employee.Employee.findOne({Username : user_name},function(err,data){
                    if(data === null){
                         console.log('begining addition to Employee Collection');

                         var createEmployee = employee.Employee(
                                 {FirstName : firstName,
                                LastName : lastName,
                                Email: Email,
                                Cell : cell,
                                Department : department,
                                Admin : true,
                                Scheduel : {
                                    Monday : scheduel[0],
                                    Tuesday : scheduel[1],
                                    Wedensday : scheduel[2],
                                    Thursday : scheduel[3],
                                    Friday : scheduel[4],
                                },
                                Username : user_name,
                                Password : 'null'                
                            
                             })
                    
        
                        createEmployee.save((err) =>{
                                if(err){console.log(err)}
                                else{
                                console.log('Employee Profile Saved');
                                // req.flash('succes_msg', `You Have now registered ${firstName} ${lastName}`)
                                 mongoUtil.disconnectABHPharmaDB();
                             }
                           });     
                           
                           res.render('admin/userPassword',{user_name : user_name});
                           
                        
                    }
                    else{
                    
                        error.push({msg :'Username is already taken please pick another'});
                        res.render('admin/addUser',{error,firstName : firstName, lastName : lastName,user_name : user_name,Email: Email, department: department, cell : cell})
                        error.pop();
                        console.log(data);
                        
                    }
                });

              
                
            
                // let errors = [];
                // //check required fields
                // if(!firstName || !lastName || !Email || !user_name ){
                //     errors.push({msg: 'Please fill in all fields'});
                // }
                
                // if(Email.search(".com") == -1){
                //     errors.push({msg: 'please put a .com or .net or .etc'});
                // }

                
                
                // if(errors.length > 0){
                //     console.log(errors);
                //     res.render('admin/addUser',{
                //         errors,
                //         prevFirstName :firstName, 
                //         prevLastName :lastName, 
                //         prevEmail: Email,
                //         prevUserName: user_name, 
                //         prevPass1: password1, 
                //         prevPass2: password2
                //     });
                // }
                // else{
                // User.findOne({user_name: user_name})
                // .then(user =>{
                //     if(user){
                //        //user exists
                //        res.render('admin/addUser', {
                //           errors,
                //           firstName,
                //           lastName,
                //           Email,
                //           user_name
                //        }); 
                //     }

                //     else{

                //     }
                // });
                // res.render('admin/userPassword');
                // console.log(req.body);
                // }

                
            //    mongoose.disconnect(db)
            //    .then(() => console.log('Disconnected From Purchase Login DB.....'))
            //     .catch(err => console.log(err));

                

        
                
            });

            app.post('/ABH_ADMIN/Dashboard/', urlencodedParser, (req,res) =>{
                const {password1, user_name} = req.body;
                mongoUtil.passwordENCRYPT(password1,user_name);
                res.render('admin/dashboard')
                console.log(req.body);
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

