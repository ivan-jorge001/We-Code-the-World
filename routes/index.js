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
                        console.log(d.getTime() - thePost.createdAt.getTime() + "ssssssssssssssssssss");
                        if (err) {
                            next(err);
                            return;
                        }
                        if (thePost) {
                            var postContent = {
                                nameofthePerson: theUsers.name,
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
            setTimeout(function() {
                res.render('index', {
                    successMessage: req.flash('success'),
                    failMessage: req.flash('error'),
                    post: array
                });
                array = [];
            }, 900);

            return;

        }



    });
});

module.exports = router;
