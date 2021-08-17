const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

// second parameter is a callback function
MongoClient.connect(url, (err, client) => {
    // the assert function allows to perform various checks on values
    assert.equal(err,null);

    console.log('Connected correctly to server');

    const db = client.db(dbname);
    // use of the module functions from operations
    dboper.insertDocument(db, {name:'tostada con pollo', description:'test dish'}, 'dishes', (result) => { 
        // the ops tells the number of insert operations made it
        console.log('Insert document:\n', result.ops);
        // once the previous operations is completed, look for documents and print it
        dboper.findDocuments(db, 'dishes', (docs) => {
            console.log('Found documents:\n', docs);
            
            // and once show inserted documents, update the last one
            dboper.updateDocument(db,{name: 'tostada con pollo'},{description:'updated test'},'dishes', (result) =>{
                console.log('Updated Document:\n', result.result);

                // agian search for the docs and print it
                dboper.findDocuments(db, 'dishes', (docs) => {
                    console.log('Found documents:\n', docs);

                    //drop the collection, leave the database clean
                    db.dropCollection('dishes', (result) => {
                        console.log('Dropped Collections:\n', result);
                        // close connection
                        client.close();
                    });
                });
            });
        });
    });
});
