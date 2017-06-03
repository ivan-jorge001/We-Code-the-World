const express = require('express');
const router = express.Router();
const Post = require('../models/post-model.js');
const User = require('../models/user-model.js');

const Com = require('../models/comment-model.js');
const multer = require('multer');
const path = require('path');
const ensure = require('connect-ensure-login');
var array=[];
var upload = multer({
  dest: path.join(__dirname, '../public/postpic')
});

var cpUpload = upload.fields([{
  name: 'imgpost',
  maxCount: 6
}]);


router.post('/new/post', ensure.ensureLoggedIn('/'), cpUpload, (req, res, next) => {


  const share = req.body.sharewith;
  const newPost = new Post();
  newPost.content = req.body.postcontent;

  if (req.body.numberofpic > 0) {


    req.files.imgpost.forEach((file) => {
      newPost.photos.push(`/postpic/${file.filename}`);
    });
  }
  newPost.whocanseeit = share;
  newPost.userwhocreateit = req.user._id;




  newPost.save((err) => {
    if (err) {
      next(err);
      return;
    }

    if (newPost.whocanseeit === 'Friends') {
      req.user.post.postForFriend.push(newPost._id);
    } else if (newPost.postForWork === 'Work') {
      req.user.post.postForFriend.push(newPost._id);
    } else {
      req.user.post.postForEveryone.push(newPost._id);

    }
    req.user.save((err) => {
      if (err) {
        next(err);
        return;
      }
    });

    req.flash('success', "Your Post was successful");
    res.redirect('/');
  });
  // res.send(req.files);
});
router.get('/:id/:category/delete', ensure.ensureLoggedIn('/'), (req, res, next) => {
  const postId = req.params.id;
  const postCa = req.params.category;


  console.log(postId + 'idofpost');
  console.log(postCa + "categor");

  if (postCa == 'Friend') {
    console.log("inside Friend");

    Post.findById({
      _id: postId
    }, (err, deletedpost) => {
      if (err) {
        next(err);
        return;
      }
      console.log('BANANA 1');

      if (deletedpost) {
        console.log('BANANA 2');


        if (req.user._id.equals(deletedpost.userwhocreateit)) {
          console.log('BANANA 3');

          Post.findByIdAndRemove(postId, (err, dele) => {
            if (err) {
              next(err);
              return;
            }
            console.log('BANANA 4');

            if (req.user.post.postForFriend.indexOf(postId) !== -1) {
              console.log('BANANA 5');

              req.user.post.postForFriend.remove(postId);

              res.redirect('/');
            }
          });

        } else {
          req.flash('error', 'You Don`t Have Permission');
          res.redirect('/');
        }
      }
    });

  }
  if (postCa == 'Work') {
    console.log("inside Work");

    Post.findById({
      _id: postId
    }, (err, deletedpost) => {
      if (err) {
        next(err);
        return;
      }
      console.log('BANANA 1');

      if (deletedpost) {
        console.log('BANANA 2');


        if (req.user._id.equals(deletedpost.userwhocreateit)) {
          console.log('BANANA 3');

          Post.findByIdAndRemove(postId, (err, dele) => {
            if (err) {
              next(err);
              return;
            }
            console.log('BANANA 4');

            if (req.user.post.postForWork.indexOf(postId) !== -1) {
              console.log('BANANA 5');

              req.user.post.postForWork.remove(postId);

              res.redirect('/');
            }
          });

        } else {
          req.flash('error', 'You Don`t Have Permission');
          res.redirect('/');
        }
      }
    });

  }
  if (postCa == 'Everyone') {

    Post.findById({
      _id: postId
    }, (err, deletedpost) => {
      if (err) {
        next(err);
        return;
      }
      console.log('BANANA 1');

      if (deletedpost) {
        console.log('BANANA 2');


        if (req.user._id.equals(deletedpost.userwhocreateit)) {
          console.log('BANANA 3');

          Post.findByIdAndRemove(postId, (err, dele) => {
            if (err) {
              next(err);
              return;
            }
            console.log('BANANA 4');

            if (req.user.post.postForEveryone.indexOf(postId) !== -1) {
              console.log('BANANA 5');

              req.user.post.postForEveryone.remove(postId);

              res.redirect('/');
            }
          });

        } else {
          req.flash('error', 'You Don`t Have Permission');
          res.redirect('/');
        }
      }
    });

  }
});

var uploadCom = multer({
  dest: path.join(__dirname, '../public/postpic')
});

var cpUploadCom = upload.fields([{
  name: 'imgcomment',
  maxCount: 6
}]);

router.post('/:idofpost/comment', ensure.ensureLoggedIn('/'), cpUploadCom, (req, res, next) => {
  const postId = req.params.idofpost;

  var comment = {
    content: req.body.content,
    author: req.user._id
  };

  if (req.files !== undefined) {
    req.files.imgcomment.forEach((pic) => {
      comment.photos.push(pic);
    });
  }
  Post.findById(postId, (err, foundPost) => {
    if (err) {
      next(err);
      return;
    }
    if (foundPost) {
      const OneCom = new Com(comment);
      foundPost.comment.push(OneCom);

      foundPost.save((err) => {
        if (err) {
          next(err);
          return;
        }
        req.flash('success', 'Comment was Posted');
        res.redirect('/');
      });
    } else {
      req.flash('error', 'Comment was NOT Posted');
      res.redirect('/');
    }
  });
});

router.get('/:id/show',(req,res,next)=>{
  Post.findById(req.params.id,(err,foundpost)=>{
    if (err) {
      next(err);
      return;
    }
    if (foundpost) {
      User.findById(foundpost.userwhocreateit,(err,theUser)=>{
        var d = new Date();
        if (err) {
          next(err);
          return;
        }
        if (theUser) {
          var postContent = {
            category:foundpost.whocanseeit,
            comment:[],
              nameofthePerson: theUser.name,
              usernameoftheperson:theUser.username,
              idofpost:foundpost._id,
              idofthePerson: foundpost.userwhocreateit,
              content: foundpost.content,
              photos: foundpost.photos,
              profilepic: theUser.profilepic,
              createat: d.getTime() - foundpost.createdAt.getTime(),

          };
          foundpost.comment.forEach((coment)=>{
            User.findById(coment.author,(err,userwhoComment)=>{
              if (err) {
                next(err);
                return;
              }
              if (userwhoComment) {
                var comments = {
                  authorPhoto:userwhoComment.profilepic,
                  content:coment.content,
                  timeCreated:d.getTime() - coment.createdAt.getTime(),
                  comentPic:coment.photos


                };
                if (userwhoComment.name !== undefined) {
                  comments.authorName = userwhoComment.name;
                }else {
                  comments.authorName = userwhoComment.username;
                }


                 postContent.comment.push(comments);
                 postContent.comment.sort(function(a, b) {
                   a = a.timeCreated;
                   b = b.timeCreated;
                   return a > b ? 11 : a < b ? -1 : 0;
                 });
                 console.log(postContent.comment);
              }



            });
          });
          array.push(postContent);

        }
      });
      setTimeout(function() {
console.log(array+'lllllllllllllllllllllllllllllllllllllll');
              res.render('post/post-view.ejs', {
                  successMessage: req.flash('success'),
                  failMessage: req.flash('error'),
                  post: array,

              });


          array = [];
      }, 900);
    }

  });
});







module.exports = router;
