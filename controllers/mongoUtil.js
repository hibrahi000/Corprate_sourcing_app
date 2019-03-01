//This is a file designed to supply utility functions to mongo db Manipulation





//Function that searches for a text



//function that returns a list of info



//function that adds stuff to the database 


//get collection


//add to collection



//add to document in collection



//add document to colection



//deleate document


//deleate collection



module.exports = () =>{
    
}






var key = require('../controllers/config/keys');
var Employee = require('./models/Employee');
var Vendor = require('./models/Vendor');
var Material = require('./models/Material');
var mongoose = require('mongoose');

var employee = Employee.Employee;
var material = Material.Material;
var vendor = Vendor.Vendor;

//Connect To DB

function connectABHPharmaDB(theFunction){
    mongoose.connect(key.ABHPHARMA_DB_CONNECT_URI, {useNewUrlParser: true})
        .then(() => 
        theFunction,
        console.log('Connected to ABH Pharma DB.....'))
        .catch(err => console.log(err));    
}


//Disconnect to DB
function disconnectABHPharmaDB(){
    mongoose.disconnect(key.ABHPHARMA_DB_CONNECT_URI)
        .then(() => console.log('Disconnected From ABH Pharma DB.....'))
        .catch(err => console.log(err));
}


//Search and return collection


//searches for EMPLOYEE collection by passing the key value u want then sends it back as a json object that you can search throught using the object.<key value>
function searchEmployeeBy_FirstName(collection, keyValue){
    return collection.find({FirstName : keyValue},function(err,data){
        if(err) throw err;
        var dat1 = {data};
        return docManipEnable(dat1);
    })
}
function searchEmployeeBy_FirstName(firstName){
    return employee.find({FirstName : firstName},function(err,data){
        if(err) throw err;
        var dat1 = {data};
        return docManipEnable(dat1);
    })
}
function searchEmployeeBy_LastName(lastName){
    return employee.find({LastName: lastName},function(err,data){
        if(err) throw err;
        var dat1 = {data};
        return docManipEnable(dat1);
    })
}
function searchEmployeeBy_UserName(userName){
     employee.find({Username : userName},function(err,data){
        if(err) throw err;
       var info = (docManipEnable({data}));
        console.log(info.Email)
        console.log('hello world');
    });
    
}
function searchEmployeeBy_Email(email){
    return employee.find({Email : email},function(err,data){
        if(err) throw err;
        var dat1 = {data};
        return docManipEnable(dat1);
    })
}
function searchEmployeeBy_Cell(cellphone){
    return employee.find({FirstName : cellphone},function(err,data){
        if(err) throw err;
        var dat1 = {data};
        return docManipEnable(dat1);
    })
}


//searches for MATERIAL collection by passing the key value u want then sends it back as a json object that you can search throught using the object.<key value>

function searchMaterialBy_Material(materialName){
    return material.find({MaterialName : materialName},function(err,data){
        if(err) throw err;
        var dat1 = {data};
        return docManipEnable(dat1);
    })
}


//searches for MATERIAL collection by passing the key value u want then sends it back as a json object that you can search throught using the object.<key value>

function searchVendorBy_VendorName(vendorName){
    return vendor.find({VendorName : vendorName},function(err,data){
        if(err) throw err;
        var dat1 = {data};
        return docManipEnable(dat1);
    })
}



//make enable to manipulate
function docManipEnable(data){
        var user = JSON.stringify(data);
        var start = 9;
        var end =  user.length -2;
        var sliceString = user.slice(start,end);
        return JSON.parse(sliceString);
}


//Search and return Document in Collection



//Search for Username in collection then return doc for search ( ie password, email, ....)
function checkUserName (username){
   var usernameValid = searchEmployeeBy_UserName(username);
    console.log(usernameValid);
}

// get a field value 

function getFieldValue(fieldVariable, collection){

}


//Add to Collection

function dbAddToEmployee(firstname, lastname, email, cell, department, admin, scheduel,username, password){
    connectABHPharmaDB();
console.log('begining addition to Employee Collection');
        var createEmployee = Employee.Employee(
                {FirstName : firstname,
                LastName : lastname,
                Email: email,
                Cell : cell,
                Department : department,
                Admin : admin,
                Scheduel : {
                    Monday : scheduel[0],
                    Tuesday : scheduel[1],
                    Wedensday : scheduel[2],
                    Thursday : scheduel[3],
                    Friday : scheduel[4],
                },
                Username : username,
                Password : password,
              
            });
        createEmployee.save((err) =>{
            if(err){console.log(err)}
            else{
                console.log('Material Profile Saved');
                disconnectABHPharmaDB();
               
            }
        });      
    

}
function dbAddToMaterial(materialName, vendor){
    connectABHPharmaDB();
console.log('begining addition to Material collection');
        var createMaterial = Material.Material(
                {
                MaterialName : materialName,
                Vendor : vendor,
                
            });
        createMaterial.save((err) =>{
            if(err){console.log(err)}
            else{
                console.log('Material Profile Saved');
                disconnectABHPharmaDB();
               
            }
        });      
    

}

function dbAddToVendor(vendorName,material,repName,email,number,wareHouseAddress,website,notes){
    connectABHPharmaDB();
console.log('begining addition to Vendor collection');
        var createVendor = Vendor.Vendor(
                {
                VendorName : vendorName,
                Material : material,
                RepName: repName,
                Email : email,
                Number : number,
                WareHouse : wareHouseAddress,
                Website: website,
                Notes : notes,
            });
        createVendor.save((err) =>{
            if(err){console.log(err)}
            else{
                console.log('Vendor Profile Saved');
                disconnectABHPharmaDB();
               
            }
        });      
    

}


//Modify The Doc in Collection




































var firstname = "test";
var lastname = "test";
var email = 'test@test.com';
var cell = 1231231232;
var department = 'test';
var admin = false;
var scheduel = ['9 to 5','9 to 5','9 to 5','9 to 5','9 to 5',]
var username = 'test';
var password = 'test123';



// dbAddToEmployee(firstname,lastname,email,cell,department,admin,scheduel,username,password);



// dbAddToVendor("vendorTest","AlphaGPC",'Martha',"test@test.com",3475766673,"test road, test, test",'www.test.test','this is a test vendor',Date);



// dbAddToMaterial('Alpha GPC','TestVendor');



// var Hashmat = searchForDoc(employee,"FirstName", 'Hashmat');

connectABHPharmaDB();




// employee.find({FirstName : 'Hashmat'},function(err,data){
//     if(err) throw err;
//     var dat1 = {data};
//     var dbDat = accessDBValue(dat1);
//     console.log(dbDat.Email);

// }); 


// function accessDBValue( dbReturn ){
//     var user = JSON.stringify(dbReturn);
//     var start = 9;
//     var end =  user.length -2;
//     var sliceString = user.slice(start,end);
//     return JSON.parse(sliceString);
// };


searchEmployeeBy_UserName('Hibrahi000');
    




///NOTE********* WHEN using the ASYNCRONOUS method employee.find you have to make sure that the function that needs to be done is done within the find method otherwise things will get messy so RECOMENDATION: make functions outside the find method and pull it in since we can use the variabls from the database in there.