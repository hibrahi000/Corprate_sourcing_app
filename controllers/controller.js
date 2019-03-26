///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                                                                         CONFIG/REQ/FUNCTIONS                                                                                             //

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






/////////////////////////////////////////RREQUIRE SECTION////////////////////////////////////


const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

var domain = 'mg.abhpharma.com';
var mailKey = '57375a29bc8e51168e4b4f7b8ec33237-e51d0a44-59fed9f0';


var testDomain = 'sandboxbea89a78a03645cdb62d1e7b3bf42301.mailgun.org';
var testMailKey = '57375a29bc8e51168e4b4f7b8ec33237-e51d0a44-59fed9f0';


var mailgun = require('mailgun-js')({apiKey: mailKey, domain: domain});

const bcrypt = require('bcryptjs');
const key =require('./config/keys');
const passport = require('passport');
LocalStrategy = require('passport-local').Strategy;

const adminEnsureAuthenticated = require('./config/auth').adminEnsureAuthenticated;
const purchEnsureAuthenticated = require('./config/auth').purchEsureAuthenticated;
let errors = [];
var admin = 'dashboard';
var purchase = 'dashboard';
var userName = '';
var clicked = false;
/////////////////////////////////////VARIABLE SECTION////////////////////////////////////////


var employee = require('./models/Employee').Employee;
var mat = require('./models/Material').Material;
var vendor = require('./models/Vendor').Vendor;
var receipt = require('./models/QuoteRecipts').QuoteReceipt;
var urlencodedParser = bodyParser.urlencoded({ extended : false});

const purchaseEmail = 'hashmatibrahimi0711@gmail.com';








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
                //   console.log(doc.Password);
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
// console.log("Authenticating");
// var transporter = nodemailer.createTransport({
//     // service: 'gmail',
//     // auth: {
//     //     user: key.email_userName_authentication,
//     //     pass: key.email_password_authentication
//     // }

//     host: 'smtp.office365.com', // Office 365 server
//         port: 587,     // secure SMTP
//         secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
//         auth: {
//             user: key.outlook_userName_authentication,
//             pass: key.outlook_password_authentication
//         },
//         tls: {
//             ciphers: 'SSLv3'
//         }
// });

let transporter = mailgun.messages();
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
                    const{vendorName,key,newMaterial} = req.query;
                    // console.log(vendorName);
                    console.log(req.query);
                    // console.log(key !== null);
                    function resetVendorKey(){
                        bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash('PharmaDebug)!54', salt, (err,hash) =>{
                            if(err) throw err;
                            hashKey = hash;
                            vendor.findOneAndUpdate({VendorName :vendorName},{key:hashKey},{newMaterial: newMaterial}).then(console.log('Times Up Cannot Use this from anymore')).catch(err);
                        })
                        )
                    }
                    console.log(key === '');
                    console.log(key === undefined);
                    console.log(key === null );
                    if(key !== undefined && key !== '' && key !== null){
                        vendor.findOne({VendorName:vendorName})
                        .then(vendor =>{
                         console.log('printin' +key);
                        bcrypt.compare(key,vendor.key)
                            .then(isMatch =>{
                                if(isMatch && vendor.clicked === false){
                                    let time =  1000   *   60   * 60   *   24    *  2;
                                            //miliSec    sec     min    hours     days    
                                    setTimeout(resetVendorKey,time);                  
                                    res.render( 'vendor/vendorFill',{qs : req.query}); 
                                }
                                else {
                                    res.render('404Page');    
                                }
                            }).catch(err);
                    
                        

                        
                         }).catch();
                    } 
                    else{
                        res.render('404Page');
                    }  

                });
                
                app.post('/ABH_Invoice_Form', urlencodedParser, (req,res) =>{

                    // console.log(req.body);

                    const{vendorName,material,abhRequest,itemCode,ammount,measurement,priceIn,priceType,inStock,dateInStock,payType,payTerms,shippingDate,shipCompName,shipAddress1,shipAddress2,shipCity,shipState,shipZip,shipCountry,notes,newMaterial} = req.body;
                    console.log(req.body);
                    var DateInStock = dateInStock;
                    var InStock = inStock;
                    var isNew = ''
                    const query = {VendorName : vendorName};
                    const update = {
                        PayType: payType,
                        PayTerms: payTerms,
                        shipCompName: shipCompName,
                        shipAddress1: shipAddress1,
                        shipAddress2: shipAddress2,
                        shipCity: shipCity,
                        shipState: shipState,
                        shipZip : shipZip,
                        shipCountry: shipCountry
                    }

                    vendor.findOneAndUpdate({VendorName : vendorName},update).then().catch();

                    if(newMaterial === 'true'){
                        isNew = 'YES'
                    }
                    else{
                        isNew = 'NO'
                    }

                    if(InStock == 'on'){
                        InStock = 'Yes';
                        DateInStock = Date.now();
                    }
                    else{
                        InStock = 'No';
                    }
                    vendor.findOne(query).then(theVendor =>{
                    const mailOptionsVendForm = {
                        from: `${vendorName} <${theVendor.Email}>`,// sender address
                        to: '<tech@abhpharma.com>, <purchase@abhpharma.com>,<test-93qyi@mail-tester.com>,<hashmat.ibrahimi@lc.cuny.edu>', // list of receivers
                        subject: `${vendorName} Request Submission For ${material}`,
                        html: 
                        `
                        NEW MATERIAL: ${isNew} <br>   
                        Response from vendor: ${vendorName}<br><br>
                        Material: ${material}<br>
                        ABH Requested: ${abhRequest}<br><br>
                        Item Code: ${itemCode} <br>
                        Min Order Quantity: ${ammount}  ${measurement}<br>
                        Price: ${priceIn} USD  ---- ${priceType}<br>
                        In Stock : ${InStock}<br>
                        Date In Stock: ${DateInStock}<br><br><br><br>


                        Payment Type: ${payType}<br>
                        Payment Terms: ${payTerms}<br>
                        Shipping Date ${shippingDate}<br><br><br>


                        Shipping Company Name:${shipCompName}<br>
                        Shipping Company Address 1: ${shipAddress1}<br>
                        Shipping Company Address 2: ${shipAddress2}<br>
                        Shipping Company City: ${shipCity}<br>
                        Shipping Company State: ${shipState}<br>
                        Shipping Company Zip-Code: ${shipZip}<br>
                        
                        Notes left by ${vendorName} : <br> ${notes}.



                        <br><br>
                        The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
                        Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729
                        `
                    };
                
                    var createReceipt = receipt({
                        VendorName: vendorName,
                        Material: material,
                        ABH_Request: abhRequest,
                        Item_Code: itemCode,
                        Ammount: ammount+" "+measurement,
                        Price: priceIn,
                        Price_Type: priceType,
                        In_Stock: inStock,
                        Date_In_Stock: dateInStock ,
                        PayType:payType ,
                        PayTerms:payTerms ,
                        ShippingDate :shippingDate,
                        Shipping_Company_Name: shipCompName,
                        Ship_Address1:shipAddress1 ,
                        Ship_Address2: shipAddress2,
                        Ship_City: shipCity,
                        Ship_State :shipState,
                        Ship_Zip:shipZip ,
                        Ship_Country : 'USA',
                        Notes: notes ,
                    });
                    
                    createReceipt.save((err) =>{
                        if(err){console.log(err)}
                        else{
                            console.log('Submission Recieved And Stored')
                        }
                    })

                    transporter.send(mailOptionsVendForm, function (err, info) {
                        if(err)
                        console.log('Couldnt send email' +err)
                        else
                        null
                        console.log(info);
                        res.redirect('https://abhpharma.com/');
                    });
                });
                    
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash('PharmaDebug)!54', salt, (err,hash) =>{
                            if(err) throw err;
                            hashKey = hash;
                            vendor.findOneAndUpdate({VendorName :vendorName},{key:hashKey}).then(console.log('Times Up Cannot Use this from anymore')).catch(err);
                        })
                    );

                    if(isNew === 'YES'){
                        mat.findOne({MaterialName:material}).then(material =>{
                            let vendorList = [];
                            for(let i =0; i < material.Vendors.length; i++){
                                vendorList.push(material.Vendors[i])
                            }
                            vendorList.push(vendorName);
                            mat.findOneAndUpdate({MaterialName : Material},{Vendors : vendorList});///// This is where we left off we need to find a way to test this maybe createing a testing database or somthing 
                            
                        })
                    }
                    else{

                    }
            
                }); 

                app.get('/Do_Not_Supply' , urlencodedParser, (req,res) =>{
                    const{vendorName,key,newMaterial, material} = req.query;
                    console.log('recieved request to remove');
                    console.log(vendorName);
                    console.log(req.query);
                    // console.log(key !== null);
                    function resetVendorKey(){
                        bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash('PharmaDebug)!54', salt, (err,hash) =>{
                            if(err) throw err;
                            hashKey = hash;
                            vendor.findOneAndUpdate({VendorName :vendorName},{key:hashKey},{newMaterial: newMaterial}).then(console.log('Times Up Cannot Use this from anymore')).catch(err);
                        })
                        )
                    }
                    // console.log(key === '');
                    // console.log(key === undefined);
                    // console.log(key === null );
                    if(key !== undefined && key !== '' && key !== null){
                        
                        
                        vendor.findOne({VendorName:vendorName})
                        .then(vendors =>{
                            console.log('printin' +key);
                            bcrypt.compare(key,vendors.key)
                                .then(isMatch =>{
                                    if(isMatch && vendors.clicked === false){
                                        resetVendorKey();
                                        if(newMaterial === 'No'){
                                            console.log('new Material == No');
                                            let vendMatList = []
                                            for(let i =0; i< vendors.Material.length; i++){
                                                vendMatList.push(vendors.Material[i]);
                                            }
                                            let matIndex = vendMatList.indexOf(material);
                                            vendMatList.splice(matIndex, 1);
                                            console.log(vendors.Material.length);
                                            console.log(vendMatList);
                                            console.log(matIndex);

                                    
                                            vendor.findOneAndUpdate({VendorName : vendorName}, { Material : vendMatList})
                                            .then( vend =>{
                                                mat.findOne({MaterialName : material}).then(matDoc =>{
                                                let vendorList = [];
                                                for(let i =0; i< matDoc.Vendors.length; i++){
                                                    vendorList.push(matDoc.Vendors[i]);
                                                }
                                                let vendIndex = vendorList.indexOf(vendorName);
                                                vendorList.splice(vendIndex,1);
                                                
                                                mat.findOneAndUpdate({MaterialName : material},{Vendors: vendorList}).then(matDoc =>{
                                                    console.log('Update Materials')

                                                        console.log(matDoc);
                                                        console.log(matDoc.Vendors[0] === undefined);
                                                        mat.findOne({MaterialName : material}).then( matDoc =>{
                                                            console.log(material.Vendors);
                                                            
                                                        if(matDoc.Vendors[0] === undefined){
                                                            mat.findOneAndDelete({MaterialName : material}).then('unsibscription caused this material to no be avalible anymore').catch();

                                                                const mailOptionsVendUnsubscibeNewDel = {
                                                                    from: `${vendorName} <${vend.Email}>`, // sender address
                                                                    to: ' <ins-fhljqql2@isnotspam.com>', // list of receivers
                                                                    subject: `${vendorName} Unsubscription For ${material} ---MATERIAL REMOVED---`,
                                                                    html: 
                                                                    `Since ${vendorName} requested to be removed from the email chain for material: ${material}, we dont have any vendors that support it so it was removed from the database. <br><br> If the vendor contacts you to undo this change you can always re-add the material in the <em>Modify Vendor<em> Page in the purchase app. All you will have to do is: <br> 1) search for the vendors name<br>2)Add the material ** Spaces should be replaced with dashes and multiple materials should be comma seperated AND no spaces before or after the commas <br> 3)Then click save
                                                                    
                                                                    
                                                                    <br><br>
                                                                    The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
                                                                    Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729
                                                                    
                                                                    `
                                                                }
                                                                transporter.send(mailOptionsVendUnsubscibeNewDel, function (err, info) {
                                                                    if(err)
                                                                    console.log('Couldnt send email' +err)
                                                                    else
                                                                    null
                                                                    // console.log(info);
                                                                    res.render('vendor/materialRemoved');
                                                                });
                                                            
    
                                                        }
                                                        else{
                                                            const mailOptionsVendUnsubscibeNew = {
                                                                from: `${vendorName} <${vend.Email}>`, // sender address
                                                                to: '<tech@abhpharma.com>,<purchase@abhpharma.com>', // list of receivers
                                                                subject: `${vendorName} Unsubscription For ${material}`,
                                                                html: 
                                                                `Since ${vendorName} requested to be removed from the email chain for material: ${material}. <br><br> If the vendor contacts you to undo this change you can always re-add the material in the <em>Modify Vendor<em> Page in the purchase app. All you will have to do is: <br> 1) search for the vendors name<br>2)Add the material ** Spaces should be replaced with dashes and multiple materials should be comma seperated AND no spaces before or after the commas <br> 3)Then click save
                                                                
                                                                
                                                                
                                                                
                                                                <br><br>
                                                                The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
                                                                Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729
                                                                `
                                                            }
                                                            transporter.send(mailOptionsVendUnsubscibeNew, function (err, info) {
                                                                if(err)
                                                                console.log('Couldnt send email' +err)
                                                                else
                                                                null
                                                                // console.log(info);
                                                                res.render('vendor/materialRemoved');
                                                            });
                                                        }
                                                    }).catch();
                                                }).catch()
                                            });
                                            
                                        }).catch();
                                          }
                                        else{
                                           
                                            res.render( 'vendor/materialRemoved'); 


                                            console.log('else');
                                            const mailOptionsUnsubscribe = {
                                                from: `${vendorName} <${vendors.Email}>`, // sender address
                                                to: '<tech@abhpharma.com>,<purchase@abhpharma.com>', // list of receivers
                                                subject: `${vendorName} Request Removal From Email Chain For New Material: ${material}`,
                                                html: 
                                                `Since ${vendorName} requested to be removed from the email chain for material: ${material}, we dont have any vendors that support it so it was removed from the database. <br><br> If the vendor contacts you to undo this change you can always re-add the material in the <em>Modify Vendor<em> Page in the purchase app. All you will have to do is: <br> 1) search for the vendors name<br>2)Add the material ** Spaces should be replaced with dashes and multiple materials should be comma seperated AND no spaces befor or after the commas <br> 3)Then click save
                                                
                                                
                                                
                                                <br><br>
                                                The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
                                                Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729
                                                
                                                `
                                            }
                                            transporter.send(mailOptionsUnsubscribe, function (err, info) {
                                                if(err)
                                                console.log('Couldnt send email' +err)
                                                else
                                                null
                                                // console.log(info);
                                                res.render('vendor/materialRemoved');
                                            });
                                        }  
                                    }
                                    else {
                                        res.render('404Page');    
                                    }
                                }).catch();
                        }).catch();
                    } 
                    else{
                        res.render('404Page');
                    }  

                });
                


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
//                                                  Welcome Page                                                       //
//                                                                                                                     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




        
app.get('/', urlencodedParser,(req,res) =>{

   

    res.render('welcome');
});    









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
//                                                  Purchase Controls                                                  //
//                                                                                                                     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        





        ///////////////////////////////ABH PURCHASE SITE LOGIN PAGE//////////
            app.get('/ABH_Purchase/Login', urlencodedParser, (req,res) =>{
                res.render('purchLogin');
                
            });

            app.post('/Purchase_login', urlencodedParser, (req,res,next) =>{
                // console.log('recieved post req');
                connectABHPharmaDB();    
                passport.authenticate('purchPass', {
                    successRedirect : '/ABH_Purchase/Dashboard',
                    failureRedirect: '/ABH_Purchase/Login',
                    failureFlash : true
                } )(req, res, next);
            });



        ///////////////////////////////ABH PURCHASE SITE/////////////////////
            
        app.get('/ABH_Purchase/Dashboard', urlencodedParser,purchEnsureAuthenticated, (req,res) =>{
            mat.find({}).then(material =>{
            
                var materials = [];
                // console.log(material.length);
                for (let i = 0; i < material.length; i++) {
                     materials.push(material[i].MaterialName);
                }
                // console.log(materials);
                 purchase = 'reqQuote';
                 res.render('purchDashboard',{purchase,materials});
           
            })
        });

        app.post('/Material_Request', urlencodedParser, purchEnsureAuthenticated, (req,res,next) =>{
            const{material, newMat} = req.body;
            let newMaterial = 'No';
            if(newMat === 'on'){
                newMaterial = 'Yes';
            }
            let dbQuery ='noSearch';

            //allow user to add new materials but check for the following:


            // 1) if new material is checked skip the vendor search and go straight to creating a new material 
            console.log('new material')
            console.log(newMat);
            
            if(newMaterial == 'Yes'){
                mat.findOne({MaterialName: material}).then(dbMat =>{
                    if(dbMat === null){
                        var createMaterial = mat({ //create the material and add vendors name into the list of vendors
                            MaterialName: material
                            
                        });
                        createMaterial.save((err) =>{ //save the document for future use 
                            if(err){console.log(err)}
                            else{
                            console.log('Material Added to Database');
                            }
                        });    
                        purchase = 'submitReq';
                        res.render('purchDashboard',{purchase,material,newMaterial,dbQuery})
                    }
                    else{
                        req.flash('error_msg','This Material is already in the database so we cannot create a new one please uncheck New Material then proceed with your request')
                        res.redirect('/ABH_Purchase/Dashboard');
                    }
                }).catch();
            }
            else{
                mat.findOne({MaterialName: material}).then(mat =>{
                   console.log('starting test on db search');
                    console.log(mat === null);
                    if(mat === null){
                        console.log('now entering');
                        req.flash('error_msg', 'We cannot find the material You searched for if you would like to send a request for a new material check New Material to Yes.   WARNING: this action will send a request to all of the vendors in the database');
                        purchase = 'reqQuote';
                        res.redirect('/ABH_Purchase/Dashboard');
                    }
                    else{
                        let material = mat.MaterialName;
                        dbQuery = 'search'
                        purchase = 'submitReq';
                        res.render('purchDashboard',{purchase,material,newMaterial,dbQuery})
                    }
                }).catch();
            }

     

            //3) make it so that when the post request is made that it gets sent to all the vendors by setting the vendor search to be {} insetead of a specific material

            //4) on the vendor side make sure that if a vendor responds to the form that they get added to the material db that they supply that material and also their profile gets updated as well

            //5) if new material isnt checked then send the db query to equal the search for Material : material (send material)
        });


        // app.get('Purchase_Request', urlencodedParser, purchEnsureAuthenticated,(req,res,next) =>{
            
            
        // });

        app.post('/Purchase_Request', urlencodedParser, purchEnsureAuthenticated,(req,res,next) =>{
            const {material,reqType,ammount,units,price,rushOrder,notes,newMat,dbQuery} = req.body;
            console.log(req.body);
            let newMaterial =false;
            if(newMat === 'Yes'){
            newMaterial = true;
            }
            console.log(newMaterial);
            let query = {};
            
            if(dbQuery === 'search'){
                query = {Material : material};
            }

            console.log(query);

            vendor.find(query).then(vendors =>{
                let vendorContact = [];
                for(let i =0; i< vendors.length; i++){
                    vendorContact.push(vendors[i].Email);
                }
                console.log(vendorContact);
                console.log('------------------');
                console.log(vendors)
                for(let i = 0; i< vendorContact.length; i++){
                    var tempKey = Math.random().toString(36).slice(-8);
                    // var tempKey = 'PharmaDebug)!54';
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(tempKey, salt, (err,hash) =>{
                            if(err) throw err;
                            hashKey = hash;
                            vendor.findOneAndUpdate({Email :vendorContact[i]},{key:hashKey}).then(console.log(`key has been updated for deployment for ${vendorContact[i]}`)).catch() 
                        })
                    )
                    vendor.findOne({Email : vendorContact[i]}).then(vendor =>{
                        const vend = vendor;
                        var vendorName = vend.VendorName;
                        //  console.log(vend.VendorName);
                        var shipCompName = vend.shipCompName;
                        //  console.log(shipCompName);
                        var shipAddress1 = vend.shipAddress1;
                        const shipAddress2= vend.ShipAdress2;
                        const shipCity = vend.shipCity;
                        const shipState = vend.shipState;
                        const shipZip = vend.shipZip;
                        const shipCountry = vend.shipCountry;
                        const matNew = newMaterial;
                        
                        var orderType = rushOrder;
                        if(orderType = 'on'){
                            orderType = 'Rush Order';
                        }
                        else{
                            orderType = 'Order'
                        }

                        var targetPrice = price;
                        if(targetPrice != ''){
                            targetPrice = `Our target price would preferably be ${price} $(USD)`;
                        }
                    
                    
                        const mailOptionsReq = {
                            from: 'ABH-Pharma <purchase@abhpharma.com>', // sender address
                            to: vendorContact[i], // list of receivers
                            subject: `ABH-Pharma Quote Request for ${material} `, // Subject line
                            html: 
                            `
                        
                            Hello ${vendorName}, <br>
                            <br><br>

                            We at ABH Pharma have requested a quote for the following material: ${material}
                            <br><br>

                            ${targetPrice}<br>
                            Notes: ${notes}<br><br>
                            

                            Attached to this email is a link that will allow you to send us your quote. This link will expire in 2 Days or once you submit the form.


                            <br><br><br><br><br><br>

                            We at ABH-Pharma Appreciate your business with us and hope to hear from you soon.

                            <br><br>
                            The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
                            Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729
                            

                            <br><br>
                            <a href = "http://app.abhpharma.com/ABH_Invoice_Form/?material=${material}&abhRequest=${orderType}+Of+${ammount}+${units}:+${reqType}&shipCompName=${shipCompName}&shipAddress1=${shipAddress1}&shipAddress2${shipAddress2}&shipCity=${shipCity}&shipState=${shipState}&shipZip=${shipZip}&shipCountry=${shipCountry}&vendorName=${vendorName}&key=${tempKey}&newMaterial=${newMat}">ABH Invoice Form<a>


                            <br><br> 

                            If you do not supply this material and want to be removed from the email chain please click the following link <br>
                            <a href = "http://app.abhpharma.com/Do_Not_Supply/?material=${material}&vendorName=${vendorName}&key=${tempKey}&newMaterial=${newMat}">Unsubscribe<a>
                            `
                        };
                        //localHost:5000
                        //app.abhpharma.com
                        transporter.send(mailOptionsReq, function (err, info) {
                            if(err)
                            console.log('Couldnt send email' +err)
                            else
                                console.log('starting info ' +info); 
                                if(newMaterial){
                                    req.flash('success_msg',`Request Has Been Sent TO ALL VENDORS`);
                                    res.redirect('/ABH_Purchase/Dashboard');
                                } 
                                else{
                                req.flash('success_msg',`Request Has Been Sent To ${vendorName}`);
                                res.redirect('/ABH_Purchase/Dashboard');
                                }
                        });
                }).catch();
            }
            })
        });

        app.get('/ABH_Purchase/Modify_Vendor', urlencodedParser,purchEnsureAuthenticated, (req,res) =>{
            vendor.find({}).then(vendor =>{
                // console.log(material[1].MaterialName);
                var vendorName = [];
                for (let i = 0; i < vendor.length; i++) {
                     vendorName.push(vendor[i].VendorName);
                }
           
           
            purchase = 'modVend';
            res.render('purchDashboard',{purchase,vendorName});
            }).catch();
        });

        app.post('/Modify_Vendor', urlencodedParser, purchEnsureAuthenticated,(req,res,next) =>{

            const vendSearch = req.body.vendSearch;
            purchase = 'vendInfoPull';
            vendor.findOne({VendorName: vendSearch}).then(vendor =>{
                if(vendor === null){
                    req.flash('error_msg', 'It seems like you picked a vendor that isnt in the system please use the list of vendors in the search box');
                    res.redirect('/ABH_Purchase/Modify_Vendor');
                }
                else{

  
              
              
                
                const vendNam = vendor.VendorName;
                const repNam = vendor.RepName;
                const website = vendor.Website;
                const matSup = vendor.Material;
                const vendEmail = vendor.Email;
                const vendNum = vendor.Number;
                const shipCompNam = vendor.shipCompNam;
                const shipAddress1 = vendor.shipAddress1;
                const shipAddress2 = vendor.shipAddress2;
                const shipCity = vendor.shipCity;
                const shipState = vendor.shipState;
                const shipZip = vendor.shipZip;
                const shipCountry = vendor.shipCountry; 
                //    console.log(matSup);

                    var tempMaterials = [];
                    for(let i =0; i < matSup.length; i++){
                        
                        tempMaterials.push(vendor.Material[i]);
                    }

                res.render('purchDashboard', {purchase, vendNam,repNam,website,tempMaterials ,matSup,vendEmail,vendNum,shipCompNam,shipAddress1,shipAddress2,shipCity,shipState,shipZip,shipCountry});
                }
            })
            

        });

    

        app.post('/vendInfoModify', urlencodedParser, purchEnsureAuthenticated, (req,res,next)=>{
            const {vendNam,repNam,website,tempMaterials,matSup,vendEmail,vendNum,shipCompNam,shipAddress1,shipAddress2,shipCity,shipState,shipZip,shipCountry} = req.body;
            // console.log(req.body);
            // console.log(matSup);
            // console.log(vendNam);
            var matArray = new Array();
            matArray = matSup.split(',');
            // console.log(matArray);
            var query = {VendorName: vendNam};  // takes the readOnly value of vendNam from purchasePartial and then applies it the query 
            
            var update = {VendorName : vendNam, RepNam : repNam, Website : website, Material: matArray, Email: vendEmail, Number:vendNum, shipCompNam: shipCompNam, shipAddress1 : shipAddress1, shipAddress2: shipAddress2, shipCity: shipCity, shipState: shipState, shipZip: shipZip,shipCountry: shipCountry};

            //this is to update the vendor doc  
            vendor.findOneAndUpdate(query,update).then(vendor =>{ // this just updates the document of the vendor wheather it has or doesnt have the material in the list that is found not the material

            req.flash('success_msg',`You succesfully updated Vendor: ${vendNam}'s Info`);
            res.redirect('/ABH_Purchase/Modify_Vendor');

        
    
             }).catch();
        
            let emptyArr = [];
            let tMat = new Array()
            tMat = tempMaterials.split(',');
            // console.log('starting tMat  ' + tMat )

            // console.log(tMat.length)
            let materialPop = new Array;
            for(let i =0; i< tMat.length; i++){ // compares the document from its origional state to the new modified state to see which materials were removed and stores in materialPop
                        // console.log(`does matArray include ${tMat[i]} : ${matArray.includes(tMat[i])}`);                    
                    if(matArray.includes(tMat[i]) === false){
                        materialPop.push(tMat[i]);

                    }
                }
            // console.log(materialPop[0] == null);
           
                for(let i =0; i < matArray.length; i++){  // this is for removal of vendor name from material doc or adds the vendor name to the material doc 
                    // console.log(materialPop);
                    // console.log(materialPop.length -1);
                    if(materialPop[0] !== null){
                        for(let i =0; i<materialPop.length; i++){ // looping through materialPop
                            // console.log('for loop 1 itteration '+ i)
                            var matQuery = {MaterialName : materialPop[i]}; //sets query for current material from materialPop in db 
                            mat.findOne(matQuery).then(material =>{ //searches for the material in the db to pull doc back as 'material variable'
                                // console.log('found query '+ i)
                                var vendors = material.Vendors; 
                                // console.log(vendors);
                                // console.log(vendNam);
                                var index =vendors.indexOf(vendNam) 
                                // console.log(index)              //searches throgh vendor name array from db and searches for a index that has the vendor name 
                                if(index != -1){ //if it doesnt return -1 aka not found then ....
                                    // console.log('found vendor'+ i)
                                    // console.log(vendors[index]);
                                    let newVendors =vendors.splice(index); // takes the array of vendors and removes the value at the index aka the vendor name we want removed
                                    // console.log(vendors);
                                    mat.findOneAndUpdate(matQuery,{Vendors:newVendors}).then(material =>{ // updates the current material db with the vendor list without the vendors name 
                                        // console.log(material.Vendors);
                                    })
                                    .catch();
                                }
                        
                            })
                        }
                    }
                

                    mat.findOne({MaterialName : matArray[i]}).then(material =>{ //search the material db for the current material in search 
                        // console.log(material === null); //see if material shows up or not DEBUGGING 
                            // console.log (`matArray${i} was found?: ${material !== null}`);
                        if(material === null){ // if material doesnt exist
                            // console.log(vendNam)
                            var createMaterial = mat({ //create the material and add vendors name into the list of vendors
                                MaterialName: matArray[i],
                                Vendors: [vendNam]
                            });
                            createMaterial.save((err) =>{ //save the document for future use 
                                if(err){console.log(err)}
                                else{
                                console.log('Material Added to Database');
                                }
                            });     
                        }
                        else{ // if the material is found 
                            let vendExist = false; // create a variable to see if the vendor does or doesnt already exist within the material db  assuming that vendor doesnt exist and will only change if found
                            for(let i =0; i<material.Vendors.length; i++){ // search for each vendor within the material doc 
                                if(material.Vendors[i] === vendNam){ // if the vendor in the i index of the db vendors array is equal to the vendor we are searching for 
                                    vendExist = true;     // change the value of vendor exists to true and break out of the loop so that the value doesnt change again
                                    break;
                                }
                                
                            }
                            if(!vendExist){ // if the vendor is not found then....
                                mat.findOne({MaterialName : matArray[i]}).then(material =>{
                                    // console.log('vendor wasnt found so now we are adding');
                                    let vendors = new Array();
                                    vendors = material.Vendors;
                                    vendors.push(vendNam);
                                    // console.log(vendors);
                                    mat.findOneAndUpdate({MaterialName: matArray[i]},{Vendors: vendors}).then( console.log(`updataed ${matArray[i]} by setting vendors to be ${vendors}`))
                                    .catch();    
                                
                                })
                            
                            }
                        }
                    }).catch();
                
                }
                
       
              
                    req.flash('success_msg',`${vendNam}'s Info was updated`);
                        res.redirect('/ABH_Purchase/Modify_Vendor');
            
                
            
            
    });

        app.get('/ABH_Purchase/Add_Vendor', urlencodedParser,purchEnsureAuthenticated, (req,res) =>{
            mat.find({}).then(material =>{
            
                var materials = [];
                // console.log(material.length);
                for (let i = 0; i < material.length; i++) {
                     materials.push(material[i].MaterialName);
                }
                
                purchase = 'addVend';
                // console.log(materials);
                res.render('purchDashboard',{purchase,materials});
            })
        });

        app.post('/Add_Vendor', urlencodedParser,purchEnsureAuthenticated, (req,res,next) =>{
            const {vendNam, repName,website,matSup,vendEmail, vendNum,shipCompNam, shipAddress1, shipAddress2,shipCity,shipState,shipZip,shipCountry,notes} = req.body;
      
            var matArray = new Array();
            let matArr = matSup.trim();
            // console.log(matArr);
            matArray = matArr.split(',');
            // console.log(matArray);
            if(matArray[0] !== undefined){
                for(let i =0; i < matArray.length; i++){//This is material update when created
                    mat.findOne({MaterialName : matArray[i]}).then(material =>{
                        // console.log(material === null);
                        // console.log(matArray[i]);
                        if(material === null){
                            // console.log(vendNam)
                            var createMaterial = mat({
                                MaterialName: matArray[i],
                                Vendors: [vendNam]
                            });
                            createMaterial.save((err) =>{
                                if(err){console.log(err)}
                                else{
                                console.log('Material Added to Database');
                                }
                            });     
                        }
                        else{
                            let vendExist = false; // create a variable to see if the vendor does or doesnt already exist within the material db  assuming that vendor doesnt exist and will only change if found
                            for(let i =0; i<material.Vendors.length; i++){ // search for each vendor within the material doc 
                                if(material.Vendors[i] === vendNam){ // if the vendor in the i index of the db vendors array is equal to the vendor we are searching for 
                                    vendExist = true;     // change the value of vendor exists to true and break out of the loop so that the value doesnt change again
                                    break;
                                }
                                
                            }
                            if(!vendExist){ // if the vendor is not found then....
                                mat.findOne({MaterialName : matArray[i]}).then(material =>{
                                    console.log('vendor wasnt found so now we are adding');
                                    let vendors = new Array();
                                    vendors = material.Vendors;
                                    vendors.push(vendNam);
                                    // console.log(vendors);
                                    mat.findOneAndUpdate({MaterialName: matArray[i]},{Vendors: vendors}).then( console.log(`updataed ${matArray[i]} by setting vendors to be ${vendors}`))
                                    .catch();    
                                
                                })
                            
                            }
                        }
                    })
                }
            }

            vendor.findOne({VendorName : vendNam},function(err,data){
                if(data === null){
                        console.log('begining addition to Vendor Collection');
                   
                    bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash('PharmaDebug)!54', salt, (err,hash) =>{
                        if(err) throw err;
                        let hashKey = hash;
                        
                        var createVendor = vendor({
                            VendorName : vendNam,
                            RepName : repName,
                            Email: vendEmail,
                            Number : vendNum,
                            Website : website,
                            Admin : false,
                            Material : matArray,
                            shipCompName : shipCompNam,
                            shipAddress1 : shipAddress1,
                            shipAddress2 : shipAddress2,
                            shipCity : shipCity,
                            shipState: shipState,
                            shipZip : shipZip,
                            shipCountry : shipCountry,
                            Notes : notes,
                            key : hashKey,
                            })
                    
        
                        createVendor.save((err) =>{
                                if(err){console.log(err)}
                                else{
                                console.log('Vendor Profile Saved');
                                
                                req.flash('success_msg', 'Vendor Profile Has Been Saved');
                                res.redirect('/ABH_Purchase/Add_Vendor');
                            
                                }
                            });     
                       
                        })
                    );
                }
                else{
                   purchase = 'addVend'
                    req.flash('error_msg','Vendor is already in the Database if you want to modify vendor go to Modify Vendor Info Page');
                    res.redirect('/ABH_Purchase/Add_Vendor');
               
                    // console.log(data);
                    
                }
            });



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
            res.render('adminLogin');
        });

                                        //login post
        app.post('/ADMIN_login', urlencodedParser, async (req,res,next) =>{ 
        
            // console.log('recieved post req');
            connectABHPharmaDB();    
            passport.authenticate('adminPass', {
                successRedirect : '/ABH_ADMIN/Dashboard',
                failureRedirect: '/ABH_Admin/Login',
                failureFlash : true
            } )(req, res, next);
        });

                                        // Dashboard
        app.get('/ABH_ADMIN/Dashboard',adminEnsureAuthenticated,(req,res) =>{
            admin = 'dashboard';
            res.render('adminDashboard', {admin});
        });

        
                                        //Add user profile
        app.get('/ABH_ADMIN/Dashboard/addUser', adminEnsureAuthenticated,(req,res) =>{
            
            
            firstName = '',
            lastName = '',
            user_name = '',
            Email = '',
            department = '',
            cell = '',

            admin = 'addUser';

            res.render('adminDashboard',{errors,admin,firstName : firstName, lastName : lastName, user_name : user_name, Email: Email, department: department, cell : cell});
            // console.log(firstName, lastName,user_name, Email, department, cell);
        });

                                         // add user post
        app.post('/ABH_ADMIN/Dashboard/addUser', urlencodedParser,adminEnsureAuthenticated, (req,res) =>{
            

            const { firstName, lastName,user_name, Email, department, cell } = req.body;
            var scheduel = ['9 to 5','9 to 5','9 to 5','9 to 5','9 to 5',]
            // console.log(req.body );

            
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
                            
                             admin = 'userPassword';
                             res.render('adminDashboard',{admin,user_name : user_name});
                        
                            }
                        });     
                       
                    
                }
                else{
                    admin = 'addUser';
                    errors.push({msg :'Username is already taken please pick another'});
                    res.render('adminDashboard',{errors,admin,firstName : firstName, lastName : lastName,user_name : user_name,Email: Email, department: department, cell : cell})
                    errors.pop();
                    // console.log(data);
                    
                }
            });
        });

                                         //add password post
        app.post('/ABH_ADMIN/PassAdded', urlencodedParser,adminEnsureAuthenticated, (req,res) =>{
            const {password1, user_name} = req.body;
            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(password1, salt, (err,hash) =>{
                    if(err) throw err;

                    //set password to hash
                    
                    var query = {Username: user_name };
                    var update = {Password : hash ,PlainPassword : password1};


                    employee.findOneAndUpdate(query,update, (err, doc)=>{
                    if(err) { 
                        console.log('err');
                        
                        throw err;
                    }
                    else{
                        // console.log(doc.Password);
                        
                        
                        req.flash('success_msg',`You succesfully added your password to ${doc.FirstName} ${doc.LastName}'s profile`);
                        res.redirect('/ABH_ADMIN/Dashboard/')

                        // console.log(req.body);
                    }
                });
            }));
        
        });

                                        //remove user get
        app.get('/ABH_ADMIN/Dashboard/removeUser',adminEnsureAuthenticated, (req,res) =>{
            admin = 'removeUser';
            res.render('adminDashboard',{admin});
        });

                                        //remove user post
        app.post('/ABH_ADMIN/Dashboard/removeUser',urlencodedParser ,adminEnsureAuthenticated, (req,res) =>{
            // console.log(req.body);
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
                        if(err) console.log(err);

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




        
        app.get('/ABH_ADMIN/Dashboard/removeVendor', adminEnsureAuthenticated,(req,res) =>{
            
            vendor.find({}).then(vendor =>{
                // console.log(material[1].MaterialName);
                  let vendors = new Array(); 
                for (let i = 0; i < vendor.length; i++) {
                    vendors.push(vendor[i].VendorName);
                }
               
                admin = 'removeVendor';
                res.render('adminDashboard',{admin,vendors})
            });

        });
        app.post('/ABH_ADMIN/Dashboard/removeVendor',urlencodedParser,(req,res) =>{
            const {vendorName} = req.body;

            vendor.findOne({VendorName : vendorName}).then(vend =>{
                    let vendMaterial = vend.Material;
                    // console.log(vendMaterial[0]);
                    for(let i =0; i < vendMaterial.length; i++){
                        mat.findOne({MaterialName : vendMaterial[i]}).then(material =>{
                            // console.log('this is mat'+material);
                            let tempVendArr = material.Vendors;
                            // console.log(tempVendArr[0])
                            let index = tempVendArr.indexOf(vendorName);
                            // console.log(index)
                            if(index !== -1){
                                let newVendArr = tempVendArr.splice(index,1)
                                // console.log(newVendArr);
                                // console.log(tempVendArr); // we use this because when splicing it takes the value and returns it but the origional array has it removed
                                mat.findOneAndUpdate({MaterialName : vendMaterial[i]},{Vendors:tempVendArr}).then(material =>{
                                console.log('material updated');
                                    mat.findOne({MaterialName : vendMaterial[i]}).then( material =>{
                                        // console.log(material.Vendors);
                                        if(material.Vendors[0] === undefined){            
                                                mat.findOneAndDelete({MaterialName:vendMaterial[i]}).then(console.log(vendMaterial[i]+ "didnt have anymore vendors so it had been deleted"));
                                        }
                                    })
                            }).catch();
                            console.log('removed vendor from material');                            
                        }
                        })
                    }
                    vendor.findOneAndDelete({VendorName : vendorName}).then(()=>{
                        console.log('Vendor has been deleted');
                        req.flash('success_msg','Vendor Has been removed from Data Base');
                        res.redirect('/ABH_ADMIN/Dashboard/removeVendor');
                    }).catch();

            })



        });






                                        //admin Logout
        app.get('/ABH_ADMIN/logout',(req,res) =>{
                req.logout();
                req.flash('success_msg',`You have logged out`);
                admin = 'dashboard';
                res.redirect('/ABH_Admin/Login');  
                disconnectABHPharmaDB();  
        });

};

