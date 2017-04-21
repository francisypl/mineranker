const Promise = require('bluebird');
const db = require('../lib/db/mongo');
const _ = require('underscore');

function formatRanker(ranker) {
    ranker._id = String(ranker._id);
    return ranker;
}

module.exports = {
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

    fetchAll(query, options) {
        return db.getRankerCollection().find(query, options).toArray()
            .then(function(rankers) {
                rankers = _.map(rankers, formatRanker);
                return Promise.resolve(rankers);
            });
    }
};
