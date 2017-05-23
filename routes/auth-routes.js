const express = require('express');
const router  = express.Router();
const User    = require('../models/user-model.js');
const ensure = require('connect-ensure-login');

router.post('/user/signup',ensure.ensureNotLoggedIn('/'),(req,res,next)=>{
  console.log('iget in here==================================================================');
const username         = req.body.username;
const email            = req.body.email;
const password         = req.body.password;
const confirmPassword  = req.body.confirmPassword;
console.log( username,email);
if (username === '' || email === '' || password === '' || confirmPassword === '') {
  console.log('iget in here==================================================================');

res.render('index',{
failMessage:req.flash('error','Please fill in all the fills')
});
}

User.findOne(username,(err,theUser)=>{
  console.log('iget in here==================================================================');

  if (err) {
    next(err);
    return;
  }

  if (theUser) {
    console.log('iget in here==================================================================');

    res.render('index.js',{
      failMessage:req.flash('error','Please Select Another Username Yours is Taken')
    });
  }
  const salt = bcrypt.genSyncSalt(10);
  const hashPass = bcrypt.hashSync(password, salt);

const newUser = new User({
  username:username,
  paswword:hashPass,
  email: email
});

 newUser.save((err)=>{
   if (err) {
     next(err);
     return;
   }
   console.log('iget in redirect==================================================================');

   req.flash('success','You Have Successfuly Sign Up');
   res.redirect('/');
 });
});

});

module.exports = router;
