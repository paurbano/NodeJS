/**
 * week 4: Cross origing resource sharing
 * 
 */
const express = require('express');
const cors = require('cors');
const app = express();
//define list of sites allowed
const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
//
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    // validate if URL that request is in list, if it is set options
    if (whitelist.indexOf(req.header('Origin')) !== -1)
    {
        corsOptions = {origin: true};
    }
    else
    {
        corsOptions = {origin: false};
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
