const miner = require('../models/miner');
const getObjectId = require('../lib/db/mongo').getObjectId;
const _ = require('underscore');

function getMiners(req, res) {
    let options = {};
    let filter = {};

    // If there is a query param, else it is the default
    if (_.has(req.query, 'q')) {
        options.q = req.query.q;
    }

    options.sort = [['_id', 'desc']];

    miner.fetchAll(filter, options)
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

    miner.validateMiners(newMiner)
        .then(function() {
            return miner.registerMiners(newMiner);
        })
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
    let miner_id = req.path;
    let patchedMiner = req.body;

    miner.fetchById(miner_id)
        .then(function(resultMiner) {
            fetchedMiner = resultMiner;
            return miner.updateDescription(fetchedMiner._id, patchedMiner.description);
        })
        .then(function(transformer) {
            return res.json(200, transformer(fetchedMiner));
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
