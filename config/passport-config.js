const User = require('../models/user-model.js');
const passport = require('passport');
const FbStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const githubStrategy = require('passport-github2');

passport.serializeUser((user, cb) => {
    // "cb" is short for "callback"
    cb(null, user._id);
});
passport.deserializeUser((userId, cb) => {
    // "cb" is short for "callback"

    // query the database with the ID from the box
    User.findById(userId, (err, theUser) => {
        if (err) {
            cb(err);
            return;
        }

        // sending the user's info to passport
        cb(null, theUser);
    });
});
 passport.use( new FbStrategy({},()=>{}));

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, (loginUsername, loginPassword, next) => {
    User.findOne({
        username: loginUsername
    }, (err, theUser) => {
        if (err) {
            next(err);
            return;
        }
        if (!theUser) {
            next(null, false, {
                message: 'Wrong Username'
            });
            return;
        }
        console.log(theUser);
        if (!bcrypt.compareSync(loginPassword, theUser.password)) {
            next(null, false, {
                message: 'Wrong Password'
            });
            return;
        }
        next(null, theUser, {
            message: `Login for ${theUser.username} successful. 🤣`
        });
    });
}));
