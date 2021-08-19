/**
 * avoid callback hell, make use of promises
 * https://coursera.org/share/905db763c93e884f5f791778bf205483
 */
const assert = require('assert');

exports.insertDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    // remove callback, since now use promise
    // return the promise
    return coll.insert(document);
};

// the same for other operations
exports.findDocuments = (db,  collection, callback) => {
    const coll = db.collection(collection);
    return coll.find({}).toArray();
};

exports.removeDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    return coll.deleteOne(document);
};

exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection);
    return coll.updateOne(document, {$set: update}, null);
};
