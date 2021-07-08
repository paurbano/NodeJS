const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**this allow to use the currency data type in schema */
//load mongoose currency module into mongoose instance
require('mongoose-currency').loadType(mongoose);
// 'create' the currency type
const Currency = mongoose.Types.Currency;

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
    author: [{
        // modified for mongoose population
        /*type: String,
        required: true*/
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
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
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        // here we make use of Currency data type created above
        type: Currency,
        required: true,
        min: 0
    },
    feature: {
        type: Boolean,
        default: false
    },
    //allow to document, add several subdocuments
    //similar to master-detail model in ERM
    comments: [ commentSchema ]
},
// add automatically two fields to the document by mongo when create it, 
// created and updated, 
// and updated automatically when modifi document
{
    timestamps : true
});

var Dishes = mongoose.model('Dishes', dishSchema);

module.exports = Dishes;