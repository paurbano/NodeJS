/* Assignment : Server-side Development with NodeJS, Express and MongoDB Semana 1

*/
const express = require('express');
const bodyParser = require('body-parser');
const leaderRoute = express.Router();

leaderRoute.use(bodyParser.json());

leaderRoute.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Sending info of leaders');
})
.post((req,res, next) => {
    res.end('Adding leader :' +req.body.name + ' description:' + req.body.description);
})
.put((req,res, next) => {
    res.statusCode = 403;
    res.end('PUT/Update operation not supported for /leaders');
})
.delete((req,res, next) =>{
    res.end('Deleting all leaders');
});

// endpoints for a specific /:leaderId
leaderRoute.route('/:leaderId')
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader('Content-type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Sending info for leader Id:' + req.params.leaderId);
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+req.params.leaderId);
})
.put((req,res,next) => {
    res.write('Updating the leader:'+req.params.leaderId);
    res.end('Will update the leader:'+req.body.name);
})
.delete((req,res,next) =>{
    res.end('Deleting leader: ' + req.params.leaderId);
});

module.exports = leaderRoute;
