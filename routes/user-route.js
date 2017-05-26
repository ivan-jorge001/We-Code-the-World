const express = require('express');
const router = express.Router();
const ensure = require('connect-ensure-login');


router.get("/profile",ensure.ensureLoggedIn('/'),(req,res,next)=>{
  res.render('user/profile-view.ejs');
});

module.exports =router;
