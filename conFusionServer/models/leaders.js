//import mongoose module
const mongoose = require('mongoose');
//define a schema context
const Schema = mongoose.Schema;


//define the model
const leadersSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        default: ''
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    featured: Boolean
}, 
{
    timestamps: true
});

// create the model
var Leaders = mongoose.model('Leaders', leadersSchema);
//export model
module.exports = Leaders;
