const express = require('express');
const router = express.Router();
const Post = require('../models/post-model.js');
const multer = require('multer');
const path = require('path');
const ensure = require('connect-ensure-login');
var upload = multer({
    dest: path.join(__dirname, '../public/postpic')
});

var cpUpload = upload.fields([{ name: 'imgpost', maxCount: 6 }]);


router.post('/new/post', ensure.ensureLoggedIn('/'),cpUpload,(req,res,next)=>{


  const share = req.body.sharewith;
const newPost = new Post();
  newPost.content = req.body.postcontent;

if (req.body.numberofpic > 0) {


  req.files.imgpost.forEach((file)=>{
  newPost.photos.push(`/postpic/${file.filename}`);
  });
}
  newPost.whocanseeit = share;
  newPost.userwhocreateit=req.user._id;




newPost.save((err)=>{
  if (err) {
    next(err);
    return;
  }
  
  if (newPost.whocanseeit === 'Friends') {
req.user.post.postForFriend.push(newPost._id);
  }else if (newPost.postForWork === 'Work') {
req.user.post.postForFriend.push(newPost._id);
  }else {
    req.user.post.postForEveryone.push(newPost._id);

  }
  req.user.save((err)=>{
    if (err) {
      next(err);
      return;
    }
  });

    req.flash('success',"Your Post was successful");
    res.redirect('/');
  });


// res.send(req.files);

});
module.exports = router;
