/**
 * week 4: uploading files
 */
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
//week 4: cross-origin resourse sharing
const cors = require('./cors');

const storage = multer.diskStorage({
    // determines the path where to save the uploaded file.
    destination : (req, file, cb) => {
        cb(null, 'public/images');
    },
    //function that determines the name of the uploaded file.
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    // if name of file not match with any of this extensions return error
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
    {
        return cb(new Error('You can upload only images files!!'), false);
    }
    cb(null, true);
};
// instance multer that provides several methods for generating middleware that process files uploaded in multipart/form-data format
const upload = multer({storage:storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 200;
    res.end('GET operation not supported on /imageUploaded');
})
.post(cors.corsWithOptions, authenticate.verifyUser, upload.single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUploaded');
})
//this operations must be restricted!!!
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Delete operation not supported on /imageUploaded');
});

module.exports = uploadRouter;
