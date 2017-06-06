const express = require('express');
const router = express.Router();
const Post = require('../models/post-model.js');
const User = require('../models/user-model.js');
var array = [];






      /* GET home page. */
      router.get('/home', (req, res, next) => {
        User.find({}, (err, theUser) => {
          console.log('gets in here');
          if (err) {
            next(err);
            return;
          }
          if (theUser) {

            theUser.forEach((theUsers) => {

              theUsers.post.postForEveryone.forEach((postsId) => {
                Post.findById(postsId, (err, thePost) => {
                  var d = new Date();
                  if (err) {
                    next(err);
                    return;
                  }
                  if (thePost) {

                    var postContent = {
                      category: thePost.whocanseeit,
                      comment: [],
                      nameofthePerson: theUsers.name,
                      usernameoftheperson: theUsers.username,
                      idofpost: thePost._id,
                      idofthePerson: thePost.userwhocreateit,
                      content: thePost.content,
                      photos: thePost.photos,
                      profilepic: theUsers.profilepic,
                      createat: d.getTime() - thePost.createdAt.getTime(),

                    };

                    thePost.comment.forEach((coment) => {
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

                        }



                      });
                    });
                    array.push(postContent);
                    array.sort(function(a, b) {
                      a = a.createat;
                      b = b.createat;
                      return a > b ? 11 : a < b ? -1 : 0;
                    });

                  }
                });
              });
            });


            setTimeout(function(d) {

              function rend(d) {
                res.render('index', {
                  successMessage: req.flash('success'),
                  failMessage: req.flash('error'),
                  post: array,
                  useronpage: d
                });
              }
              if (req.user !== undefined) {

                rend('login');

              } else {
                rend('needsto');
              }

              array = [];
            }, 900);
            return;

          }



        });
      });

      module.exports = router;
