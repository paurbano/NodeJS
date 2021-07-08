/* Assignment : Server-side Development with NodeJS, Express and MongoDB Semana 1

*/
const express = require('express');
const bodyParser = require('body-parser');

// assignment 1 Week 2:  REST API with express, MongoDB and mongoose*/
/* import mongoose module to connect with mongoDB schemas */
const mongoose = require('mongoose');
/* import promotion model */
const Promotions = require('../models/promotions');
//declare express router
const promoRouter = express.Router();
// controlling routes with token authentication
var authenticate = require('../authenticate');
//week 4: cross-origin resourse sharing
const cors = require('./cors');

promoRouter.use(bodyParser.json());
//entry point
/**
 * 3/06/2021
 * assignment 3: task 2 restrict POST, PUT and DELETE operations only to Admin user
 * add authenticate.verifyAdmin function to methods
 */
promoRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res, next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('Promotion created:', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
//put request doesn´t make sense on this endpoint
//since put/update operation it makes over an specific object,id,record
.put(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res, next) => {
    res.statusCode = 403;
    res.end('PUT/Update operation not supported for /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res, next) =>{
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// endpoints for specific promo
/**week2: REST API with express, mongo and Mongoose */
promoRouter.route('/:promoId')
.get(cors.cors, (req,res,next) =>{
    //res.end('Sending info for promotion Id:' + req.params.promoId);
    Promotions.findById(req.params.promoId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+req.params.promoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res,next) => {
    /*
    res.write('Updating the promotion:'+req.params.promoId);
    res.end('Will update the promotion:'+req.body.name);*/
    Promotions.findByIdAndUpdate(req.params.promoId, {$set: req.body}, {new:true})
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res,next) =>{
    /*res.end('Deleting promotion: ' + req.params.promoId);*/
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;