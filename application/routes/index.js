var express = require('express');
var router = express.Router();
var isLoggedIn = require ('../middleware/routeprotectors').UserIsLoggedIn;
var getRecentPosts = require('../middleware/postsmiddleware').getRecentPosts;
var db = require('../config/database');


router.get('/', getRecentPosts, function(req, res, next) {
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

router.get('/post/:id(\\d+)', (req,res,next) => {
  let baseSQL = "select u.username, p.title, p.description, p.photopath, p.created \
  FROM users u\
  join posts p\
  on u.id=fk_userid\
  where p.id=?;";

  let postId = req.params.id;
  db.execute(baseSQL,[postId])
  .then(([results, fields]) =>{
    if(results && results.length) {
      let post = results[0];
      res.render('viewpost', {currentPost: post});
    }else{
      req.flash('error', 'This is not the post you are looking for!');
      res.redirect('/');
    }
  })
});

module.exports = router;