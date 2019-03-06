

  function ensureAuthenticated (req,res,next){
    console.log('i started');
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'Please log in to use your Admin Account');
    res.redirect('/ABH_Admin/Login');
}


module.exports = {
   ensureAuthenticated : ensureAuthenticated
}