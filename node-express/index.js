/*Introduction to Express
From course: Server-side Development with NodeJs, Express and MongoDB
            www.coursera.org
Implement a simple web server using Express framework
Implement a web server that serves static content
******  new commit *******
Use application routes in the Express framework to support REST API
Use the Express Router in Express framework to support REST API
*/

const express = require('express'),
        http = require('http');
const morgan = require('morgan');
// use body-parser
const bodyParser = require('body-parser') ;
//import dishes router
const dishRouter = require('./routes/dishRouter');
//import promo router
const promoRouter = require('./routes/promoRouter');
//import leader router
const leadersRoute = require('./routes/leaderRouter');

const hostname = 'localhost';
const port = 3000;
//create app
const app = express();

//added morgan to serve static files
//app.use(morgan('dev'));

//mount the router to dishes
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leadersRoute);

//use body parser in application to parse body message to and from json format
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));


//use it
app.use((req, res, next) => {
    //print the headers
    console.log(req.headers);
    // setup the response
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

const server = http.createServer(app);
server.listen(port, hostname, () =>{
    console.log(`Express Server running at http://${hostname}:${port}/`);
})
