var express = require('express');
const bodyParser =  require('body-parser');
var router = express.Router();
//import User model
var User =  require('../models/user');
// import passport library for authenticate
var passport = require('passport');
//for JSON token
var authenticate = require('../authenticate');
//week 4: cross-origin resourse sharing
const cors = require('./cors');

// declare express router for users
router.use(bodyParser.json());

/**
 * 3/06/2021
 * assignment 3: task 3 restrict GET operation only to Admin user
 * add authenticate.verifyAdmin function to method
 */

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  //assignment 3: task 3
  User.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch((err) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({err: err});
  });
});

/**
 * week 4: Oauth authentication
 * for facebook authentication
 */
router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  //if authentication is successful user is load in request object (req)
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

/*route for signup new users
* localhost/users/signup
*/
router.post('/signup',cors.corsWithOptions,  function(req, res, next) {
  //check if the user exist
  //User.findOne({username: req.body.username})
  
  // modifications for passport
  // use passport authentication
  User.register(new User({username: req.body.username}),
    req.body.password, (err, user) => {
    //if (user != null)
    if (err)
    {
      /* 
      var err = new Error('User '+ req.body.username + ' already exist');
      err.status = 403;
      next(err);
      */
     res.statusCode = 500;
     res.setHeader('Content-Type', 'application/json');
     res.json({err: err});
    }
    else
    {
      // modifications for moongose population
      // 25/05/2021
      if (req.body.firstname && req.body.lastname)
      {
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
      }
      user.save((err, user) => {
        if (err)
        {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
      //
        passport.authenticate('local')(req,res,() => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registrarion Successful!'});
        });
      });
    }
  });
  /*
  // if the new user already is signup
  .then((user) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registrarion Successful!', user: user});
  });
  */
});

//login the user
router.post('/login',cors.corsWithOptions,  passport.authenticate('local'), (req, res) =>{
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success:true, token: token, status: 'You are successfully loggeg in!'});
});

/* version for cookies ans sessions
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  //code for authentication with passport 
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'you are successfully loggin!'});

  /* code for basic authentication
  // if user is not yet authenticated
  if (!req.session.user)
  {
    //read Authorization header from request
    var authHeader = req.headers.authorization;
    if (!authHeader)
    {
      var err = new Error('You are no authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }
    //extract user and password from Authorization header
    //these are combined in a string encoded using base64
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    //make sure that is the user that I'm looking for
    User.findOne({username: username})
    .then((user) => {
      //if don´t find any user with that name
      if (user === null) 
      {
        var err = new Error('User '+ username + 'does not exist!');
        err.status = 403;
        return next(err);
      }
      // exists but input wrong password
      else if (user.password != password)
      {
        var err = new Error('Password Incorrect!');
        err.status = 403;
        return next(err);
      } // user exist and valid password
      else if (user.username === username && user.password=== password)
      {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        res.end('You are authenticated!');
      }
    })
    .catch((err) => next(err));
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('You are already authenticated!');
  }
});
*/

//logout user
// we do with get, since we don't need to send any information
router.get('/logout', cors.corsWithOptions, (req, res) =>{
  // session exists
  if (req.session)
  {
    // session destroyed from server
    req.session.destroy();
    // delete the cookie from client side
    // provide the name of the cookie
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else
  {
    var err =  new Error('You are not logged in');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
