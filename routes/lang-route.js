const express = require('express');
const router = express.Router();
const ensure = require('connect-ensure-login');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user-model.js');
const Post = require('../models/post-model.js');
const lang = require('../models/lang-model.js');
const nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var postForEveryone = [];
var postForFriend = [];
var postForWork = [];

var upload = multer({
  dest: path.join(__dirname, '../public/postpic')
});

var cpUpload = upload.fields([{
  name: 'imgpost',
  maxCount: 6
}]);


router.post('/new/:lang/post', ensure.ensureLoggedIn('/'), cpUpload, (req, res, next) => {


  const langId = req.params.lang;

  const newPost = new Post();
  newPost.content = req.body.postcontent;

  if (req.body.numberofpic > 0) {


    req.files.imgpost.forEach((file) => {
      newPost.photos.push(`/postpic/${file.filename}`);
    });
  }

  newPost.userwhocreateit = req.user._id;



  lang.findById(langId, (err, thelang) => {
    console.log(thelang);
    if (err) {
      next(err);
      return;
    }
    thelang.question.push(newPost);
    thelang.save((err) => {
      if (err) {
        next(err);
        return;
      }
      req.user.post.languageQua.push({
        name: thelang.name,
        id: thelang._id
      });
      req.user.save((err) => {
        if (err) {
          next(err);
          return;
        }
      });

      req.flash('success', "Your question was successful");
      res.redirect(`/language/${thelang.name}/${thelang._id}/main`);
    });
  });
  // res.send(req.files);
});

router.get('/language/:name/:id/main', (req, res, next) => {

  lang.findOne({
    _id: req.params.id
  }, (err, theLang) => {
    if (err) {
      next(err);
      return;
    }

    if (theLang) {
      if (theLang.question.length > 0) {



        theLang.question.forEach((onepost) => {

          User.findById(onepost.userwhocreateit, (err, theUser) => {
            if (err) {
              next(err);
              return;
            }
            if (theUser) {

              var d = new Date();
              var postContent = {
                category: onepost.whocanseeit,
                comment: [],
                nameofthePerson: theUser.name,
                usernameoftheperson: theUser.username,
                idofpost: onepost._id,
                idofthePerson: onepost.userwhocreateit,
                content: onepost.content,
                photos: onepost.photos,
                profilepic: theUser.profilepic,
                createat: d.getTime() - onepost.createdAt.getTime(),

              };
              onepost.comment.forEach((coment) => {
                User.findById(coment.author, (err, userwhoComment) => {
                  if (err) {
                    next(err);
                    return;
                  }
                  if (userwhoComment) {
                    var comments = {
                      authorPhoto: userwhoComment.profilepic,
                      content: coment.content,
                      timeCreated: d.getTime() - coment.createdAt.getTime(),
                      comentPic: coment.photos


                    };
                    if (userwhoComment.name !== undefined) {
                      comments.authorName = userwhoComment.name;
                    } else {
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
              postForEveryone.push(postContent);

              postForEveryone.sort(function(a, b) {
                a = a.createat;
                b = b.createat;
                return a > b ? 11 : a < b ? -1 : 0;
              });

            }
          });





        });
      } else {
        postForEveryone.push('Sorry no Post Found');
      }



      setTimeout(function() {

          res.render('lang/createLan-view.ejs', {
            successMessage: req.flash('success'),
            failMessage: req.flash('error'),
            post: postForEveryone,
            lang: theLang
          });



        postForEveryone = [];
      }, 500);
    }
  });

});



router.post('/create/lang', ensure.ensureLoggedIn('/'), (req, res, next) => {

  const language = new lang({
    name: req.body.langInput,
    docum: req.body.docInput,
    profilepic: req.body.urlInput,
    colorRep: req.body.colorInput,
    addedByWho: req.user._id
  });
  language.save((err) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect(`/language/${language.name}/${language._id}/main`);
  });

});


module.exports = router;
