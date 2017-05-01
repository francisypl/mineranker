const Promise = require('bluebird');
const db = require('../lib/db/mongo');
const _ = require('underscore');

function formatRanker(ranker) {
    ranker._id = String(ranker._id);
    return ranker;
}

function runOperator(operator, value, conditionVal) {
    const operatorFns = {
        gt: (val1, val2) => val1 > val2,
        gte: (val1, val2) => val1 >= val2,
        lt: (val1, val2) => val1 < val2,
        lte: (val1, val2) => val1 <= val2,
        number_contains: (val1, val2) => false,
        string_contains: (val1, val2) => val1.includes(val2),
        boolean_contains: (val1, val2) => false,
        object_contains: (val1,val2) => _.contains(_.keys(val1), val2),
        eq: (val1, val2) => _.isEqual(val1, val2)
    };

    let typedOperator = (typeof value).toLowerCase() + '_' + operator;
    if (_.has(operatorFns, typedOperator)) {
        return operatorFns[typedOperator](value, conditionVal);
    }
    else {
        return operatorFns[operator](value, conditionVal);
    }
}

/**
 * Evaluate a value against a condition object.
 * @param condition - the condition object
 * @param value - the value
 * @return Boolean - true if the value satisfies the condition else false
 */
function evaluateValue(condition, value) {
    const conditions = _.keys(condition);
    const validConditions = ['gt', 'gte', 'lt', 'lte', 'contains', 'eq'];

    let isPassing = true;

    _.each(validConditions, function(validCondition) {
        if (isPassing && _.contains(conditions, validCondition)) {
            let conditionVal = condition.gt;
            isPassing = typeof compareVal === typeof value &&
                        runOperator(validCondition, value, conditionVal);
        }
    });

    return isPassing;
}

module.exports = {
    isValidRanker(ranker) {
        const sampleRanker = {
            filter: {
                a_key: {
                    gt: 50
                },
                b_key: {
                    gte: 50
                },
                c_key: {
                    lt: 50
                },
                d_key: {
                    lte: 50
                },
                e_key: {
                    contains: 'some string'
                },
                f_key: {
                    eq: 'asdf'
                },
                g_key: {
                    eq: 100
                }
            },
            sort: {
                a_key: 'asc',
                b_key: 'desc'
            }
        };
    },

    /**
     * Register a single ranker.
     * @param ranker {Object} - ranker to be inserted
     * @return {Promise}
     */
    registerRanker(ranker) {
        return db.getRankerCollection().insertOne(ranker)
            .then(function(data) {
                return Promise.resolve(data.insertedCount);
            });
    },

    /**
     * Fetches a ranker by its id.
     * @param rankerId {String} - the string id
     * @return {Promise}
     */
    fetchById(rankerId) {
        let objId = db.getObjectId(rankerId);

        if (!objId) {
            return Promise.reject('id string is not valid');
        }

        return db.getRankerCollection().find({_id: objId}).toArray()
            .then(function(fetchedRankers) {
                if (_.isEmpty(fetchedRankers)) {
                    return Promise.reject(`Ranker ${rankerId} is not found`);
                }

                return Promise.resolve(formatRanker(fetchedRankers[0]));
            });
    },

    /**
     * Finds all ranker that matches query and options.
     * @param q String - return a ranker if it contains this substring
     * @return {Promise} - a list of rankers
     */
    fetchAll(q) {
        var query = {};
        var options = {};

        if (q !== '') {
            var queryRegex = new RegExp(q, 'i');
            query = {name : {$regex : queryRegex}};
        }

        options.sort = [['_id', 'desc']];

        return db.getRankerCollection().find(query, options).toArray()
            .then(function(rankers) {
                rankers = _.map(rankers, formatRanker);
                return Promise.resolve(rankers);
            });
    },

    /**
     * Filter then sort stories based on the rankers.
     * Filter Algorithm:
     * - we match the filter object's keys to each story object's keys
     * - if we don't find a key match, the story is kept
     * - if we find a key match, and the condition passes, the story is kept
     * - if we find a key match, and the condition fails, the story is disposed
     *
     * Sort Algorithm:
     * - for now put the stories in random order
     * TODO: how to sort?
     *
     * @param stories - a 2d array of stories
     * @param rankers - an array of rankers
     * @return an array of stories that
     */
    rankStories(stories, rankers) {
        let storyList = _.flatten(stories);
        let filters = _.map(rankers, ranker => ranker.filter);
        let filterKeys = _.keys(filters);
        // let sorts = _.map(rankers, ranker => ranker.sort);

        let filteredStories = [];
        _.each(storyList, story => {
            let storyKeys = _.keys(story);
            let extraKeys = [];
            if (_.has(story, 'extra')) {
                extraKeys = _.keys(story.extra);
            }

            let isPassing = true;

            // If the story has all the of filter keys
            let hasAllKeys = _.isEmpty(_.without(filterKeys, ...(storyKeys.concat(extraKeys))));
            if (hasAllKeys) {
                // for each filter key, evaluate the condition against the story's value
                _.each(filterKeys, filterKey => {
                    // if is the key is found on the story's first level
                    if (_.contains(storyKeys, filterKey)) {
                        let condition = filters[filterKey];
                        let value = story[filterKey];
                        // if one condition fails, we don't add the story
                        if (!evaluateValue(condition, value)) {
                            isPassing = false;
                        }
                    }
                    // it is in story.extra
                    else if (_.contains(extraKeys, filterKey)) {
                        let condition = filters[filterKey];
                        let value = story.extra[filterKey];
                        // if one condition fails, we don't add the story
                        if (!evaluateValue(condition, value)) {
                            isPassing = false;
                        }
                    }
                    else {
                        console.log('/models/ranker.js: Should be unreachable');
                    }
                });
            }

            if (isPassing) {
                filteredStories.push(story);
            }
        });
    }
};
