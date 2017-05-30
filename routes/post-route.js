const express = require('express');
const router = express.Router();
const Post = require('../models/post-model.js');

router.post('/new/post',(req,res,next)=>{
const newPost = new Post({
   
});

});
module.exports = router;
