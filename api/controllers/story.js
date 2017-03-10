const story = require('../models/story');
const getObjectId = require('../lib/db/mongo').getObjectId;
const config = require('config');
const _ = require('underscore');

function getStories(req, res) {
    let options = {};
    let filter = {};

    // If there is a query param named limit, else it is the default limit
    if (_.has(req.query, 'limit')) {
        options.limit = parseInt(req.query.limit);
    }
    else {
        options.limit = config.get('story.fetchLimit');
    }

    // If there is an offset query param, find all stories before it
    if (_.has(req.query, 'offset')) {
        let offsetId = getObjectId(req.query.offset);
        if (offsetId) {
            filter = {
                _id: {
                    '$lt': offsetId
                }
            };
        }
    }

    options.sort = [['_id', 'desc']];

    story.fetchAll(filter, options)
        .then(function(stories) {
            return res.json(200, stories);
        })
        .catch(function(err) {
            console.log(err);
            return res.json(400, 'Failed to fetch stories');
        });
}

function insertNewStories(req, res) {
    let stories = req.body;

    story.validateStories(stories)
        .then(function() {
            return story.insertStories(stories);
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
    getStories,
    insertNewStories,
    voteOnStory
};
