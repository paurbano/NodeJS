//import mongoose module
const mongoose = require('mongoose');
//define a schema context
const Schema = mongoose.Schema;
//make use of currency middleware
require('mongoose-currency').loadType(mongoose);
// 'create' the currency type
const Currency = mongoose.Types.Currency;

//define the promotions schema
const promotionsSchema = new Schema ({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        unique: true
    },
    label:{
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    featured: Boolean
},
{
    timestamps : true
});

//create the model
var Promotions = mongoose.model('Promotions', promotionsSchema);
//export the model
module.exports = Promotions;
