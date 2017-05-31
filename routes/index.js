const express = require('express');
const router  = express.Router();
const Post = require('../models/post-model.js');

/* GET home page. */
router.get('/', (req, res, next) => {
  Post.find({whocanseeit:'Everyone'},(err,thePost)=>{
if (err) {
  next(err);
  return;
}
if (thePost) {
  res.render('index', { successMessage:req.flash('success'), failMessage:req.flash('error'),post:thePost  });
}
res.render('index', { successMessage:req.flash('success'), failMessage:req.flash('error') });

  });
});

module.exports = router;
