const express = require('express');
const router = express.Router();
const ensure = require('connect-ensure-login');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user-model.js');
const Post = require('../models/post-model.js');

const nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var postForEveryone = [];
var postForFriend = [];
var postForWork = [];

router.post('/forgot/password', ensure.ensureNotLoggedIn('/home'), (req, res, next) => {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({
                email: req.body.inputForgotpass
            }, function(err, user) {
                if (err) {
                    next(err);
                    return;
                }
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/home');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save((err) => {
                    if (err) {
                        next(err);
                        return;
                    }
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.GMAIL,
                    pass: process.env.PASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/home');
    });
});









router.get("/profile", ensure.ensureLoggedIn('/home'), (req, res, next) => {
    res.render('user/profile-view.ejs', {
        successMessage: req.flash('success'),
        failMessage: req.flash('error')
    });
});
const profileUpload = multer({
    dest: path.join(__dirname, '../public/profilepic')
});
router.post('/profile/profilepic', ensure.ensureLoggedIn('/home'), profileUpload.single('inputUpload'), (req, res, next) => {
    console.log('gets in the post');
    User.findByIdAndUpdate(req.user._id, {
        profilepic: `/profilepic/${req.file.filename}`
    }, (err, theUser) => {
        if (err) {
            next(err);
            return;
        }
        console.log(theUser);
        req.flash('success', 'Picture Uploaded');
        res.redirect('/profile');
    });
});
router.post('/profile/basic', ensure.ensureLoggedIn('/home'), (req, res, next) => {
    User.findOne({
        username: req.body.inputUsername
    }, (err, found) => {
        if (err) {
            next(err);
            return;
        }
        if (found) {
            req.flash('error', 'Your Selected Username is Taken, Please Choose a New One');
            res.redirect('/profile');
            return;
        }
    });
    User.findByIdAndUpdate(req.user._id, {
        name: req.body.inputName,
        email: req.body.inputEmail,
        username: req.body.inputUsername,
        bio: req.body.inputBio
    }, (err, theUser) => {
        if (err) {
            next(err);
            return;
        }
        req.flash('success', 'Profile Updated ');
        res.redirect('/profile');
    });
});
router.post('/profile/password', ensure.ensureLoggedIn('/home'), (req, res, next) => {
    const current = req.body.inputCurrentPassword,
        confirmPassword = req.body.inputConfirmPass,
        actualPassword = req.body.inputPassword;
    if (confirmPassword && actualPassword && current) {
        if (bcrypt.compareSync(current, req.user.password)) {
            if (confirmPassword === actualPassword) {
                if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,32}$/.test(actualPassword) === true) {
                    if (confirmPassword && actualPassword && bcrypt.compareSync(current, req.user.password)) {
                        const salt = bcrypt.genSaltSync(10);
                        const hashPass = bcrypt.hashSync(req.body.inputPassword, salt);
                        req.user.password = hashPass;
                    }
                } else {
                    req.flash('error', `Minimum 8 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet and 1 Number:`);
                    res.redirect('/profile');
                    return;
                }
            } else {
                req.flash('error', `Your New Password don't Match`);
                res.redirect('/profile');
                return;
            }
        } else {
            req.flash('error', `Your Current Password Don't Match`);
            res.redirect('/profile');
            return;
        }
    } else {
        req.flash('error', `Please fill in all the Blanks`);
        res.redirect('/profile');
        return;
    }
    req.user.save((err) => {
        if (err) {
            next(err);
            return;
        }
        req.flash('success', 'You have Successfully Updated Your Password');
        res.redirect('/profile');
    });

});
router.post('/profile/new', ensure.ensureLoggedIn('/home'), (req, res, next) => {
    const
        confirmPassword = req.body.inputConfirmPass,
        actualPassword = req.body.inputPassword;
    if (confirmPassword && actualPassword) {
        if (confirmPassword === actualPassword) {
            if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,32}$/.test(actualPassword) === true) {
                const salt = bcrypt.genSaltSync(10);
                const hashPass = bcrypt.hashSync(req.body.inputPassword, salt);
                req.user.password = hashPass;
            } else {
                req.flash('error', `Minimum 8 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet and 1 Number:`);
                res.redirect('/profile');
                return;
            }
        } else {
            req.flash('error', `Your Passwords don't Match`);
            res.redirect('/profile');
            return;
        }

    } else {
        req.flash('error', `Please fill in all the Blanks`);
        res.redirect('/profile');
        return;
    }
    req.user.save((err) => {
        if (err) {
            next(err);
            return;
        }
        req.flash('success', 'You have Successfully Created Your Password');
        res.redirect('/profile');
    });

});

router.get('/reset/:token', function(req, res) {

    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if (!user) {


            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/home');
        }
if (user) {
console.log(user);
  res.render('index', {
    reset: true
  });
}
    });
});
router.post('/reset/:token', (req, res, next) => {


    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if (err) {
            next(err);
            return;
        }
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/home');
        }

        const
            confirmPassword = req.body.inputConfirmPass,
            actualPassword = req.body.inputPassword;
        if (confirmPassword && actualPassword) {
            if (confirmPassword === actualPassword) {
                if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,32}$/.test(actualPassword) === true) {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPass = bcrypt.hashSync(actualPassword, salt);
                    user.password = hashPass;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                } else {
                    req.flash('error', `Minimum 8 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet and 1 Number:`);
                    res.redirect(`/reset/${req.params.token}`);
                    return;
                }
            } else {
                req.flash('error', `Your Passwords don't Match`);
                res.redirect(`/reset/${req.params.token}`);
                return;
            }

        } else {
            req.flash('error', `Please fill in all the Blanks`);
            res.redirect(`/reset/${req.params.token}`);
            return;
        }


        user.save((err) => {
            if (err) {
                next(err);
                return;
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                return;
            });
        });




        var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL,
                pass: process.env.PASSWORD
            }
        });
        var mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            done(err);
        });
        req.flash('success', 'Success! Your password has been changed.');
        res.redirect('/home');

    });
});

router.get('/:id/profile', (req, res, next) => {

    User.findOne({
        _id: req.params.id
    }, (err, theUser) => {
        if (err) {
            next(err);
            return;
        }

        if (theUser) {

            if (theUser.post.postForEveryone.length > 0) {



                theUser.post.postForEveryone.forEach((onepost) => {


                    Post.findById(onepost, (err, foundPost) => {
                      var d = new Date();
                        if (err) {
                            next(err);
                            return;
                        }
                        if (foundPost) {

                          var postContent = {
                            category:foundPost.whocanseeit,
                            comment:[],
                              nameofthePerson: theUser.name,
                              usernameoftheperson:theUser.username,
                              idofpost:foundPost._id,
                              idofthePerson: foundPost.userwhocreateit,
                              content: foundPost.content,
                              photos: foundPost.photos,
                              profilepic: theUser.profilepic,
                              createat: d.getTime() - foundPost.createdAt.getTime(),

                          };

                          foundPost.comment.forEach((coment)=>{
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
                console.log("PoTATO!!!");
                postForEveryone.push('Sorry no Post Found');
            }
            console.log("BANANA!!!5");


            setTimeout(function(d) {
              function rend(d) {
                res.render('user/user-profile.ejs', {
                  successMessage: req.flash('success'),
                  failMessage: req.flash('error'),
                  anon: theUser,
                  post:postForEveryone,
                  useronpage:d
                });
              }
              if (req.user !== undefined) {

                if (req.user._id.equals(theUser._id)) {rend('same');}else {rend('different');}}else {rend('anon');}

              postForEveryone = [];
            }, 500);
        }
    });

});


module.exports = router;
