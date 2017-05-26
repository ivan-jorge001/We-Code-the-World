const User = require('../models/user-model.js');
const passport = require('passport');
const FbStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;


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




passport.use(new LinkedInStrategy({
    clientID: process.env.LINKIN_ID,
    clientSecret: process.env.LINKIN_SECRET,
    callbackURL: "/auth/link/callback",
    scope: ['r_emailaddress', 'r_basicprofile']
}, (accessToken, refreshToken, profile, done) => {
  console.log(' =================================================================');
  console.log('Linkedin5 Profile =======================');
  console.log(profile);
  console.log(' ===================================================================');
    User.findOne({
        linkedinID: profile.id
    }, (err, theUser) => {
        if (err) {
            done(err);
            return;
        }
        if (theUser) {
            done(null, theUser);
            return;
        }

        const newUser = new User({
            linkedinID: profile.id,
            name:profile.displayName,
            email:profile.emails[0].value,
            username:profile.emails[0].value,
            profilepic:profile.photos[0]
        });
        console.log(newUser);

        newUser.save((err) => {
            if (err) {
                done(err);
                return;
            }
            done(null, newUser);
        });
    });

}));

passport.use(new FbStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, done) => {
    console.log(' =================================================================');
    console.log('facebook Profile =======================');
    console.log(profile);
    console.log(' ===================================================================');
    User.findOne({
        facebookID: profile.id
    }, (err, theUser) => {
        if (err) {
            done(err);
            return;
        }

        if (theUser) {
            done(null, theUser);
        }

        const newUser = new User({
            facebookID: profile.id,
            name:profile.displayName,
            email:profile.emails[0].value,
            username:profile.emails[0].value,
            profilepic:profile.photos[0].value
        });
        console.log(newUser);
        newUser.save((err) => {
            if (err) {
                done(err);
                return;
            }
            done(null, newUser);
        });
    });

}));
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    console.log(' =================================================================');
    console.log('GOOGLE Profile =======================');
    console.log(profile);
    console.log(' ===================================================================');
    User.findOne({
        googleID: profile.id
    }, (err, foundUser) => {
        if (err) {
            done(err);
            return;
        }
        if (foundUser) {
            done(null, foundUser);
            return;
        }
        const theUser = new User({
            googleID: profile.id,
            name:profile.displayName,
            email:profile.emails[0].value,
            username:profile.emails[0].value,
            profilepic:profile.photos[0].value
        });
        console.log(theUser);

        theUser.save((err) => {
            if (err) {
                done(err);
                return;
            }
            done(null, theUser);
        });
    });
}));


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
