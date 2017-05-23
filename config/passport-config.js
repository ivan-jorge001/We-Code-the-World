const User             = require('../models/user-model.js');
const passport         = require('passport');
const FbStrategy       = require('passport-facebook');
const GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy    = require('passport-local').Strategy;
const bcrypt           = require('bcrypt');
const githubStrategy   = require('passport-github2');

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
