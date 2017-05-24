const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log("---------------------------req -------------flash-------------------------");
  res.render('index', { successMessage:req.flash('success'), failMessage:req.flash('error')  });
});

module.exports = router;
