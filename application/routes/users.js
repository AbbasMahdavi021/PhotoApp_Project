var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({message:'respond with a resource'});
});

//http://localhost:3000/users/login
router.post('/login', (req,res,next) => {
  res.send('req.body');
})

module.exports = router;
