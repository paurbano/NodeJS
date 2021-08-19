const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

/** updated to fix callback hell and use promises (chained)
 * https://coursera.org/share/905db763c93e884f5f791778bf205483
 * https://www.freecodecamp.org/news/what-is-promise-in-javascript-for-beginners/
*/
MongoClient.connect(url).then((client) => {

    console.log('Connected correctly to server');
    const db = client.db(dbname);

    dboper.insertDocument(db, {name: "pataconera", description: "todo en patacones"}, 'dishes')
    // promise
    .then((result) =>{
        console.log("Insert Document:\n", result.ops);
        // return the promise
        return dboper.findDocuments(db, "dishes");
    })
    // promise
    .then((docs) => {
            console.log("Found Documents:", docs);

            return dboper.updateDocument(db, {name:"pataconera"}, {description: "patacones y mas.."}, "dishes");
    })
    // promise
    .then((result) =>{
            console.log("Updates Document:\n", result.result);

            return  dboper.findDocuments(db, "dishes");
    })
    // promise
    .then((docs) => {
            console.log("Found Documents:", docs);

            return  db.dropCollection("dishes");
    })
    .then((result) => {
            console.log("Droped Collection: ", result);

            return client.close();
    }) // catch error if some previous promise
    .catch((err) => console.log(err));
}) // catch error if the promise to mongo rejected
.catch((err) => console.log(err));
