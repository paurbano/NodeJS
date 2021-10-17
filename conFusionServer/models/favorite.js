/** week 4
 * Assignment 4: task 1
 * 
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dishes'
    }]

},{
    timestamps: true
});

module.exports = mongoose.model('Favorites', favoriteSchema);
