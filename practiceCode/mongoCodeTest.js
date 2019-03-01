var mongoose = require('mongoose');
var key = require('../controllers/config/keys');
var Schema = mongoose.Schema;
var mongo = require('mongo');

db =   mongo.connect(key.purchaseLoginMongoURI, {useNewUrlParser: true})

mongoose.connect(key.ABHPHARMA_DB_CONNECT_URI, {useNewUrlParser: true})
.then(() => console.log('Connected to Purchase Login DB.....'))
.catch(err => console.log('connection failed')); 



// mongoose.model('ABH_Staff', {user_name : String});
// mongoose.model('ABH_Staff').find(function(err,users){
// console.log(users);
// });

// var userDataSchema = new Schema({
//     user_name :String,
//     password : String,
//     name : String
// },{collection: 'ABH_Staff'});




// var userData = mongoose.model('UserData', userDataSchema);

// userData.find()
// .then(function(doc, user_name){
//     console.log({items: doc});
//     // console.log({items: user_name})
// })
// .catch();

// function getDocByUserName(userName) {userData.findOne({user_name: `${userName}`})
// .then(function(user_name){
//     console.log({ user_name });

// })
// .catch();
// }



// var hashmat = getDocByUserName('Hibrahi000');





// var testSchema = new mongoose.Schema({
//     name : String,
//     user_name : String,
//     password : String
// },{collection: 'ABH_Staff'});


// var Test = mongoose.model('Test', testSchema);

// Test.find({name : 'Hashmat Ibrahimi'},function(err,data){
//     if(err) throw err;
//     var dat1 = {data};
//     var dbDat = accessDBValue(dat1);
//     console.log(dbDat.password);

// }) 
// const userFromDb =  Test.findOne({ name: 'Hashmat Ibrahimi' });

// function accessDBValue( dbReturn ){
//     var user = JSON.stringify(dbReturn);
//     var start = 9;
//     var end =  user.length -2;
//     var sliceString = user.slice(start,end);
//     return JSON.parse(sliceString);
// }






//   var jsonString = "{\"key\":\"value\"}";
//   var jsonObj = JSON.parse(jsonString);
//   console.log(jsonObj.key);



// console.log(Date() + '------------')




