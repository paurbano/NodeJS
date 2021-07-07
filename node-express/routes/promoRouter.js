/* Assignment : Server-side Development with NodeJS, Express and MongoDB Semana 1

*/
const express = require('express');
const bodyParser = require('body-parser');

//declare express router
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());
//entry point
promoRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Sending info of all promotions');
})
.post((req,res, next) => {
    res.end('Adding promotion :' +req.body.name + ' description:' + req.body.description);
})
.put((req,res, next) => {
    res.statusCode = 403;
    res.end('PUT/UPdate operation not supported for /promotions');
})
.delete((req,res, next) =>{
    res.end('Deleting all promotions');
});

// endpoints for specific promo
promoRouter.route('/:promoId')
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader('Content-type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Sending info for promotion Id:' + req.params.promoId);
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+req.params.promoId);
})
.put((req,res,next) => {
    res.write('Updating the promotion:'+req.params.promoId);
    res.end('Will update the promotion:'+req.body.name);
})
.delete((req,res,next) =>{
    res.end('Deleting promotion: ' + req.params.promoId);
});

module.exports = promoRouter;