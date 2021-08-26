const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
},{
        timestamps: true
});

// define the schema
const dishSchema = new Schema({
    // define fields of document
    name: {
        type: String,
        required: true,
        unique: true
    },
    description :{
        type: String,
        required: true
    },
    //allow to document, add several subdocuments
    //similar to 1 to many realtionship in ERM
    comments: [ commentSchema ]
},
// add automatically two fields to the document by mongo when create it, 
// created and updated, 
// and updated automatically when modify document
{
    timestamps : true
});

var Dishes = mongoose.model('Dishes', dishSchema);

module.exports = Dishes;