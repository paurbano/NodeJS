/** week 4
 * Assignment 4: Backend as a Service
 */
const express = require('express');
const bodyParser = require('body-parser');

/* import favorite model */
const Favorites = require('../models/favorite');
// controlling routes with token authentication
var authenticate = require('../authenticate');
// cross-origin resourse sharing
const cors = require('./cors');

//declare express router
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

// entry point
/**
 * Assignment 4 task 2.1:
 * When the user does a GET operation on '/favorites', 
 * will populate the user information and the dishes information before returning
 * the favorites to the user.
 */
favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
/**
 * task 2.2: When the user does a POST operation on '/favorites' by including 
 * [{"_id":"dish ObjectId"}, . . .,  {"_id":"dish ObjectId"}] in the body 
 * of the message, you will:
 * (a) create a favorite document if such a document corresponding to this user
 * does not already exist in the system,
 * (b) add the dishes specified in the body of the message to the list of favorite
 * dishes for the user, if the dishes do not already exists in the list of favorites
 */
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites)=>{
        /** favorite document already exist */
        if (favorites)
        {
            // case to add a bounch of dishes, send it like array on the body message
            for (let i =0; i < req.body.length; i++)
            {
                //2.b if the dishes do not already exists in the list of favorites,
                // add the dish to favorite list
                if (!favorites.dishes.includes(req.body[i]._id))
                    favorites.dishes.push(req.body[i]._id);
            }
            favorites.save()
            .then((favorites) => {
                console.log('Favorite Dish added:');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err));
        }
        else /**2.a if not exist, create it and add favorites */
        {
            Favorites.create({user: req.user._id})
            .then((favorites) =>{
                for (let i=0; i < req.body.length; i++)
                {
                    if (!favorites.dishes.includes(req.body[i]._id))
                        favorites.dishes.push(req.body[i]._id);
                }
                favorites.save()
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }, (err) => next(err));
            })
            .catch((err) => next(err));
        }
    },(err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type','text/plain');
    res.end('PUT operation not supported on /favorites');
})
/**2.c deleting the favorite document corresponding to this user from the collection*/
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({user: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type','application/json');
    res.end('GET operation not supported on /favorites/' + req.param.dishId);
})
/** 2.d  add the specified dish to the list of the user's list of favorite dishes,
 * if the dish is not already in the list of favorite dishes.*/
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        /**user has a favorites list */
        if (favorites)
        {
            /** dish is not in favorite list */
            if (!favorites.dishes.includes(req.params.dishId))
            {
                /**add the dish to the list and save it */
                favorites.dishes.push(req.params.dishId);
                favorites.save()
                .then((favorites)=> {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorites);
                },(err) => next(err))
                .catch((err) => next(err));
            }
        }
        else
        {
            Favorites.create({user: req.user._id})
            .then((favorite) => {
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                },(err) => next(err))
                .catch((err) => next(err));
            });
        }    
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type','application/json');
    res.end('PUT operation not supported on /favorites/' + req.param.dishId);
})
/** 2.d remove the specified dish from the list of the user's list of favorite dishes.*/
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite != null && favorite.dishes.indexOf(req.params.dishId) > 0)
        {
            favorite.dishes.splice(favorite.dishes.indexOf(req.params.dishId), 1);
            favorite.save()
            .then((favorite) =>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            },(err) => next(err))
            .catch((err) => next(err));
        }
        else
        {
            res.statusCode = 404;
            res.setHeader('Content-Type','text/plain');
            res.end('Dish:' + req.params._id + 'is not in your favorites list');
        }
    }, (err) => next(err))
    .catch((err) => next(err))
});

module.exports = favoriteRouter;