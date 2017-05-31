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
                      console.log(thePost.createdAt.getMinutes(),d.getMinutes()+"ssssssssssssssssssss");
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
                                profilepic:theUsers.profilepic,
                                createat:-thePost.createdAt.getHours()+(d.getHours()) + ":" + (-thePost.createdAt.getMinutes()+(d.getMinutes()))

                            };
                            array.push(postContent);
                            console.log(postContent);
                        }
                    });
                });
            });
            res.render('index', {
                successMessage: req.flash('success'),
                failMessage: req.flash('error'),
                post: array
            });
            array = [];
            return;

        }
        res.render('index', {
            successMessage: req.flash('success'),
            failMessage: req.flash('error'),
            post: ['1','2']
        });


    });
});

module.exports = router;
