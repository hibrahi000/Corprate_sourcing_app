module.exports = {
    ensureAuthenticated : function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Please login to use you Admin Account');
        res.redirect('/ABH_Admin/Login');
    }
}