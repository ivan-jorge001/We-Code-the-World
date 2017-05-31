const express = require('express');
const router  = express.Router();
const Post = require('../models/post-model.js');
const User = require('../models/user-model.js');
var array = [];


/* GET home page. */
router.get('/', (req, res, next) => {
  Post.find({whocanseeit:'Everyone'},(err,thePost)=>{

if (err) {
  next(err);
  return;
}
if (thePost) {

  thePost.forEach((file)=>{

    User.find({_id:file.userwhocreateit},(err,theUser1)=>{
  console.log(`================${theUser1}==================`);
      if (err) {
        next(err);
        return;
      }
      if (theUser1) {
        next(theUser1);
      array.push(theUser1);
      console.log(`################${array}################`);

return ;
      }
    });
    console.log(`&&&&&&&&&&&&&&&&&&&${array}&&&&&&&&&&&&&&&&&&&`);

  });
  console.log(`$$$$$$$$$$$$$$$$$$${array}$$$$$$$$$$$$$$$$$$`);
  res.render('index', { successMessage:req.flash('success'), failMessage:req.flash('error'),post:thePost ,theUser:array  });
array=[];
  return;
}
res.render('index', { successMessage:req.flash('success'), failMessage:req.flash('error') });

  });
});

module.exports = router;
