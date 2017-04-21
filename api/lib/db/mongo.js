const config = require('config');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
    /**
     * Returns the default collection.
     * @param minerId {String} - the id of the miner.
     */
    getMinerStoryCollection(minerId) {
        return database.collection(minerId);
    },

    getMinerCollection() {
        var minerCollection = database.collection(config.get('db.miner_collection'));
        minerCollection.createIndex({name:1}, {unique: true});

        return minerCollection;
    },

    getRankerCollection() {
        var rankerCollection = database.collection(config.get('db.ranker_collection'));
        rankerCollection.createIndex({name:1}, {unique: true});
        return rankerCollection;
    },

    /**
     * Gets the Mongo Object Id with a id string.
     * @param idStr {String} - the id String
     * @return {Object} if idStr is a valid id or {null}
     */
    getObjectId(idStr) {
        // If it is a valid mongo object id
        if (ObjectID.isValid(idStr)) {
            return new ObjectID(idStr);
        }

        return null;
    }
};
