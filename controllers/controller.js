///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                                                                         CONFIG/REQ/FUNCTIONS                                                                                             //

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






/////////////////////////////////////////RREQUIRE SECTION////////////////////////////////////


const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const key =require('./config/keys');
const passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const adminEnsureAuthenticated = require('./config/auth').adminEnsureAuthenticated;
const purchEnsureAuthenticated = require('./config/auth').purchEsureAuthenticated;
errors = [];

/////////////////////////////////////VARIABLE SECTION////////////////////////////////////////


var employee = require('./models/Employee').Employee;

var urlencodedParser = bodyParser.urlencoded({ extended : false});

const purchaseEmail = 'hashmatibrahimi0711@gmail.com';
const vend_name = 'test';
const subject = `ABH Invoice From RECIEVED: FROM: ${vend_name}`;

var abhRequest = '12 Orders Of 50 Kilograms';
var material = 'Alpha GPC 50%';






/////////////////////////////////////Functions////////////////////////////////////////////////////////

//Encrypt Pass -- DEBUG : TRUE
function passwordENCRYPT(pass,username){
    bcrypt.genSalt(10, (err, salt) => 
         bcrypt.hash(pass, salt, (err,hash) =>{
                if(err) throw err;
                //set password to hash
                connectABHPharmaDB();
                var query = {Username: username };
                var update = {Password : hash};

                employee.findOneAndUpdate(query,update, (err, doc)=>{
                  if(err)  throw err;
                  console.log(doc.Password);
                  disconnectABHPharmaDB();
                });

                // employee.find({Username : username},function(err,data){
                //     if(err) throw err;
                //     var info = (docManipEnable({data}));
                //     info.Password = hash; // info.(whatever the key is in mongoDB)
                //     console.log(hash);
                //     console.log(info.Password)

                //     disconnectABHPharmaDB();
                // });
               
        }));
    
    }

//connect to db --DEBUG : TRUE
function connectABHPharmaDB(theFunction){
    mongoose.connect(key.ABHPHARMA_DB_CONNECT_URI, {useNewUrlParser: true})
        .then(() => 
        theFunction,
        console.log('Connected to ABH Pharma DB.....'))
        .catch(err => console.log(err));    
}

//Disconnect to DB --DEBUG :TRUE
function disconnectABHPharmaDB(){
    mongoose.disconnect(key.ABHPHARMA_DB_CONNECT_URI)
        .then(() => console.log('Disconnected From ABH Pharma DB.....'))
        .catch(err => console.log(err));
}

//validate user login username and password
















module.exports = (app) =>{
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                                                                             GET POST ROUTES                                                                                              //

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
//                                                  Vendor Controls                                                    //
//                                                                                                                     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////ABH VENDOR SITE////////////////////////////////////////


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



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
//                                                  Welcome Page                                                       //
//                                                                                                                     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




        
app.get('/ABH_Purchase_App', urlencodedParser,(req,res) =>{

    res.render('welcome');
});    









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
//                                                  Purchase Controls                                                  //
//                                                                                                                     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        





        ///////////////////////////////ABH PURCHASE SITE LOGIN PAGE//////////
            app.get('/ABH_Purchase/Login', urlencodedParser, (req,res) =>{
                res.render('purchase/login');
                
            });

            app.post('/Purchase_login', urlencodedParser, (req,res,next) =>{
                console.log('recieved post req');
                connectABHPharmaDB();    
                passport.authenticate('purchPass', {
                    successRedirect : '/ABH_Purchase/Dashboard',
                    failureRedirect: '/ABH_Purchase/Login',
                    failureFlash : true
                } )(req, res, next);
            });



        ///////////////////////////////ABH PURCHASE SITE/////////////////////
            
        app.get('/ABH_Purchase/Dashboard', urlencodedParser,purchEnsureAuthenticated, (req,res) =>{
            res.render('purchase/quote');
            
        });

        app.post('/Purchase_Request', urlencodedParser, purchEnsureAuthenticated,(req,res,next) =>{

        });

        app.get('/ABH_Purchase/Modify_Vendor', urlencodedParser,purchEnsureAuthenticated, (req,res) =>{
            res.render('purchase/modvend');
            
        });

        app.post('/Modify_Vendor', urlencodedParser, purchEnsureAuthenticated,(req,res,next) =>{

        });

        app.get('/ABH_Purchase/Add_Vendor', urlencodedParser,purchEnsureAuthenticated, (req,res) =>{
            res.render('purchase/addvend');
            
        });

        app.post('/Add_Vendor', urlencodedParser,purchEnsureAuthenticated, (req,res,next) =>{

        });

        app.get('/ABH_Purchase/Logout', (req,res) =>{
                req.logout();
                req.flash('success_msg',`You have logged out`);
                res.redirect('/ABH_Purchase/Login');  
                disconnectABHPharmaDB();  
        });

     
     
            
    

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
//                                                  ADMIN Controls                                                     //
//                                                                                                                     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        



        ///////////////////////////////ABH ADMIN LOGIN///////////////////////

        
    
        //login
        app.get('/ABH_Admin/Login', (req,res)=>{
            
            
            res.render('admin/login');
        });

        app.post('/ADMIN_login', urlencodedParser, async (req,res,next) =>{ 
        
            console.log('recieved post req');
            connectABHPharmaDB();    
            passport.authenticate('adminPass', {
                successRedirect : '/ABH_ADMIN/Dashboard',
                failureRedirect: '/ABH_Admin/Login',
                failureFlash : true
            } )(req, res, next);
        });

    





        ///////////////////////////////ABH ADMIN SITE////////////////////////

        

            // Dashboard
            app.get('/ABH_ADMIN/Dashboard',adminEnsureAuthenticated,(req,res) =>{
                res.render('admin/dashboard');
            });

            //add user link
                    //Add user profile
            app.get('/ABH_ADMIN/Dashboard/addUser', adminEnsureAuthenticated,(req,res) =>{
                
              
                firstName = '',
                lastName = '',
                user_name = '',
                Email = '',
                department = '',
                cell = '',
        
                res.render('admin/addUser',{errors,firstName : firstName, lastName : lastName, user_name : user_name, Email: Email, department: department, cell : cell});
                console.log(firstName, lastName,user_name, Email, department, cell);
            });


            

            // handel add user post req
            app.post('/ABH_ADMIN/Dashboard/addPassword', urlencodedParser,adminEnsureAuthenticated, (req,res) =>{
                

                const { firstName, lastName,user_name, Email, department, cell } = req.body;
                var scheduel = ['9 to 5','9 to 5','9 to 5','9 to 5','9 to 5',]
                console.log(req.body );

               
                        //Add User Profile then disconnect 
                employee.findOne({Username : user_name},function(err,data){
                    if(data === null){
                         console.log('begining addition to Employee Collection');
                         

                         var createEmployee = employee(
                                 {FirstName : firstName,
                                LastName : lastName,
                                Email: Email,
                                Cell : cell,
                                Department : department,
                                Admin : false,
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
                              
                              
                             }
                           });     
                           
                           res.render('admin/userPassword',{user_name : user_name});
                           
                        
                    }
                    else{
                        
                        errors.push({msg :'Username is already taken please pick another'});
                        res.render('admin/addUser',{errors,firstName : firstName, lastName : lastName,user_name : user_name,Email: Email, department: department, cell : cell})
                        errors.pop();
                        console.log(data);
                        
                    }
                });
            });



            app.post('/ABH_ADMIN/Dashboard/', urlencodedParser,adminEnsureAuthenticated, (req,res) =>{
                const {password1, user_name} = req.body;
                
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(password1, salt, (err,hash) =>{
                        if(err) throw err;

                        //set password to hash
                       
                        var query = {Username: user_name };
                        var update = {Password : hash};

                        employee.findOneAndUpdate(query,update, (err, doc)=>{
                        if(err) { 
                            console.log('err');
                           
                            throw err;
                        }
                        else{
                            console.log(doc.Password);
                          
                         
                            req.flash('success_msg',`You succesfully added your password to ${doc.FirstName} ${doc.LastName}'s profile`);
                            res.redirect('/ABH_ADMIN/Dashboard/')

                            console.log(req.body);
                        }
                    });
                }));
            
            });

            //remove user Link
            app.get('/ABH_ADMIN/Dashboard/removeUser',adminEnsureAuthenticated, (req,res) =>{
                res.render('admin/removeUser');
            });
            app.post('/ABH_ADMIN/Dashboard/removeUser',urlencodedParser ,adminEnsureAuthenticated, (req,res) =>{
                console.log(req.body);
                var {username, password1} = req.body;
                
                employee.findOne({Username : username})
                     .then(empl =>{
                        if(!empl){
                            console.log('not found');
                            req.flash('error_msg',"Invalid Username");
                                res.redirect('/ABH_ADMIN/Dashboard/removeUser');
                        }
                        else{
                        //match password
                        bcrypt.compare(password1, empl.Password, (err, isMatch) =>{
                            if(err) throw err;

                            if(isMatch){
                                    employee.findOneAndDelete({Username : username}).then(
                                    req.flash('success_msg','User has been REMOVED from ABH Data Base'),
                                    res.redirect('/ABH_ADMIN/Dashboard/removeUser'),
                                    )
                                    .catch(console.log(err));
                            }
                            else{
                                req.flash('error_msg','Invalid Password');
                                res.redirect('/ABH_ADMIN/Dashboard/removeUser');
                             }
                        });
                    }
                })
                .catch(err => console.log(err));
            });
            

            app.post('/ABH_ADMIN/Dashboard', urlencodedParser,adminEnsureAuthenticated, (req,res) =>{
            res.render('admin/dashboard');
            console.log(req.body);

            });


            app.get('ABH_ADMIN/logout',(req,res) =>{
                    req.logout();
                    req.flash('success_msg',`You have logged out`);
                    res.redirect('/ABH_Admin/Login');  
                    disconnectABHPharmaDB();  
            });

};

