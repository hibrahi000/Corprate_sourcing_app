

  function adminEnsureAuthenticated (req,res,next){
    console.log('i started');
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'Please log in to use your Admin Account');
    res.redirect('/ABH_Admin/Login');
}

function purchEsureAuthenticated(req,res,next){
  console.log('i started');
  if(req.isAuthenticated()){
      return next();
  }
  req.flash('error_msg', 'Please log into your Account');
  res.redirect('/ABH_Purchase/Login');
}


module.exports = {
  adminEnsureAuthenticated : adminEnsureAuthenticated,
  purchEsureAuthenticated : purchEsureAuthenticated,
}