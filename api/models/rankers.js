const Promise = require('bluebird');
const db = require('../lib/db/mongo');
const _ = require('underscore');

function formatRanker(ranker) {
    ranker._id = String(ranker._id);
    return ranker;
}

module.exports = {
    validateRanker(ranker) {

    },

    /**
     * Register a single ranker.
     * @param ranker {Object} - ranker to be inserted
     * @return {Promise}
     */
    registerRanker(ranker) {
        return db.getRankerCollection().insertOne(ranker)
            .then(function(data) {
                return Promise.resolve(data.insertedCount);
            });
    },

    /**
     * Finds all ranker that matches query and options.
     * @param q String - return a ranker if it contains this substring
     * @return {Promise} - a list of rankers
     */
    fetchAll(q) {
        var query = {};
        var options = {};

        if (q !== '') {
            var queryRegex = new RegExp(q, 'i');
            query = {name : {$regex : queryRegex}};
        }

        options.sort = [['_id', 'desc']];

        return db.getRankerCollection().find(query, options).toArray()
            .then(function(rankers) {
                rankers = _.map(rankers, formatRanker);
                return Promise.resolve(rankers);
            });
    }
};
