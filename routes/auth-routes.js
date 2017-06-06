const express = require('express');
const router = express.Router();
const User = require('../models/user-model.js');
const ensure = require('connect-ensure-login');
const bcrypt = require('bcrypt');
const passport = require('passport');

router.post('/user/signup', ensure.ensureNotLoggedIn('/home'), (req, res, next) => {
    const usernamegiven = req.body.username;
    const emailgiven = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (usernamegiven === '' || emailgiven === '' || password === '' || confirmPassword === '') {
        req.flash('error', 'Please Fill in all the Blanks');
        res.redirect('/home');
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
            res.redirect('/home');
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
            res.redirect('/home');
        });
    });
});

router.post('/user/login', ensure.ensureNotLoggedIn('/home'), passport.authenticate('local', {
    successRedirect: '/',
    successFlash: true, // req.flash('success')
    failureRedirect: '/',
    failureFlash: true // req.flash('error')
}));

router.get('/user/logout',ensure.ensureLoggedIn('/home'), (req, res, next) => {
    // req.logout() method provided by Passport
    req.logout();

    req.flash('success', 'You have logged out successfully. 🤠');

    res.redirect('/home');
});

router.get('/auth/facebook/',ensure.ensureNotLoggedIn('/home'), passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successFlash: 'Your login was successful with your Facebook',
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: 'You Facebook login was unsuccesful'
}));
router.get('/auth/google/',ensure.ensureNotLoggedIn('/home'), passport.authenticate('google', {
    scope: ["https://www.googleapis.com/auth/plus.login",
        "https://www.googleapis.com/auth/plus.profile.emails.read"
    ]
}));

router.get('/auth/google/callback',ensure.ensureNotLoggedIn('/home'), passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
    successFlash: 'Your Google account was verified',
    failMessage: 'Your Google account cant be verified'

}));
router.get('/auth/linkedin', ensure.ensureNotLoggedIn('/home'),passport.authenticate('linkedin', {
    state: 'SOME STATE'
}));
router.get('/auth/link/callback',ensure.ensureNotLoggedIn('/home'), passport.authenticate('linkedin', {
    successRedirect: '/',
    failureRedirect: '/',
    successFlash: 'Your Linkedin account has been verified',
    failureFlash: "Your Linkedin account couldn't be verified"
}));

module.exports = router;
