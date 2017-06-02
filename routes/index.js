const express = require('express');
const router = express.Router();
const Post = require('../models/post-model.js');
const User = require('../models/user-model.js');
var array = [];


/* GET home page. */
router.get('/', (req, res, next) => {
    User.find({}, (err, theUser) => {

        if (err) {
            next(err);
            return;
        }
        if (theUser) {
            console.log(theUser);
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
                              category:thePost.whocanseeit,
                                nameofthePerson: theUsers.name,
                                usernameoftheperson:theUsers.username,
                                idofpost:thePost._id,
                                idofthePerson: thePost.userwhocreateit,
                                content: thePost.content,
                                photos: thePost.photos,
                                profilepic: theUsers.profilepic,
                                createat: d.getTime() - thePost.createdAt.getTime(),

                            };
                            array.push(postContent);
                            array.sort(function(a, b) {
                                a = a.createat;
                                b = b.createat;
                                return a > b ? 11 : a < b ? -1 : 0;
                            });
                            console.log(postContent);
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
                  console.log(req.user._id.toString());

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
