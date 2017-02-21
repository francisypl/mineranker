const config = require('config');
const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');

var database;

if (!database) {
    MongoClient.connect(
        config.get('db.url'),
        config.get('db.config'),
        function(err, db) {
            if (err) {
                console.log(err);
            }

            database = Promise.promisifyAll(db);
        }
    );
}

module.exports = {
    getCollection() {
        return database.collection(config.get('db.default_collection'));
    }
};
