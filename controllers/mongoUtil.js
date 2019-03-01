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

//connect to db

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



//Add to DataBase

function dbAddToEmployee(firstname, lastname, email, cell, department, admin, scheduel,username, password){
    connectABHPharmaDB();
console.log('begining addition');
        var employee = new Employee.Employee(
                {FirstName : firstname},
                {LastName : lastname},
                {Email: email},
                {Cell : cell},
                {Department : department},
                {Admin : admin},
                {Scheduel : {
                    Monday : scheduel[0],
                    Monday : scheduel[1],
                    Monday : scheduel[2],
                    Monday : scheduel[3],
                    Monday : scheduel[4],
                }},
                {Username : username},
                {Password : password}
        );
        employee.save((err) =>{
            if(err){console.log(err)}
            else{
                console.log('Item Saved');
               
            }
        });      
      disconnectABHPharmaDB();

}





//Search  and get Username and password































//Application of functions






var firstname = "test";
var lastname = "test";
var email = 'test@test.com';
var cell = 1231231232;
var department = 'test';
var admin = false;
var scheduel = ['9 to 5','9 to 5','9 to 5','9 to 5','9 to 5',]
var username = 'test';
var password = 'test123';



dbAddToEmployee(firstname,lastname,email,cell,department,admin,scheduel,username,password);





