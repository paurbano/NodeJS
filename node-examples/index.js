/**
 * example of callback function
 */
var rect = require('./rectangle');

function solveRect(l,b)
{
    console.log("Solving for rectangle with l=" + l + " and b="+b);
    /*this the way to use the callback, error
    * according to prototype module (parameter1, parameter2,...parameter n, callback function(error, function))
    * you use it 
    */
    rect(l,b, (err,rectangle) => {
        
        if (err)
            console.log("ERROR:" + err.message);
        else
        {
            console.log("The rectangle area with dimensions l=" + l + " and b=" + b +" is" + rectangle.area());
            console.log("The rectangle perimeter with dimensions l=" + l + " and b=" + b +" is" + rectangle.perimeter());
        }
    });
    console.log("This statement after the call to rect()");   
}

solveRect(2,4);
solveRect(5,3);
solveRect(0,2);
solveRect(-3,4);
