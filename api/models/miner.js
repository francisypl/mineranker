const _ = require('underscore');
const Promise = require('bluebird');
const db = require('../lib/db/mongo');

module.exports = {
    /**
     * Insert miners into the database
     * @param miners {Array} - to be insertedCount
     * @return {Promise}
     */
    registerMiners(miners) {
        return db.getMinerCollection().insertMany(miners)
            .then(function(data) {
                return Promise.resolve(data.insertedCount);
            });
    },

    /**
     * Fetches a miner by its id.
     * @param minersId {String} - the string id
     * @return return {Promise}
     */
    fetchById(minersId) {
        let objId = db.getObjectId(minersId);

        if (!objId) {
            return Promise.reject('id string is not valid');
        }

        return db.getMinerCollection().find({_id: objId}).toArray()
            .then(function(fetchedMiners) {
                if (_.isEmpty(fetchedMiners)) {
                    return Promise.reject('id is not found');
                }

                return Promise.resolve(fetchedMiners[0]);
            });
    },

    /**
     * Fetches all miners in the miners collection.
     * @param filter {Object} - kv on what documents to show
     * @param options {Object} - kv on find options ex. sort, limit
     * @return {Promise}
     */
    fetchAll(filter, options) {
        return db.getMinerCollection().find(filter, options).toArray()
            .then(function(miner) {
                return Promise.resolve(miner);
            });
    },

    /**
     * Update miners' description.
     * @param minerId {String} - the miner's string id
     * @param minerDescription {String} - new description of this miner
     * @return {Promise}
     */
    updateDescription(pathchedMiner) {
        let objectId = db.getObjectId(pathchedMiner._id);

        if (!objectId) {
            return Promise.reject('miner id is not a valid id string');
        }
        console.log(pathchedMiner.description);
        return db.getMinerCollection().update({_id: objectId}, pathchedMiner)
            .then(function(updatedMiner) {
                console.log(updatedMiner);
                return Promise.resolve(updatedMiner);
            });
    }
};
