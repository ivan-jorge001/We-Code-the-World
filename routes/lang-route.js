const express = require('express');
const router = express.Router();
const ensure = require('connect-ensure-login');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user-model.js');
const Post = require('../models/post-model.js');
const lang = require('../models/lang-model.js');
const Ilang = require('../models/lang-info-model.js');

const nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var postForEveryone = [];
var postForFriend = [];
var postForWork = [];

var upload = multer({
  dest: path.join(__dirname, '../public/postpic')
});

var cpUpload = upload.fields([{
  name: 'imgpost',
  maxCount: 6
}]);


router.post('/:kind/:TFLid/posts', ensure.ensureLoggedIn('/home'), cpUpload, (req, res, next) => {
  const TFLid = req.params.TFLid;
  const kind = req.params.kind;


  const newPost = new Post();
  newPost.content = req.body.postcontent;

  if (req.body.numberofpic > 0) {


    req.files.imgpost.forEach((file) => {
      newPost.photos.push(`/postpic/${file.filename}`);
    });
  }

  newPost.userwhocreateit = req.user._id;




  lang.find({}, (err, theLang) => {

    if (err) {
      next(err);
      return;
    }
    theLang.forEach((thelang) => {


      if (kind === 'Tool') {
        thelang.tools.forEach((tool) => {
          if (tool._id.equals(TFLid)) {

            tool.question.push(newPost);
            thelang.save((err) => {
              if (err) {
                next(err);
                return;
              }
              req.user.post.languageQua.push({
                name: tool.name,
                id: newPost._id
              });
              req.user.save((err) => {
                if (err) {
                  next(err);
                  return;
                }
              });

              req.flash('success', "Your question was successful");
              res.redirect(`/${kind}/${tool.name}/${tool._id}/main`);
            });
            // /Framework/AngularJs/59359e0f137d4517267b1a4a/main
          }
        });
      }
      if (kind === 'Framework') {
        thelang.framework.forEach((oneFram) => {
          if (oneFram._id.equals(TFLid)) {

            oneFram.question.push(newPost);
            thelang.save((err) => {
              if (err) {
                next(err);
                return;
              }
              req.user.post.languageQua.push({
                name: oneFram.name,
                id: newPost._id
              });
              req.user.save((err) => {
                if (err) {
                  next(err);
                  return;
                }
              });

              req.flash('success', "Your question was successful");
              res.redirect(`/${kind}/${oneFram.name}/${oneFram._id}/main`);
            });
            // /Framework/AngularJs/59359e0f137d4517267b1a4a/main
          }
        });
      }
      if (kind === 'Library') {
        thelang.libaries.forEach((oneLib) => {
          if (oneLib._id.equals(TFLid)) {

            oneLib.question.push(newPost);
            thelang.save((err) => {
              if (err) {
                next(err);
                return;
              }
              req.user.post.languageQua.push({
                name: oneLib.name,
                id: newPost._id
              });
              req.user.save((err) => {
                if (err) {
                  next(err);
                  return;
                }
              });


              req.flash('success', "Your question was successful");
              res.redirect(`/${kind}/${oneLib.name}/${oneLib._id}/main`);
            });
            // /Framework/AngularJs/59359e0f137d4517267b1a4a/main
          }
        });
      }
    });
  });
});

router.post('/new/:lang/post', ensure.ensureLoggedIn('/home'), cpUpload, (req, res, next) => {


  const langId = req.params.lang;

  const newPost = new Post();
  newPost.content = req.body.postcontent;

  if (req.body.numberofpic > 0) {


    req.files.imgpost.forEach((file) => {
      newPost.photos.push(`/postpic/${file.filename}`);
    });
  }

  newPost.userwhocreateit = req.user._id;



  lang.findById(langId, (err, thelang) => {
    console.log(thelang);
    if (err) {
      next(err);
      return;
    }
    thelang.question.push(newPost);
    console.log('pingaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    thelang.save((err) => {
      if (err) {
        next(err);
        return;
      }
      console.log('pingaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

      next();
    });
    req.user.post.languageQua.push({
      name: thelang.name,
      id: thelang._id
    });
    req.user.save((err) => {
      if (err) {
        next(err);
        return;
      }
      console.log('pingaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');


      req.flash('success', "Your question was successful");
      res.redirect(`/language/${thelang.name}/${thelang._id}/main`);
    });
  });
  // res.send(req.files);
});

router.get('/language/:name/:id/main', (req, res, next) => {
  console.log('first tier');
  lang.findOne({
    _id: req.params.id
  }, (err, theLang) => {
    if (err) {
      next(err);
      return;
    }

    if (theLang) {
      console.log(theLang, 'ssssssssssssssssssssssssssss');



      console.log('thrid tiers');


      theLang.question.forEach((onepost) => {
        console.log('foursth tier');

        User.findById(onepost.userwhocreateit, (err, theUser) => {
          if (err) {
            next(err);
            return;
          }
          if (theUser) {

            var d = new Date();
            var postContent = {
              category: onepost.whocanseeit,
              comment: [],
              nameofthePerson: theUser.name,
              usernameoftheperson: theUser.username,
              idofpost: onepost._id,
              idofthePerson: onepost.userwhocreateit,
              content: onepost.content,
              photos: onepost.photos,
              profilepic: theUser.profilepic,
              createat: d.getTime() - onepost.createdAt.getTime(),

            };
            onepost.comment.forEach((coment) => {
              User.findById(coment.author, (err, userwhoComment) => {
                if (err) {
                  next(err);
                  return;
                }
                if (userwhoComment) {
                  var comments = {
                    authorPhoto: userwhoComment.profilepic,
                    content: coment.content,
                    timeCreated: d.getTime() - coment.createdAt.getTime(),
                    comentPic: coment.photos


                  };
                  if (userwhoComment.name !== undefined) {
                    comments.authorName = userwhoComment.name;
                  } else {
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




      setTimeout(function() {

        res.render('lang/createLan-view.ejs', {
          successMessage: req.flash('success'),
          failMessage: req.flash('error'),
          post: postForEveryone,
          lang: theLang
        });



        postForEveryone = [];
      }, 500);
    }
  });

});



router.post('/create/lang', ensure.ensureLoggedIn('/home'), (req, res, next) => {


  var arrayOf = ['Java', 'C', 'C++', 'C#', 'Python', 'Visual Basic .NET', 'PHP', 'JavaScript', 'Swift', 'Perl', 'Ruby', 'Delphi/Object Pascal', 'Assembly language', 'R', 'Visual Basic', 'Objective-C', 'Go', 'MATLAB', 'PL', 'Scratch', 'SAS', 'D', 'Dart', 'ABAP', 'COBOL', 'Ada', 'Fortran', 'Transact-SQL', 'Lua', 'Scala', 'Logo', 'F#', 'Lisp', 'LabVIEW', 'Prolog', 'Haskell', 'Scheme', 'Groovy', 'RPG (OS/400)', 'Apex', 'Erlang', 'MQL4', 'Rust', 'Bash', 'Ladder Logic', 'Q', 'Julia', 'Alice', 'VHDL', 'Awk'];
  if (arrayOf.indexOf(`${req.body.langInput}`) !== -1) {

    lang.find({
      name: req.body.langInput
    }, (err, foundit) => {
      if (err) {
        next(err);
        return;
      }
      if (foundit.length > 0) {
        console.log(foundit.length);
        req.flash('error', 'Sorry we already have that Language in Our system');
        res.redirect(`/`);
        return;
      }


      const language = new lang({
        name: req.body.langInput,
        docum: req.body.docInput,
        profilepic: req.body.urlInput,
        colorRep: req.body.colorInput,
        addedByWho: req.user._id
      });


      language.save((err) => {
        if (err) {
          next(err);
          return;
        }

        res.redirect(`/language/${language.name}/${language._id}/main`);
      });

    });
  } else {
    req.flash('error', 'Sorry we don`t Recognize that Language in Our system');
    res.redirect(`/`);
  }
});

router.post('/:idlan/:whats/create', ensure.ensureLoggedIn('/home'), (req, res, next) => {
  const whatisit = req.params.whats;
  const langID = req.params.idlan;

  const Frame = new Ilang({
    name: req.body.langInput,
    Docs: req.body.docInput,
    photo: req.body.urlInput,
    colorRep: req.body.colorInput,
    author: req.user._id
  });

  if (whatisit === 'Tool') {

    lang.findById(langID, (err, foundit) => {
      if (err) {
        next(err);
        return;
      }
      if (foundit) {
        foundit.tools.push(Frame);

        foundit.save((err) => {
          if (err) {
            next(err);
            return;
          }

          res.redirect(`/${whatisit}/${Frame.name}/${Frame._id}/main`);

        });
      }

    });
  }
  if (whatisit === 'Framework') {

    lang.findById(langID, (err, foundit) => {
      if (err) {
        next(err);
        return;
      }
      if (foundit) {
        foundit.framework.push(Frame);

        foundit.save((err) => {
          if (err) {
            next(err);
            return;
          }

          res.redirect(`/${whatisit}/${Frame.name}/${Frame._id}/main`);

        });
      }

    });

  }
  if (whatisit === 'Library') {

    lang.findById(langID, (err, foundit) => {
      if (err) {
        next(err);
        return;
      }
      if (foundit) {
        foundit.libaries.push(Frame);

        foundit.save((err) => {
          if (err) {
            next(err);
            return;
          }

          res.redirect(`/${whatisit}/${Frame.name}/${Frame._id}/main`);

        });
      }

    });

  }
});


router.get('/:kind/:name/:id/main', (req, res, next) => {
  const nameOfTFL = req.params.name;
  const idOfTFL = req.params.id;
  const kind = req.params.kind;



  if (kind == 'Tool') {
    lang.find({}, (err, Lang) => {
      if (err) {
        next(err);
        return;
      }
      Lang.forEach((theLang) => {
        console.log('foursth tier1');


        if (theLang.tools.length > 0) {
          console.log('foursth tier2');

          theLang.tools.forEach((frame) => {
            console.log('foursth tier3');

            if (frame._id.equals(idOfTFL)) {
              console.log('foursth tier4');
              console.log(frame.question, 'idddddddddddd');


              frame.question.forEach((onepost) => {
                console.log('foursth tier5', onepost);

                User.findById(onepost.userwhocreateit, (err, theUser) => {
                  if (err) {
                    next(err);
                    return;
                  }
                  if (theUser) {

                    var d = new Date();
                    var postContent = {
                      category: onepost.whocanseeit,
                      comment: [],
                      nameofthePerson: theUser.name,
                      usernameoftheperson: theUser.username,
                      idofpost: onepost._id,
                      idofthePerson: onepost.userwhocreateit,
                      content: onepost.content,
                      photos: onepost.photos,
                      profilepic: theUser.profilepic,
                      createat: d.getTime() - onepost.createdAt.getTime(),

                    };
                    onepost.comment.forEach((coment) => {
                      User.findById(coment.author, (err, userwhoComment) => {
                        if (err) {
                          next(err);
                          return;
                        }
                        if (userwhoComment) {
                          var comments = {
                            authorPhoto: userwhoComment.profilepic,
                            content: coment.content,
                            timeCreated: d.getTime() - coment.createdAt.getTime(),
                            comentPic: coment.photos


                          };
                          if (userwhoComment.name !== undefined) {
                            comments.authorName = userwhoComment.name;
                          } else {
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




              setTimeout(function() {

                res.render('lang/TFL-view.ejs', {
                  successMessage: req.flash('success'),
                  failMessage: req.flash('error'),
                  post: postForEveryone,
                  lang: frame,
                  kind: kind,
                  langu: theLang
                });



                postForEveryone = [];
              }, 500);
            }
          });
        }
      });
    });

  }
  if (kind == 'Library') {
    lang.find({}, (err, Lang) => {
      if (err) {
        next(err);
        return;
      }
      Lang.forEach((theLang) => {
        console.log('foursth tier1');


        if (theLang.libaries.length > 0) {
          console.log('foursth tier2');

          theLang.libaries.forEach((frame) => {
            console.log('foursth tier3');

            if (frame._id.equals(idOfTFL)) {
              console.log('foursth tier4');
              console.log(frame.question, 'idddddddddddd');


              frame.question.forEach((onepost) => {
                console.log('foursth tier5', onepost);

                User.findById(onepost.userwhocreateit, (err, theUser) => {
                  if (err) {
                    next(err);
                    return;
                  }
                  if (theUser) {

                    var d = new Date();
                    var postContent = {
                      category: onepost.whocanseeit,
                      comment: [],
                      nameofthePerson: theUser.name,
                      usernameoftheperson: theUser.username,
                      idofpost: onepost._id,
                      idofthePerson: onepost.userwhocreateit,
                      content: onepost.content,
                      photos: onepost.photos,
                      profilepic: theUser.profilepic,
                      createat: d.getTime() - onepost.createdAt.getTime(),

                    };
                    onepost.comment.forEach((coment) => {
                      User.findById(coment.author, (err, userwhoComment) => {
                        if (err) {
                          next(err);
                          return;
                        }
                        if (userwhoComment) {
                          var comments = {
                            authorPhoto: userwhoComment.profilepic,
                            content: coment.content,
                            timeCreated: d.getTime() - coment.createdAt.getTime(),
                            comentPic: coment.photos


                          };
                          if (userwhoComment.name !== undefined) {
                            comments.authorName = userwhoComment.name;
                          } else {
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




              setTimeout(function() {

                res.render('lang/TFL-view.ejs', {
                  successMessage: req.flash('success'),
                  failMessage: req.flash('error'),
                  post: postForEveryone,
                  lang: frame,
                  kind: kind,
                  langu: theLang
                });



                postForEveryone = [];
              }, 500);
            }
          });
        }
      });
    });

  }
  if (kind == 'Framework') {
    lang.find({}, (err, Lang) => {
      if (err) {
        next(err);
        return;
      }
      Lang.forEach((theLang) => {
        console.log('foursth tier1');


        if (theLang.framework.length > 0) {
          console.log('foursth tier2');

          theLang.framework.forEach((frame) => {
            console.log('foursth tier3');

            if (frame._id.equals(idOfTFL)) {
              console.log('foursth tier4');
              console.log(frame.question, 'idddddddddddd');


              frame.question.forEach((onepost) => {
                console.log('foursth tier5', onepost);

                User.findById(onepost.userwhocreateit, (err, theUser) => {
                  if (err) {
                    next(err);
                    return;
                  }
                  if (theUser) {

                    var d = new Date();
                    var postContent = {
                      category: onepost.whocanseeit,
                      comment: [],
                      nameofthePerson: theUser.name,
                      usernameoftheperson: theUser.username,
                      idofpost: onepost._id,
                      idofthePerson: onepost.userwhocreateit,
                      content: onepost.content,
                      photos: onepost.photos,
                      profilepic: theUser.profilepic,
                      createat: d.getTime() - onepost.createdAt.getTime(),

                    };
                    onepost.comment.forEach((coment) => {
                      User.findById(coment.author, (err, userwhoComment) => {
                        if (err) {
                          next(err);
                          return;
                        }
                        if (userwhoComment) {
                          var comments = {
                            authorPhoto: userwhoComment.profilepic,
                            content: coment.content,
                            timeCreated: d.getTime() - coment.createdAt.getTime(),
                            comentPic: coment.photos


                          };
                          if (userwhoComment.name !== undefined) {
                            comments.authorName = userwhoComment.name;
                          } else {
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




              setTimeout(function() {

                res.render('lang/TFL-view.ejs', {
                  successMessage: req.flash('success'),
                  failMessage: req.flash('error'),
                  post: postForEveryone,
                  lang: frame,
                  kind: kind,
                  langu: theLang
                });



                postForEveryone = [];
              }, 500);
            }
          });
        }
      });
    });

  }



});

router.get('/:whatisit/:langid/:TFLid/delete', (req, res, next) => {
  console.log('get in hehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');

  lang.findById(req.params.langid, (err, theLang) => {
    if (err) {
      next(err);
      return;
    }
    const TFLid = req.params.TFLid;
    const whatisit = req.params.whatisit;



    if (whatisit === 'language') {
      theLang.question.forEach((onePost) => {
        if (onePost._id.equals(TFLid)) {
          var index = theLang.question.indexOf(onePost);
          if (index > -1) {
            theLang.question.splice(index, 1);
          }
          theLang.save((err) => {
            if (err) {
              next(err);
              return;
            }
            req.flash('success', 'Post was deleted');
            res.redirect(`/language/${theLang.name}/${theLang._id}/main`);

          });
        }
      });
    }
    if (whatisit === 'Tool') {
      theLang.tools.forEach((frame) => {

        frame.question.forEach((onepost) => {
          if (onepost._id.equals(TFLid)) {
            var index = frame.question.indexOf(onepost);
            if (index > -1) {
              frame.question.splice(index, 1);
            }
            theLang.save((err) => {
              if (err) {
                next(err);
                return;
              }
              req.flash('success', 'Post was deleted');

              res.redirect(`/Tool/${frame.name}/${frame._id}/main`);

            });
          }
        });

      });
    }
    if (whatisit === 'Library') {
      theLang.libaries.forEach((frame) => {

        frame.question.forEach((onepost) => {
          if (onepost._id.equals(TFLid)) {
            var index = frame.question.indexOf(onepost);
            if (index > -1) {
              frame.question.splice(index, 1);
            }
            theLang.save((err) => {
              if (err) {
                next(err);
                return;
              }
              req.flash('success', 'Post was deleted');

              res.redirect(`/Library/${frame.name}/${frame._id}/main`);

            });
          }
        });

      });
    }
    if (whatisit === 'Framework') {
      theLang.framework.forEach((frame) => {

        frame.question.forEach((onepost) => {
          if (onepost._id.equals(TFLid)) {
            var index = frame.question.indexOf(onepost);
            if (index > -1) {
              frame.question.splice(index, 1);
            }
            theLang.save((err) => {
              if (err) {
                next(err);
                return;
              }
              req.flash('success', 'Post was deleted');

              res.redirect(`/Framework/${frame.name}/${frame._id}/main`);

            });
          }
        });

      });

    }

  });

});


module.exports = router;
