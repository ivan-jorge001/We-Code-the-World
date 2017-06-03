const express = require('express');
const router = express.Router();
const Post = require('../models/post-model.js');
const User = require('../models/user-model.js');
const lang = require('../models/lang-model.js');

const Com = require('../models/comment-model.js');
const multer = require('multer');
const path = require('path');
const ensure = require('connect-ensure-login');




router.get('/language/:name/:id/main',(req,res,next)=>{

lang.findById(req.params.id,(err,theLang)=>{
if (err) {
  next(err);
  return;
}
if (theLang) {

  res.render('lang/createLan-view',{
    successMessage:req.flash('success'),
    failMessage:  req.flash('error'),
    lang:theLang
  });
}
});



});


router.post('/create/lang',ensure.ensureLoggedIn('/'),(req,res,next)=>{

const language = new lang({
  name:req.body.nameInput,
  profilepic:req.body.urlInput,
  colorRep:req.body.colorInput,
  addedByWho:req.user._id
});
language.save((err)=>{
  if (err) {
    next(err);
    return;
  }

});
res.redirect(`/language/${language.name}/${language._id}/main`);

});




module.exports = router;
