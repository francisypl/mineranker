const ranker = require('../models/rankers');
const _ = require('underscore');

function getRankers(req, res) {
    var query = '';
    // If there is a query param, else it is the empty
    if (_.has(req.query, 'q')) {
        query = req.query.q;
    }

    ranker.fetchAll(query)
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

function getRankerById(req, res) {
    const ranker_id = req.swagger.params.ranker_id.value;

    ranker.fetchById(ranker_id)
        .then(function(resultRanker) {
            return res.json(200, resultRanker);
        })
        .catch(function(err) {
            console.log(err);
            return res.json(400, {message: `ranker with id ${ranker_id} is not found`});
        });
}

module.exports = {
    getRankers,
    registerNewRanker,
    getRankerById
};
