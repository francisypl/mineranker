const story = require('../models/story');
const getObjectId = require('../lib/db/mongo').getObjectId;
const miner = require('../models/miner');
const ranker = require('../models/rankers');
const Promise = require('bluebird');
const _ = require('underscore');

function getStories(req, res) {
    let miners = _.filter(req.query.miners.split(','), val => val !== '');
    let rankers = _.filter(req.query.rankers.split(','), val => val !== '');

    let pagination = req.query.pagination;
    if (!_.isNull(pagination) && !_.isUndefined(pagination)) {
        pagination = ranker.base64StrToObject(pagination);
    }

    if (_.isEmpty(miners)) {
        return res.json(400, {message: 'No miners are selected'});
    }

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

            if (_.isEmpty(rankers)) {
                return Promise.resolve([]);
            }

            // Fetch all rankers, make sure they are registered
            return Promise.all(_.map(rankers, ranker.fetchById));
        })
        .then(function(result) {
            richRankers = result;
            // Get stories from the miners
            return Promise.all(_.map(richMiners, miner => {
                if (!_.isNull(pagination) && _.has(pagination, miner._id)) {
                    return story.fetchMinerStories(miner._id, pagination[miner._id]);
                }

                return story.fetchMinerStories(miner._id);
            }));
        })
        .then(function(stories) {
            let mappedStories = _.map(stories, function(story, index) {
                let retObj = {};

                retObj[richMiners[index]._id] = story;

                return retObj;
            });

            let rankedStories = ranker.rankStories(mappedStories, richRankers, 30);

            return res.json(200, {
                stories: rankedStories.stories,
                pagination: rankedStories.page
            });
        })
        .catch(function(err) {
            return res.json(400, {message: `Error: ${err}`});
        });
}

module.exports = {
    getStories
};
