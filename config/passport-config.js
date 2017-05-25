const User = require('../models/user-model.js');
const passport = require('passport');
const FbStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const githubStrategy = require('passport-github2');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GitHubTokenStrategy = require('passport-github-token');


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

passport.use(new githubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    passReqToCallback: '/auth/github/callback'
}, (req, accessToken, refreshToken, profile, next) => {
  console.log(' =================================================================');
  console.log('GitHUB Profile =======================');
  console.log(profile);
  console.log(' ===================================================================');
    User.findOne({
        githubID: profile.id
    }, (err, theUser) => {
        if (err) {
            next(err);
            return;
        }
        if (theUser) {
          next(null,theUser);
          return;
        }
        const newUser = new User({
          githubID:profile.id
        });
        newUser.save((err)=>{
          if (err) {
            next(err);
            return;
          }
          next(null,newUser);
        });
    });
}));


passport.use(new LinkedInStrategy({
    clientID: process.env.LINKIN_ID,
    clientSecret: process.env.LINKIN_SECRET,
    callbackURL: "/auth/link/callback",
    scope: ['r_emailaddress', 'r_basicprofile'],
}, (accessToken, refreshToken, profile, done) => {
  console.log(' =================================================================');
  console.log('Linkedin Profile =======================');
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
            name: profile.displayName
        });
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
    callbackURL: '/auth/facebook/callback'
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
            name: profile.displayName
        });
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
        googleID: profile.id,
        name: profile.displayName
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

        });
        if (!theUser.name) {
            theUser.name = profile.emails[0].value;
        }
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
