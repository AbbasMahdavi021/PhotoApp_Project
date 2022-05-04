var express = require('express');
var router = express.Router();
var db = require('../config/database');
const { errorPrint, successPrint } = require('../helpers/debug/debugprinters');
const UserError = require('../helpers/error/UserError');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({message:'respond with a resource'});
});

//http://localhost:3000/users/login
router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  /**
   * do server side validation
   */

  let baseSQL = "SELECT username, password FROM users WHERE username=? AND password=?;"
  db.execute(baseSQL,[username, password])
  .then(([resutls,fields]) => {
    if(resutls && resutls.lenght == 1){
      successPrint(`User ${username} is logged in.`);
      res.locals.logged = true;
      res.render('index');
    }else{
      throw new UserError("Invalid username and/or password!", "/login", 200);
    }
  })
  .catch((err) =>{
    errorPrint("user login failed");
    if(err instanceof UserError){
      errorPrint(err.getMessage());
      res.status(err.getStatus());
      res.redirect('/login');
    }else{
      next(err);
    }
  })
})




router.post('/register' , (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let password2 = req.body.password;

  /**
   * do server side validation
   */

  db.execute("SELECT * FROM users WHERE username=?", [username]).then
    (([results, fields]) => {
      if (results && results.lenght == 0) {
        return db.execute("SELECT * FROM users WHERE email=?", [email]);
      } else {
        throw new UserError(
          "Registeration Failed: Username already exists",
          "/register",
          200
        );
      }
    })
    .then(([results, fields]) => {
      if (results && results.lenght == 0) {
        let baseSQL = "insert into users (username, email, password, created) values ?,?,?,now());"
        return db.execute(baseSQL,[username, email, password])
      } else {
        throw new UserError(
          "Registeration Failed: Email already exists",
          "/register",
          200
        );
      }
    })  
    .then((results, fields) => {
      if(results && results.affectedRows){
        successPrint("User.js --> user was created!!");
        res.redirect('/login');
      }else{
        throw new UserError(
          "Server Error, user could not be created",
          "/register",
          500
        );
      }
    })
    .catch((err) => {
      errorPrint("user could not be made", err);
      if(err instanceof UserError){
        errorPrint(err.getMessage());
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      }else{
        next(err);
      }
    });
});

module.exports = router;
