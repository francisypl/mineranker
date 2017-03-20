const _ = require('underscore');
const Promise = require('bluebird');
const db = require('../lib/db/mongo');

module.exports = {
    /**
     * Make sure miners have useful info. Check url and og_image_url. Filed
     * types are checked by the Swagger validator - don't need to check those.
     * @param miners {Array} - the array of miners to be checked
     * @return {Promise}
     */
    validateMiners(miners) {
        // TODO: check to see if url and og_image_url (if exists) have content,
        // if not then set those fields to null
        return new Promise.resolve(null);
    },

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
    updateDescription(minerId, minerDescription) {
        let objectId = db.getObjectId(minerId);

        if (!objectId) {
            return Promise.reject('miner id is not a valid id string');
        }

        return db.getMinerCollection().update({_id: objectId}, {description: minerDescription})
            .then(function() {
                return Promise.resolve(updatedMiner => {
                    updatedMiner.description = minerDescription
                    return updatedMiner;
                });
            });
    }
};
