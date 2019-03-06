const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const mongoUtil = require('../mongoUtil.js');
const key = require('./keys');

//load emoployee

const employee = require('../models/Employee').Employee;
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

function adminPass (passport) {
    connectABHPharmaDB();
    passport.use(
        new LocalStrategy({ usernameField : 'userName'}, (userName, password, done) =>{
            //match user 
            employee.findOne({Username : userName})
            .then(empl =>{
                if(!empl){
                    return done(null,false,{message : 'Invalid username or password'});
                }

                //match password
                bcrypt.compare(password, empl.Password, (err, isMatch) =>{
                    if(err) throw err;

                    if(isMatch){
                            //check to see if admin
                        employee.findOne({Username : userName})
                            .then(empl =>{
                                if(!empl.Admin){
                                 return done(null,false,{message : 'It seems like you dont have permision to acces this site'});
                             }
                             else{
                                    return done(null, empl);
                                }
                })
                    }
                    else{
                        return done(null,false, {message :'Invalid username or password'});
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );
    passport.serializeUser((employee, done) =>{
        done(null, employee.id);
      });
      
      passport.deserializeUser((id, done) =>{
        employee.findById(id, function(err, user) {
          done(err, user);
        });
      });
}



module.exports = adminPass;





