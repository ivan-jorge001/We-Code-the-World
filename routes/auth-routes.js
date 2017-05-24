const express = require('express');
const router = express.Router();
const User = require('../models/user-model.js');
const ensure = require('connect-ensure-login');
const bcrypt = require('bcrypt');
const passport = require('passport');

router.post('/user/signup', ensure.ensureNotLoggedIn('/'),(req, res, next) => {
    const usernamegiven = req.body.username;
    const emailgiven = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (usernamegiven === '' || emailgiven === '' || password === '' || confirmPassword === '') {
        req.flash('error', 'Please Fill in all the Blanks');
        res.redirect('/');
        return;
    }
    User.findOne({
        username: usernamegiven
    }, (err, theUser) => {
        if (err) {
            next(err);
            return;
        }
        if (theUser) {
            req.flash('error', 'Please Select Another Username Yours is Taken');
            res.redirect('/');
            return;
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
        const newUser = new User({
            username: usernamegiven,
            password: hashPass,
            email: emailgiven
        });

        newUser.save((err) => {
            if (err) {
                next(err);
                return;
            }
            req.flash('success', 'You Have Successfuly Sign Up');
            res.redirect('/');
        });
    });
});

router.post('/user/login', ensure.ensureNotLoggedIn('/'),passport.authenticate('local',{
        successRedirect: '/',
         successFlash: true, // req.flash('success')
         failureRedirect: '/',
         failureFlash: true // req.flash('error')
}));

router.get('/user/logout', (req, res, next) => {
    // req.logout() method provided by Passport
    req.logout();

    req.flash('success', 'You have logged out successfully. 🤠');

    res.redirect('/');
});


module.exports = router;
