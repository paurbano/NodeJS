const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

/** callback nested*/

// second parameter is a callback function
MongoClient.connect(url, (err, client) => {
    // the assert function allows to perform various checks on values
    assert.equal(err,null);

    console.log('Connected correctly to server');

    const db = client.db(dbname);
    const collection = db.collection("dishes");
    // callback to insert a document
    collection.insertOne({"name": "Uthappizza", "description": "test"}, (err, result) => {
        //if the result is obtained in callback, then
        // we are able to access the collection and then perform further operations.
        assert.equal(err,null);

        console.log("After Insert:\n");
        // result will also provide this OPS property which says how many operations have just been carried out successfully.
        console.log(result.ops);
        // second callback inside the first one to find all documents in a collection
        collection.find({}).toArray((err, docs) => {
            assert.equal(err,null);
            
            console.log("Found:\n");
            // here docs will return all the documents from this collection that match whatever criteria that you specify here.
            // since this is empty return all documents
            console.log(docs);
            // third callback inside find to drop a collection in this case
            // dishes
            db.dropCollection("dishes", (err, result) => {
                assert.equal(err,null);

                client.close();
            });
        });
    });

});
