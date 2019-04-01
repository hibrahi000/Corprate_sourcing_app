var mongoose = require('mongoose');

var Employee = require('./models/Employee');
var Vendor = require('./models/Vendor');
var Material = require('./models/Material');
const bcrypt = require('bcryptjs');
const key =require('./config/keys');
var employee = Employee.Employee;
var mat = Material.Material;
var vendor = Vendor.Vendor;


var xlstojson = require('xls-to-json');
var xlsxtojson = require('xlsx-to-json');
var report = require('./spreadsheetInJson/report').text;

function connectABHPharmaDB(theFunction){
    mongoose.connect(key.ABHPHARMA_DB_CONNECT_URI, {useNewUrlParser: true})
        .then(() => 
        theFunction,
        console.log('Connected to ABH Pharma DB.....'))
        .catch(err => console.log(err));    
}
function disconnectABHPharmaDB(){
    mongoose.disconnect(key.ABHPHARMA_DB_CONNECT_URI)
        .then(() => console.log('Disconnected From ABH Pharma DB.....'))
        .catch(err => console.log(err));
}


function xlstojson(){    
    xlsxtojson({
    input: "./spreadSheets/Vendor Sourcing Info.xlsx",  // input xls 
    output: " revision.json", // output json 
	lowerCaseHeaders:true
            }, function(err, result) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
                });
    }


var counter =0;

let abhcontact = new Array;
for(let i=0; i< report.length; i++){
    // console.log(report[i].Email);
   
    if(report[i].Email == ''){
        // console.log('no email');
        // counter++
        // console.log(counter);
    }

    else{
        report[i]['Material'] = report[i]['Material'].replace(/\s*,\s*/g, ",");
        report[i]["Material"] =report[i]["Material"].replace(/\s+/g, '-');
        report[i]['Company Name']= report[i]['Company Name'].toUpperCase();
        report[i]['Material']=report[i]['Material'].toUpperCase();
        if(report[i]['Rep Name'] !== undefined){
            report[i]['Rep Name']=report[i]['Rep Name'].toUpperCase();
        }
        report[i]['Email']=report[i]['Email'].toUpperCase();
        report[i]['Website']=report[i]['Website'].toUpperCase();
        
        abhcontact.push(report[i])
    }

}

// for(let i = 0; i< abhcontact.length; i++){
//     console.log('Company Name is ** ' + abhcontact[i]['Company Name']);
//         console.log('Material is ** ' + abhcontact[i]['Material']);
//         console.log('Rep Name is ** ' + abhcontact[i]['Rep']);
//         console.log('Email is ** ' + abhcontact[i]['Email']);
//         console.log('Number is ** ' + abhcontact[i]['Number']);
//         console.log('Website is ** ' + abhcontact[i]['Website']);
//         console.log(' <br><br>')
 
 
 
 
// }
// let k =0;
// let companyName = abhcontact[k]['Company Name'];
// // let mat = abhcontact[k]['Material'];
// let rep =abhcontact[k]['Rep'];

// let email = abhcontact[k]['Email'];
// let number =abhcontact[k]['Number'];
// let website =abhcontact[k]['Website']





// console.log('Company Name is ** ' + companyName);
// console.log('Material is ** ' +  mat);
// console.log('Rep Name is ** ' + rep);
// console.log('Email is ** ' + email);
// console.log('Number is ** ' + number);
// console.log('Website is ** ' + website);
// console.log(' <br><br>')

// console.log(abhcontact);


// let contactWithNoEmail = new Array;


let c =0;
let g =0;
for(let i = 0; i< abhcontact.length; i++){ // check if emails in file has a @ sign for review
    if(abhcontact[i]['Email'].indexOf('@') !== -1){
        c++;
        // console.log('@ found '+ c)
    }
    else{
        contactWithNoEmail.push(abhcontact[k]['Email']);
        g++;
        // console.log('@ not found ' + g)
    }
}





//this is for adding a vendor
// for(let i = 0; i< abhcontact.length; i++){

//     let vendNam = abhcontact[i]['Company Name'];
//     let matArray =abhcontact[i]['Material'].split(',');;
//     let repName =abhcontact[i]['Rep'];
    
//     let vendEmail = abhcontact[i]['Email'];
//     let vendNum =abhcontact[i]['Number'];
//     let website =abhcontact[i]['Website']
    
//     console.log(matArray[0] !== '');


//     vendor.findOne({VendorName : vendNam},function(err,data){
//         if(data === null){
//                 console.log('begining addition to Vendor Collection');
        
//             bcrypt.genSalt(10, (err, salt) => 
//             bcrypt.hash('PharmaDebug)!54', salt, (err,hash) =>{
//                 if(err) throw err;
//                 let hashKey = hash;
                
//                 var createVendor = vendor({
//                     VendorName : vendNam,
//                     RepName : repName,
//                     Email: vendEmail,
//                     Number : vendNum,
//                     Website : website,
//                     Admin : false,
//                     Material : matArray,
//                     Notes : 'was added with function',
//                     key : hashKey,
//                     })
            

//                 createVendor.save((err) =>{
//                         if(err){console.log(err)}
//                         else{
                        
//                         console.log(vendNam);
//                         console.log('success_msg', 'Vendor Profile Has Been Saved');
                        
                    
//                         }
//                     });     
            
//                 })
//             );
//         }
//         else{
        
//             console.log('error_msg','Vendor is already in the Database if you want to modify vendor go to Modify Vendor Info Page');
            
    
//             // console.log(data);
            
//         }
//     });
// }

// connectABHPharmaDB();
// for(let i = 0; i< abhcontact.length; i++){

//     let vendNam = abhcontact[i]['Company Name'];
//     let matArray =abhcontact[i]['Material'].split(',');;
    

//     if(matArray[0] !== ''){
//         // console.log('');
//         // console.log(vendNam);
//         // console.log(matArray);
//         for(let j =0; j<matArray.length; j++){
//         // console.log(matArray[j]);
        
//         mat.findOne({MaterialName : matArray[j]}).then(material =>{
//             console.log('the material exists: ' + (material !== null));
//             if(materialAdded.includes(matArray[j])){
//                 console.log('entered material exists')
//                 let vendExist = false; // create a variable to see if the vendor does or doesnt already exist within the material db  assuming that vendor doesnt exist and will only change if found
//                 for(let k =0; i<material.Vendors.length; i++){ // search for each vendor within the material doc 
//                     if(material.Vendors[k] === vendNam){ // if the vendor in the i index of the db vendors array is equal to the vendor we are searching for 
//                         vendExist = true;     // change the value of vendor exists to true and break out of the loop so that the value doesnt change again
//                         break;
//                     }
                    
//                 }
//                 console.log('vendor exists : ' + vendExist);
//                 if(vendExist === false){ // if the vendor is not found then....
//                     mat.findOne({MaterialName : matArray[j]}).then(material =>{
//                         console.log('vendor wasnt found so now we are adding it to ' + matArray[j] + ' document');
//                         let vendors = new Array();
//                         vendors = material.Vendors;
//                         vendors.push(vendNam);
//                         console.log('These are the vendors : ' +vendors);
                        
//                         mat.findOneAndUpdate({MaterialName: matArray[j]},{Vendors: vendors}).then( console.log(`updataed ${matArray[j]} by setting vendors to be ${vendors}`))
//                         .catch(()=> console.log('cant update material'));  
                        
//                         // if(material.Vendors[0] === undefined){
//                         //     mat.findOneAndDelete({MaterialName : matArray[i]}).then('removal of material from vendor profile emptied the materil so now its gone').catch();

//                         // }
//                     }).catch(()=> console.log('Cant find material'))
                
//                 }
//             }
//             else{    
//             console.log('the material exists ROUND 2: ' + (materialAdded.includes(matArray[j])))
//                 if(!materialAdded.includes(matArray[j])){
//                      var createMaterial = mat({
//                     MaterialName: matArray[j],
//                     Vendors: [vendNam]
//                 });
//                 createMaterial.save((err) =>{
//                     if(err){console.log(err)}
//                     else{
//                     materialAdded.push(matArray[j])
//                     console.log( matArray[j] + '   Material Added to Database');
//                     // console.log(materialAdded);
//                     }
//                 }); 
            
//                 }
//             }
//         }).catch(err => {
//          console.log('Material wasnt found')
//         });

//         }
//     }
// }
let matUP = new Array;
let vendorLi = new Array;
let materialAdd = new Array;
for(i =0; i < abhcontact.length; i++){
    // console.log(0)
    if(abhcontact[i]['Material'] !== ''){
        // console.log(1)
        let currMat = abhcontact[i]['Material'].split(',');
        let vendor = abhcontact[i]['Company Name'];
        console.log(currMat);
        console.log(currMat.length);

        for(let o =0; o< currMat.length; o++){
            // console.log(2)
            let matIndex = materialAdd.indexOf(currMat[o]);
            if(matIndex === -1){
                console.log(3)
                matUP.push(currMat[o]);
                let vendorArr = new Array;
                vendorArr.push(vendor);
                vendorLi.push(vendorArr);
                materialAdd.push(currMat[o]);
            }
            else{
                console.log(4)
                vendorLi[matIndex].push(vendor);
            }
        }
    }
}


console.log(matUP[5])
console.log(vendorLi[5])
console.log('the length of matup is ' + matUP.length);
console.log('the length of vendor li is ' + vendorLi.length);






connectABHPharmaDB()

for(let tem = 0; tem< matUP.length; tem++){



var createMaterial = mat({
        MaterialName: matUP[tem],
        Vendors: vendorLi[tem]
    });
    createMaterial.save((err) =>{
        if(err){console.log(err)}
        else{
        console.log( matUP[tem] + '   Material Added to Database');
        // console.log(materialAdded);
        }
    }); 

}