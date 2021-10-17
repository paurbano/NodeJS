/** week 3: basic authentication, use express sessions
 *  part 2
 */
//import mongoose module
const mongoose = require('mongoose');
//define a schema context
const Schema = mongoose.Schema;
// Authentication with passport
// automaticaly add username and password fields to user model 
// and encrypt password value
var passportlocalMongoose = require('passport-local-mongoose');

//define the model
var User = new Schema({
    /* comment for authentication with passport, 
    added automaticaly by passport-local-mongoose

    username : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    */
   //week 3: added for Mongoose population
    firstname: {
        type: String,
        default: ''
    },
    lastname: {   
        type: String,
        default: ''
    }, // end mongoose population
    // week4 : OAuth with facebook
    facebookId: String,
    // end
    admin: {
        type: Boolean,
        default: false
    }
});
//this is what add the username, password hashed and 
//additional methods to the user schema for passport authentication
User.plugin(passportlocalMongoose);

// export model
module.exports = mongoose.model('User', User);