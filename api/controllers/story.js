const story = require('../models/story');
const getObjectId = require('../lib/db/mongo').getObjectId;
const miner = require('../models/miner');
const ranker = require('../models/rankers');
const Promise = require('bluebird');
const _ = require('underscore');

function getStories(req, res) {
    let miners = req.query.miners.split(',');
    let rankers = req.query.rankers.split(',');


    let invalidIds = [];
    _.each(miners.concat(rankers), idStr => {
        if (_.isNull(getObjectId(idStr))) {
            invalidIds.push(idStr);
        }
    });
    if (!_.isEmpty(invalidIds)) {
        return res.json(400, {message: `${invalidIds.join()} are invalid ids`});
    }

    let richMiners, richRankers;
    // Fetch all miners, make sure they are registered
    Promise.all(_.map(miners, miner.fetchById))
        .then(function(result) {
            richMiners = result;
            // Fetch all rankers, make sure they are registered
            return Promise.all(_.map(rankers, ranker.fetchById));
        })
        .then(function(result) {
            richRankers = result;
            // Get stories from the miners
            return Promise.all(_.map(richMiners, miner => {
                return story.fetchMinerStories(miner._id);
            }));
        })
        .then(function(stories) {
            // Rank the stories and return them
            return res.json(200, ranker.rankStories(stories, richRankers));
        })
        .catch(function(err) {
            return res.json(400, {message: `Error: ${err}`});
        });
}

module.exports = {
    getStories
};
