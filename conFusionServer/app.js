var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// express sessions
var session = require('express-session');
var FileStore = require('session-file-store')(session);
//authentication with passport
var passport = require('passport');
var authenticate = require('./authenticate');
// passport token
var config =  require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishesRouter = require('./routes/dishRouter');
var promotionRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
// week 4: uploading file
var uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');

const Dishes = require('./models/dishes');
//const url = 'mongodb://localhost:27017/conFusion';
const url = config.mongoUrl;
const connect = mongoose.connect(url);

// this variable is what create the app and make all works
var app = express();

connect.then((db) => {
  console.log('Connected to Server');
}, (err) => {console.log(err); });

// week 4: https
// secure traffic only
app.all('*', (req,res,next) => {
  if (req.secure)
  {
    return next();
  }
  else
  {
    res.redirect(307, 'https://'+  req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/** week 3: Basic Authentication
 supply a key to sign the cookie send it to the client
*/
//app.use(cookieParser('12345-67890-54321'));

// now use session instead of cookies
app.use(session({
  name: 'session-id',
  secret: '12345-67890-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

/** week 3: Basic Authentication
* everything come from this point,include All middleware that is mounted 
* must require an authorization
* used for cookies and sessions hands-on, commented for token passport
function auth (req, res, next)
{
  //console.log(req.headers);
  //console.log(req.signedCookies);
  console.log(req.session);

  //if the incoming request does not include the user in the cookie
  // that means that the user has not been authorized yet
  // so make to authenticate
  //if (!req.signedCookies.user)
  if (!req.user)
  {
    //read Authorization header from request
    //var authHeader = req.headers.authorization;
      var err = new Error('You are no authenticated');
      err.status = 403;
      return next(err);  
  }
  else
  {
    next();
  }

}
app.use(auth);
*/

//this call is what enables us to serve static data from the public folder
app.use(express.static(path.join(__dirname, 'public')));

/* move this before auth to allow user access to index file
app.use('/', indexRouter);
app.use('/users', usersRouter);
*/
app.use('/dishes', dishesRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);
//week 4: uploading files
app.use('/imageUpload', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
