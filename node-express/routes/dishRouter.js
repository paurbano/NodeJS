/*Express Router
Use application routes in the Express framework to support REST API
Use the Express Router in Express framework to support REST API
*/
const express = require('express');
const bodyParser = require('body-parser');

//declare the express router
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
// this is the entry point
dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    // this make a call that match with URI part '/dishes'
    next();
})
.get((req, res, next) => {
    res.end('Will send all the dishes to you!!');
})
.post((req, res, next) => {
    res.end('Will add the dish: '+ req.body.name + ' will include details:'+
    req.body.description);
})
//put request doesn´t make sense on this endpoint
//since put/update operation it makes over an specific object,id,record
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
//this operations must be restricted!!!
.delete((req, res, next) => {
    res.end('Deleting all /dishes');
});

// now the endpoints for a specific dish //
dishRouter.route('/:dishId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get((req, res, next) =>{
    res.end('Sending info for Dish: '+ req.params.dishId);
})
//this operation doesn´t make sense
//since a dish is always created
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+req.params.dishId);
})

.put((req, res, next) => {
    res.write('Updating the dish:'+req.params.dishId)
    res.end('Will update the dish:'+req.body.name);
})

//this operations must be restricted!!!
.delete((req, res, next) => {
    res.end('Deleting dish:'+ req.params.dishId);
});

// export the module
module.exports = dishRouter;