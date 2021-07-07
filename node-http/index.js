/*Node and the HTTP Module
Implement a simple HTTP Server
Implement a server that returns html files from a folder
*/
const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

//setup the server
//use de http object,the createServer receive 2 parameters: 
//request: are the requeste incoming from browser
//response: are the response to the client
const server = http.createServer((req, res) =>{
    console.log("Request for:" + req.url + " by method:"+ req.method);
    //evaluate the method from request
    if (req.method == 'GET')
    {
        //evaluate the content of url from the request
        var fileUrl;
        if (req.url == '/') //if not specify an url, return index by the default
            fileUrl ='/index.html';
        else
            fileUrl = req.url;
        
        var filePath = path.resolve('./public'+fileUrl);
        const fileExt = path.extname(filePath);

        //check file extension
        if (fileExt == '.html')
        {
            fs.exists(filePath,(exists) =>{
                //callback function
                //if not exist, send a 404 error message 
                if (!exists)
                {
                    res.statusCode = 404;
                    res.setHeader('Content-Type','text/html');
                    res.end('<html><body><h1>Error 404: ' +fileUrl+ ' not found!</h1></body></html>');
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                //if file exist
                //read the file and send it out like stream of bytes to the response
                fs.createReadStream(filePath).pipe(res);
            })
        }
        else
        {
            res.statusCode = 404;
            res.setHeader('Content-Type','text/html');
            res.end('<html><body><h1>Error 404: ' + fileUrl + ' is not a html file</h1></body></html>');
        }
    }
    else
    {
        res.statusCode = 404;
        res.setHeader('Content-Type','text/html');
        res.end('<html><body><h1>Error 404: requested method:'+ req.method + ' is not supported</h1></body></html>');
    }
    
})
//start the sever to listen request
server.listen(port, hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}/`);
});
