const ranker = require('../models/rankers');
const _ = require('underscore');

function getRankers(req, res) {
    let options = {};
    let query = {};

    // If there is a query param, else it is the empty
    if (_.has(req.query, 'q')) {
        var queryRegex = new RegExp(req.query.q, 'i');
        query = {name : {$regex : queryRegex}};
    }

    options.sort = [['_id', 'desc']];

    ranker.fetchAll(query, options)
        .then(function(rankers) {
            return res.json(200, rankers);
        })
        .catch(function(err) {
            console.log(err);
            return res.json(400, 'Failed to fetch rankers');
        });
}

function registerNewRanker(req, res) {
    let newRanker = req.body;

    ranker.registerRanker(newRanker)
        .then(function(numInserted) {
            return res.json(200, {message: `Registered ${numInserted} ranker`});
        })
        .catch(function(err) {
            console.log(err);
            return res.json(400, {message: 'Failed to register ranker'});
        });
}

module.exports = {
    getRankers,
    registerNewRanker
};
