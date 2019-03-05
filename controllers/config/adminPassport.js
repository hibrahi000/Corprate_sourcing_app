const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const mongoUtil = require('../mongoUtil.js');
const key = require('./keys');

//load emoployee

const employee = require('../models/Employee').Employee;


function adminPass (passport) {
    passport.use( new LocalStrategy(
        {usernameField : 'userName'}, (userName, password, done)=> {
            //match user 
            employee.findOne({Username : userName},function(err,data){
                console.log('employee found');
                if(err){
                    return done(null,false,{message : 'The username and password combination was not found--U'});
                };
                //match the password
                if(data.Admin){
                    bcrypt.compare(password, data.Password, (err,isMatch) => {
                        if(err) throw err;

                        if(isMatch){
                            return done(null, employee);
                        }

                        else {
                            done(null, false, {message : "The username and password combination was not found --P"});
                        }
                    });
            }
            }).catch(err => console.log(err)
            );

            ///
            passport.serializeUser((userName, done) => {
                done(null, userName.id);
              });
              
              passport.deserializeUser((id, done) => {
                User.findById(id, (err, user) => {
                  done(err, user);
                });
              });
        })
    );   
}




module.exports = adminPass;





