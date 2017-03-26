const miner = require('../models/miner');
const _ = require('underscore');

function getMiners(req, res) {
    let options = {};
    let query = {};

    // If there is a query param, else it is the empty
    if (_.has(req.query, 'q')) {
        query = {name : req.query.q};
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

module.exports = {
    getMiners,
    registerNewMiners,
    modifyMinerDescription
};
