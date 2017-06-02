const express = require('express');
const router = express.Router();
const Post = require('../models/post-model.js');
const multer = require('multer');
const path = require('path');
const ensure = require('connect-ensure-login');
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









module.exports = router;
