const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const url = 'mongodb://localhost:27017/conFusion'
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log('Connected correctly with server');

    Dishes.create({
        name: 'Uthapizza',
        description: 'a pizza'
    })
    .then((dish) => {
        console.log(dish);
        //now use this method that find and update in one step, a particular Document
        return Dishes.findByIdAndUpdate(dish._id, {
            $set: {description: "Updated test"}
        },{
            new: true
        }).exec();
    }) // add the subdocument
    .then((dish) => {
        console.log(dish);
        dish.comments.push({
            rating:5,
            comment: "I\'m getting a sinking feeling",
            author: 'Don pica'
        });
        return dish.save();
    })
    .then((dish) => {
        console.log(dish)
        // Elimina todos los documentos de la colección Dishes
        return Dishes.remove({});
    })
    .then(() =>{
        // close conection with mongoDB
        return mongoose.connection.close();
    })
    .catch((err) => {
        // "atrapa" cualquier error que se de
        console.log(err);
    });
})
.catch((err) => {
    console.log(err);
});