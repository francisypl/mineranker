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
    const stories = req.body;
    const minerId = req.swagger.params.miner_id.value;
    let resMiner;

    miner.fetchById(minerId)
        .then(function(resultMiner) {
            resMiner = resultMiner;
            return story.validateStories(stories);
        })
        .then(function() {
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
    let fetchedStory;
    let {story_id, upvote} = req.query;
    upvote = upvote.toLowerCase() === 'true';

    story.fetchById(story_id)
        .then(function(resultStory) {
            fetchedStory = resultStory;
            return story.voteOnStory(fetchedStory._id, upvote);
        })
        .then(function(transformer) {
            return res.json(200, transformer(fetchedStory));
        })
        .catch(function(err) {
            console.log(err);
            return res.json(400, {message: 'Failed to vote on story'});
        });
}

module.exports = {
    getMiners,
    registerNewMiners,
    modifyMinerDescription,
    insertNewStories,
    voteOnStory
};
