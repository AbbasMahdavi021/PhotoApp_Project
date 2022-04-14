var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"Abbas Mahdavi" });
});

router.get('/login', (req,res,next) => {
  res.render('login');
})

router.get('/register', (req,res,next) => {
  res.render('register');
})

module.exports = router;
