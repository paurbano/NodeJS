/* Assignment : Server-side Development with NodeJS, Express and MongoDB Semana 1

*/
const express = require('express');
const bodyParser = require('body-parser');
// assignment 1 - week2: REST API with express, MongoDB and Mongoose
/* import mongoose module to connect with mongoDB schemas */
const mongoose = require('mongoose');
/* import promotion model */
const Leaders = require('../models/leaders');
//Controlling Routes with Authentication passport token
var authenticate = require('../authenticate');
/**declare router handler */
const leaderRoute = express.Router();
//week 4: cross-origin resourse sharing
const cors = require('./cors');
/** */
leaderRoute.use(bodyParser.json());

//entry point
leaderRoute.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    //res.end('Sending info of leaders');
    Leaders.find({})
    .then((leaders) =>{
        res.statusCode = 200;
        res.setHeader('Context-Type', 'application/json');
        res.json(leaders);
    },(err) => next(err))
    .catch((err) => next(err));
})
/**
 * 3/06/2021
 * assignment 3: task 2 restrict POST, PUT and DELETE operations only to Admin user
 * add authenticate.verifyAdmin function to methods
 */
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res, next) => {
    //res.end('Adding leader :' +req.body.name + ' description:' + req.body.description);
    Leaders.create(req.body)
    .then((leader) => {
        res.statusCode = 200 ;
        res.setHeader('Context-Type','application/json');
        res.json(leader)
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res, next) => {
    res.statusCode = 403;
    res.end('PUT/Update operation not supported for /leaders');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res, next) =>{
    /*res.end('Deleting all leaders');*/
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Context-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});

// endpoints for a specific /:leaderId
leaderRoute.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, (req,res,next) =>{
    //res.end('Sending info for leader Id:' + req.params.leaderId);
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+req.params.leaderId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    /*res.write('Updating the leader:'+req.params.leaderId);
    res.end('Will update the leader:'+req.body.name);*/
    Leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body}, {new: true})
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res,next) =>{
    //res.end('Deleting leader: ' + req.params.leaderId);
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRoute;
