const express = require('express');
const router = express.Router();
const ensure = require('connect-ensure-login');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user-model.js');


router.get("/profile", ensure.ensureLoggedIn('/'), (req, res, next) => {
    res.render('user/profile-view.ejs', { successMessage:req.flash('success'), failMessage:req.flash('error')}  );
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
// router.post('/profile/update', ensure.ensureLoggedIn('/'), profileUpload.single('inputUpload'), (req, res, next) => {
// console.log(req.body.language+'===========================================');
// console.log(req.body+'===========================================');
//     const email = req.body.inputEmail,
//         name = req.body.inputName,
//         username = req.body.inputUsername,
//         password = req.body.inputPassword,
//         confirmPassword = req.body.inputConfirmPassword,
//         profilepic = `/profilepic/${req.file.filename}`,
//         bio = req.body.inputBio,
//         language= req.body.language,
//         lookingforjob = req.body.inputLookingforjob;
//
//         if (name) {
//     req.user.name = name;
//         }
//     if (email) {
// req.user.email = email;
//     }
//     if (profilepic) {
// req.user.profilepic = profilepic;
//     }
//     if (bio) {
// req.user.bio = bio;
//     }
//     if (language) {
//       language.forEach((oneLang)=>{
//         req.user.language.push(oneLang);
//       });
//     }
//     req.user.lookingforjob = lookingforjob;
//
//     if (username) {
//       User.findOne({username:username},(err,found)=>{
//         if (err) {
//           next(err);
//           return;
//         }
//         if (found) {
//           req.flash('success','The Username Selected is Already Taken');
//           res.redirect('/profile');
//         }
//         req.user.username= username;
//       });
//
//     }
//     // if (req.body.inputConfirmPass && req.body.inputPassword && req.body.inputCurrentPassword) {
//     //     if (req.body.inputConfirmPass === req.body.inputPassword) {
//     //       if (bcrypt.compareSync(req.body.inputCurrentPassword, req.user.password)) {
//     //         const salt = bcrypt.genSaltSync(10);
//     //         const hashPass = bcrypt.HashSync(req.body.inputCurrentPassword,salt);
//     //         req.user.password = hashPass;
//     //       }else {
//     //         req.flash('warn','Your current Password dont Math');
//     //         res.redirect('/profile');
//     //       }
//     //     }else {
//     //       req.flash('warn','Your New Password Dont Match');
//     //       res.redirect('/profile');
//     //     }
//     // }else {
//     //   return;
//     // }
//     req.user.save((err) => {
//         if (err) {
//             next(err);
//             return;
//         }
//         req.flash('success', 'You have Successfully Updated Your Profile');
//         res.redirect('/profile');
//     });
//
// });
module.exports = router;
