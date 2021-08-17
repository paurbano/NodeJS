const assert = require('assert');

/**
 * four operations : insert, search, delete, update
 */


exports.insertDocument = (db, document, collection, callback) => {
    // look for the collection
    const coll = db.collection(collection);
    coll.insert(document, (err, result) =>{
        // check if there is an error
        assert.equal(err, null);
        console.log("Inserted "+ result.result.n +
                    " documents into the collection "+ collection);
        // will pass result back to callback function
        callback(result);
    });
};

exports.findDocuments = (db,  collection, callback) => {
    const coll = db.collection(collection);
    coll.find({}).toArray((err, docs) => {
        assert.equal(err, null);
        callback(docs);
    });
};

exports.removeDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    coll.deleteOne(document, (err, result) =>{
        assert.equal(err, null);
        console.log("Document removed:", document);
        // the result back through the callback function
        callback(result);
    });
};

exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection);
    coll.updateOne(document, {$set: update}, null, (err, result) =>{
        assert.equal(err, null);
        console.log("Updated the document with:", update);
        callback(result);
    });
};
