var express = require('express');
var expressLayouts = require('express-ejs-layouts')
var app = express();
var controller = require('./controllers/controller');
const passport = require('passport');
const flash = require('connect-flash');
const sessions = require('cookie-session');
const keys = require('./controllers/config/keys');
const pass = require('./controllers/config/passport');
const PORT = process.env.PORT || 5000



//passport config
require('./controllers/config/passport')(passport);



// //setup template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');



//Sessions
app.use(sessions({
    maxAge: 1000   *   60   * 60   *  2,
         //miliSec    sec     min    hours     days           
    keys: [keys.session.cookieKey]
}));

//  passport middleware
app.use(passport.initialize('/controllers/config/passport.js')); // this initializes 
app.use(passport.session());


//connect flash
app.use(flash());


//global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})




//static files 
app.use(express.static(__dirname + "/assets"));


//fire controlers
controller(app);




//listen to port /
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


