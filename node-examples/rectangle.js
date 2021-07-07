/*Using Callbacks and Error Handling*/
//how to use callbacks callback(Error, function)
module.exports = (x,y, callback) => {
    if(x <= 0 || y <= 0)
    {
        //simulate a process that take sometime
        setTimeout(() =>
        callback(new Error("Rectangle dimensions should be greater than zero: l=" + x
        +" and b=" + y), null), 2000);
    }
    else
    {
        //simulate a process that take sometime
        setTimeout(() => callback(null, {
            perimeter: () => (2*(x,y)),
            area: () => (x*y)
            }), 
            2000);
    }
}
