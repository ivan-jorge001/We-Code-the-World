const express = require('express');
const router = express.Router();
const ensure = require('connect-ensure-login');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user-model.js');
const nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
router.post('/forgot/password',ensure.ensureNotLoggedIn('/'),(req,res,next)=>{

})
router.get("/profile", ensure.ensureLoggedIn('/'), (req, res, next) => {
    res.render('user/profile-view.ejs', {
        successMessage: req.flash('success'),
        failMessage: req.flash('error')
    });
});
const profileUpload = multer({
    dest: path.join(__dirname, '../public/profilepic')
});
router.post('/profile/profilepic', ensure.ensureLoggedIn('/'), profileUpload.single('inputUpload'), (req, res, next) => {
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
router.post('/profile/basic', ensure.ensureLoggedIn('/'), (req, res, next) => {
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
router.post('/profile/password', ensure.ensureLoggedIn('/'), (req, res, next) => {
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
router.post('/profile/new', ensure.ensureLoggedIn('/'), (req, res, next) => {
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
module.exports = router;
