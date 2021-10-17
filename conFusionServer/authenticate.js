/* authentication passport
use this file to store authentication strategies
*/
// to authenticate users via username and password
// https://www.passportjs.org/docs/username-password/
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');
/**
 * for passport and JSON web token
 */
//set the strategies for authenticating with a JSON Web Token
//https://github.com/mikenicholson/passport-jwt
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign and verify tokens
/**
 * week 4: OAuth with facebook
 * define a new strategy (facebook) 
 */
var FacebookTokenStrategy = require('passport-facebook-token');

var config =  require('./config.js');

// this is where passport libraries help
// here is where incoming request verify user with local strategy
// extract username and password from request inside body messagge
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//also if still use sessions on application, passport support it
//by using sessions must serialize and deserialize user info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey,{expiresIn: 3600});
};
//reads the JWT from the http Authorization header with the scheme 'bearer'
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(
    opts, (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id:jwt_payload._id}, (err, user) =>{
            if (err)
            {
                return done(err, false);
            }
            else if (user)
            {
                return done(null, user);
            }
            else
            {
                return done(null, false);
            }
        });
    }
));
//
exports.verifyUser = passport.authenticate('jwt', {session:false});
/**
 * week 3: Assignment 3
 * task 1: function that determine if user is admin 
 */
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin)
        next();
    else
    {
        var err = new Error('You\'re not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
};

/**
 * week 4: Oauth authentication
 */
exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    //search if user has a previous register with facebook
    //the profile variable is send by facebook accces
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        // user exists with that particular facebookID
        if (!err && user !== null) {
            return done(null, user);
        }
        // if not exist, create it
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));
