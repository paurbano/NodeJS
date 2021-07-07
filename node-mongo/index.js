const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

/** updated to fix callback hell and use promises */
MongoClient.connect(url).then((client) => {

    console.log('Connected correctly to server');
    const db = client.db(dbname);

    dboper.insertDocument(db, {name: "pataconera", description: "todo en patacones"}, 'dishes')
    .then((result) =>{
        console.log("Insert Document:\n", result.ops);

        return dboper.findDocuments(db, "dishes");
    })
    .then((docs) => {
            console.log("Found Documents:", docs);

            return dboper.updateDocument(db, {name:"pataconera"}, 
                        {description: "patacones y mas.."}, "dishes");
    })
    .then((result) =>{
            console.log("Updates Document:\n", result.result);

            return  dboper.findDocuments(db, "dishes");
    })
    .then((docs) => {
            console.log("Found Documents:", docs);

            return  db.dropCollection("dishes");
    })
    .then((result) => {
            console.log("Droped Collection: ", result);

            return client.close();
    })
    .catch((err) => console.log(err));
})
.catch((err) => console.log(err));