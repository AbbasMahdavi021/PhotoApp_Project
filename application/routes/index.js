var express = require('express');
var router = express.Router();
var isLoggedIn = require ('../middleware/routeprotectors').UserIsLoggedIn;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"Abbas Mahdavi" });
});

router.get('/login', (req,res,next) => {
  res.render('login');
});

router.get('/register', (req,res,next) => {
  res.render('register');
});

router.use('/postimage', isLoggedIn);
router.get('/postimage', (req,res,next) => {
  res.render('postimage');
});

router.get('/viewpost', (req,res,next) => {
  res.render('viewpost');
});

module.exports = router;