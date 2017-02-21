const story = require('../models/story');

function getStories(req, res) {

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
    let {story_id, upvote} = req.query;
    upvote = upvote.toLowerCase() === 'true';

    story.fetchById(story_id)
        .then(function(story) {
            return story.voteOnStory(story._id, upvote);
        })
        .then(function(resultStory) {
            return res.json(200, resultStory);
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
