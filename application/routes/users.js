var express = require('express');
var router = express.Router();
var db = require('../config/database');
const UserError = require('../helpers/error/UserError');
const { errorPrint, successPrint } = require('../helpers/debug/debugprinters');
var bcrypt = require('bcrypt');

router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let password2 = req.body.password;

  /**
   * do server side validation
   */

  db.execute("SELECT * FROM users WHERE username=?", [username])
    .then(([results, fields]) => {
      if (results && results.length == 0) {
        return db.execute("SELECT * FROM users WHERE email=?", [email]);
      } else {
        throw new UserError(
          "Registeration Failed: Username already exists!",
          "/register",
          200
        );
      }
    })
    .then(([results, fields]) => {
      if (results && results.length == 0) {
        return bcrypt.hash(password, 15);
      } else {
        throw new UserError(
          "Registeration Failed: Email already exists!",
          "/register",
          200
        );
      }
    })
    .then((hasedPassword) => {
      let baseSQL = "insert into users (username, email, password, created) values (?,?,?,now());"
      return db.execute(baseSQL, [username, email, hasedPassword])
    })
    .then(([results, fields]) => {
      console.log(results);
      if (results && results.affectedRows) {
        successPrint("User.js --> user was created!!");
        req.flash('success', 'Registration Successful: Account has been made!')
        res.redirect('/login');
      } else {
        throw new UserError(
          "Server Error: User could not be created!",
          "/register",
          500
        );
      }
    })
    .catch((err) => {
      errorPrint("user could not be made", err);
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', err.getMessage());
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      } else {
        next(err);
      }
    });
});



//http://localhost:3000/users/login
router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  /**
   * do server side validation
   */
  console.log(req.body);
  let baseSQL = "SELECT id, username, password FROM users WHERE username=?;"
  let userId;
  db.execute(baseSQL, [username])
    .then(([results, fields]) => {
      console.log(results);
      if (results && results.length == 1) {
        let hasedPassword = results[0].password;
        userId = results[0].id;
        return bcrypt.compare(password, hasedPassword);
      } else {
        throw new UserError("Invalid username and/or password!", "/login", 200);
      }
    })
    .then((passwordsMatched) => {
      if (passwordsMatched) {
        successPrint(`User ${username} is logged in.`);
        req.session.username = username;
        req.session.userId = userId;
        res.locals.logged = true;
        req.flash('success', 'You have successfully Logged in!');
        res.redirect("/");
      } else {
        throw new UserError("Invalid username and/or password!", "/login", 200);
      }
    })
    .catch((err) => {
      errorPrint("user login failed");
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', err.getMessage());
        res.status(err.getStatus());
        res.redirect('/login');
      } else {
        next(err);
      }
    });
});


router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if(err){
      errorPrint('session could not be destroyed.');
    }else{
      successPrint('Session was Destryoed!');
      res.clearCookie('csid');
      res.json({status: "OK", message:"user is logged out"});
    }
  })
});

module.exports = router;
