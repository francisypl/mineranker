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

module.exports = {
    getStories
};
