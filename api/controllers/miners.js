const miner = require('../models/miner');
const story = require('../models/story');
const _ = require('underscore');

function getMiners(req, res) {
    let options = {};
    let query = {};

    // If there is a query param, else it is the empty
    if (_.has(req.query, 'q')) {
        var queryRegex = new RegExp(req.query.q, 'i');
        query = {name : {$regex : queryRegex}};
    }

    options.sort = [['_id', 'desc']];

    miner.fetchAll(query, options)
        .then(function(miners) {
            return res.json(200, miners);
        })
        .catch(function(err) {
            console.log(err);
            return res.json(400, 'Failed to fetch miners');
        });
}

function registerNewMiners(req, res) {
    let newMiner = req.body;

    miner.registerMiners(newMiner)
        .then(function(numInserted) {
            return res.json(200, {message: `Registered ${numInserted} miners`});
        })
        .catch(function(err) {
            console.log(err);
            return res.json(400, {message: 'Failed to register miners'});
        });
}

function modifyMinerDescription(req, res) {
    let fetchedMiner;
    let miner_id = req.swagger.params.miner_id.value;
    let patchedMiner = req.body;

    miner.fetchById(miner_id)
        .then(function(resultMiner) {
            fetchedMiner = resultMiner;
            fetchedMiner.description = patchedMiner.description;
            return miner.updateDescription(fetchedMiner);
        })
        .then(function() {
            return res.json(200, fetchedMiner);
        })
        .catch(function(err) {
            console.log(err);
            return res.json(400, {message: 'Failed update miners description'});
        });
}

function insertNewStories(req, res) {
    let stories = req.body;
    const minerId = req.swagger.params.miner_id.value;
    let resMiner;

    miner.fetchById(minerId)
        .then(function(resultMiner) {
            resMiner = resultMiner;
            return story.validateStories(stories);
        })
        .then(function() {
            stories = _.map(stories, function(story) {
                story.source = resMiner.name;
                return story;
            });

            return story.insertStories(resMiner._id, stories);
        })
        .then(function(numInserted) {
            return res.json(200, {message: `Inserted ${numInserted} stories`});
        })
        .catch(function(err) {
            console.log(err);
            return res.json(400, {message: 'Failed to insert stories'});
        });
}

function voteOnStory(req, res) {
    const story_id = req.swagger.params.story_id.value;
    const miner_id = req.swagger.params.miner_id.value;

    let fetchedStory;
    let {upvote} = req.query;
    let resMiner;

    upvote = upvote.toLowerCase() === 'true';

    miner.fetchById(miner_id)
        .then(function(resultMiner) {
            resMiner = resultMiner;
            return story.fetchById(resultMiner._id, story_id);
        })
        .then(function(resultStory) {
            fetchedStory = resultStory;
            return story.voteOnStory(resMiner._id, fetchedStory._id, upvote);
        })
        .then(function(transformer) {
            return res.json(200, transformer(fetchedStory));
        })
        .catch(function(err) {
            console.log(err);
            return res.json(400, {message: 'Failed to vote on story'});
        });
}

function getMinerById(req, res) {
    const miner_id = req.swagger.params.miner_id.value;

    miner.fetchById(miner_id)
        .then(function(resultMiner) {
            return res.json(200, resultMiner);
        })
        .catch(function(err) {
            console.log(err);
            return res.json(400, {message: `Miner with id ${miner_id} is not found`});
        });
}

module.exports = {
    getMiners,
    registerNewMiners,
    modifyMinerDescription,
    insertNewStories,
    voteOnStory,
    getMinerById
};
