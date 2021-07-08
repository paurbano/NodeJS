/*Express Router
Use application routes in the Express framework to support REST API
Use the Express Router in Express framework to support REST API
*/
const express = require('express');
const bodyParser = require('body-parser');
/**now import mongoose module to connect with mongo schemas */
const mongoose = require('mongoose');

/* import models */
const Dishes = require('../models/dishes');

//declare the express router
const dishRouter = express.Router();

//Controlling Routes with Authentication passport token
var authenticate = require('../authenticate');

//week 4: cross-origin resourse sharing
const cors = require('./cors');

dishRouter.use(bodyParser.json());
// this is the entry point
dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Dishes.find({})
    // added for moongose population
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
/**
 * 3/06/2021
 * assignment 3: task 2 restrict POST, PUT and DELETE operations only to Admin user
 * add authenticate.verifyAdmin function to methods
 */
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.create(req.body)
    .then((dish) =>{
        console.log('Dish Created', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
//put request doesn´t make sense on this endpoint
//since put/update operation it makes over an specific object,id,record
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
//this operations must be restricted!!!
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// now the endpoints for a specific dish //
dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); })
.get(cors.cors, (req, res, next) =>{
    Dishes.findById(req.params.dishId)
    // added for moongose population
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
//this operation doesn´t make sense
//since a dish is always created
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+req.params.dishId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {$set: req.body}, {new: true})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
//this operations must be restricted!!!
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

/*part II REST API with Express, MongoDB and Mongoose 
 define endpoints for handle comments inside a dish
*/
dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    // added for moongose population
    .populate('comments.author')
    .then((dish) => {
        if (dish != null)
        {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else
        {
            err = new Error('Dish ' + req.params.dishId + ' not Found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        // dish exists
        if (dish != null)
        {
            // added for moongose population
            // author field stores de Id of the user
            req.body.author = req.user._id;
            // add new comments, save it and
            // back to the user the dish updated
            dish.comments.push(req.body);
            dish.save()
            .then((dish) =>{
                // added for moongose population
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                })
                
            }, (err) => next(err));
        }
        else
        {
            err = new Error('Dish ' + req.params.dishId + ' not Found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
//put request doesn´t make sense on this endpoint
//since put/update operation it makes over an specific object,id,record
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments');
})
//this operations must be restricted!!!
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null)
        {
            // delete all comments and
            // back to the user the dish updated
            // there is not a direct method to do this task
            // so it must be done one by one
            for (var i =(dish.comments.length -1); i >=0; i--)    
            {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish) =>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }
        else
        {
            err = new Error('Dish ' + req.params.dishId + ' not Found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

// now the endpoints for a specific dish //
dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); })
.get(cors.cors, (req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        //validate if dish exists and has comments
        if (dish != null && dish.comments.id(req.params.commentId) != null)
        {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            //return specific comment
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) //dish not exist
        {
            err = new Error('Dish ' + req.params.dishId + ' not Found');
            err.status = 404;
            return next(err);
        }
        else //dish exist, but comment does not exist
        {
            err = new Error('Comment ' + req.params.commentId + ' not Found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
//this operation doesn´t make sense
//since a dish is always created
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+req.params.dishId+'/comments/'+req.params.commentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {

        //validate if dish exists and has comments
        if (dish != null && dish.comments.id(req.params.commentId) != null)
        {
            /**
             * week 3: assignment 3 task 4
             */
            if (!dish.comments.id(req.params.commentId).author)
            {
                var err = new Error('You\'re not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            //A way for update a subdocument inside a document in mongoose
            //only update the specific fileds, in this case: rating and comment
            /* search if there is another way or method */
            if (req.body.rating)
            {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment)
            {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .then((dish) =>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            }, (err) => next(err));
        }
        else if (dish == null) //dish not exist
        {
            err = new Error('Dish ' + req.params.dishId + ' not Found');
            err.status = 404;
            return next(err);
        }
        else //dish exist, but comment does not exist
        {
            err = new Error('Comment ' + req.params.commentId + ' not Found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
//this operations must be restricted!!!
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        //validate if dish exists and has comments
        if (dish != null && dish.comments.id(req.params.commentId) != null)
        {
            /**
             * week 3: assignment 3 task 4
             */
            if (!dish.comments.id(req.params.commentId).author)
            {
                var err = new Error('You\'re not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            //delete a particular comment
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) =>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            }, (err) => next(err));
        }
        else if (dish == null) //dish not exist
        {
            err = new Error('Dish ' + req.params.dishId + ' not Found');
            err.status = 404;
            return next(err);
        }
        else //dish exist, but comment does not exist
        {
            err = new Error('Comment ' + req.params.commentId + ' not Found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


// export the module
module.exports = dishRouter;