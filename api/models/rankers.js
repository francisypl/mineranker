const Promise = require('bluebird');
let db = null;
const _ = require('underscore');

/**
 * Initialize the database to the mongo database.
 */
function initDb() {
    db = require('../lib/db/mongo');
}

function formatRanker(ranker) {
    ranker._id = String(ranker._id);
    return ranker;
}

function tobase64Str(obj) {
    return (new Buffer(JSON.stringify(obj))).toString('base64');
}

class StoriesIterator {
    constructor(stories) {
        this.stories = stories;
        this.numStories = _.reduce(stories, (memo, storyObjArr) => memo + _.values(_.values(storyObjArr)[0]).length, 0);
        this.visitedIndex = {};
        this.minerIds = _.map(stories, story => _.keys(story)[0]);
        _.each(this.minerIds, minerId => {
            this.visitedIndex[minerId] = 0;
        });
        this.visit = 0;
    }

    allVisited() {
        let visited = _.reduce(_.values(this.visitedIndex), (memo, num) => memo + num, 0);
        return visited >= this.numStories;
    }

    getNextStory() {
        let minerId = this.minerIds[this.visit];
        let storiesArr = this.stories[this.visit][minerId];

        // If all stories are visited
        if (this.allVisited()) {
            return null;
        }

        while (this.visitedIndex[minerId] === storiesArr.length) {
            this.visit = (this.visit + 1) % this.minerIds.length;
            minerId = this.minerIds[this.visit];
            storiesArr = this.stories[this.visit][minerId];
        }

        let getIndex = this.visitedIndex[minerId]++;

        this.visit = (this.visit + 1) % this.minerIds.length;

        return storiesArr[getIndex];
    }

    getPaginationObject() {
        let pageObj = {};

        _.each(this.minerIds, (id, index) => {
            let lastVisitedStoryIndex = this.visitedIndex[id] - 1;
            if (lastVisitedStoryIndex < 0) {
                lastVisitedStoryIndex = 0;
            }

            pageObj[id] = this.stories[index][id][lastVisitedStoryIndex]._id;
        });

        return pageObj;
    }
}

/**
 * Runs the operator agains the condition's vaule and the actual value.
 * @param value Any - the actual value to be compared
 * @param operator String - a string to indicate the operation eg. "gt", "lt"
 * @param conditionVal Any - the value to be compared against
 * @return boolean
 * eg. parameters read like: <value> must be <operator> <conditionalVal>
 *                               4   must be    gt        2
 */
function runOperator(value, operator, conditionVal) {
    const operatorFns = {
        gt: (val1, val2) => val1 > val2,
        object_gt: (val1, val2) => false,
        gte: (val1, val2) => val1 >= val2,
        object_gte: (val1, val2) => false,
        lt: (val1, val2) => val1 < val2,
        object_lt: (val1, val2) => false,
        lte: (val1, val2) => val1 <= val2,
        object_lte: (val1, val2) => false,
        number_contains: (val1, val2) => false,
        string_contains: (val1, val2) => {
            if (val1 === '' && val2 === '') {
                return true;
            }
            else if (val1 === '' || val2 === '') {
                return false;
            }

            return val1.includes(val2);
        },
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
 * Join an array of objects together to form one object.
 * @param objArr [Array] - an array of object_contains
 * @return a single object
 */
function joinObjects(objArr) {
    let retObj = {};

    _.each(objArr, obj => {
        _.each(_.keys(obj), key => {
            retObj[key] = obj[key];
        });
    });

    return retObj;
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
            let conditionVal = condition[validCondition];

            if (typeof conditionVal === typeof value) {
                isPassing = runOperator(value, validCondition, conditionVal);
            }
            else if (validCondition === 'contains' && (_.isObject(value) || _.isString(conditionVal))) {
                isPassing = runOperator(value, validCondition, conditionVal);
            }
            else {
                isPassing = false;
            }
        }
    });

    return isPassing;
}

module.exports = {
    /**
     * Set a new database for dependency injection.
     * @param newdb - a new database to use
     */
    setDb(newdb) {
        db = newdb;
    },

    /**
     * Register a single ranker.
     * @param ranker {Object} - ranker to be inserted
     * @return {Promise}
     */
    registerRanker(ranker) {
        if (_.isNull(db)) {
            initDb();
        }

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
        if (_.isNull(db)) {
            initDb();
        }

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
        if (_.isNull(db)) {
            initDb();
        }

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
     * @param stories - a array of stories object [{<miner_id>: [storylist]}, ...]
     * @param rankers - an array of rankers [{filter:{<filter_obj>}, sort:{<sort_obj>}}, ...]
     * @return {stories: [story1, story2, ...], page: <base64 encoded pagination obj str>}
     */
    rankStories(stories, rankers, limit) {
        // Initialize the story iterator
        const storyIterator = new StoriesIterator(stories);

        let allFilters = _.map(rankers, ranker => ranker.filter);
        // let sorts = _.map(rankers, ranker => ranker.sort);

        let filteredStories = [];
        while (filteredStories.length < limit && !storyIterator.allVisited()) {
            let story = storyIterator.getNextStory();
            let isPassing = true;

            _.each(allFilters, filters => {
                let filterKeys = _.keys(filters);

                let storyKeys = _.keys(story);
                let extraKeys = [];
                if (_.has(story, 'extra')) {
                    extraKeys = _.keys(story.extra);
                }

                // If the story has all the of filter keys
                let hasAllKeys = _.isEmpty(_.without(filterKeys, ...(storyKeys.concat(extraKeys))));
                if (hasAllKeys) {
                    // for each filter key, evaluate the condition against the story's value
                    _.each(filterKeys, filterKey => {
                        if (isPassing) {
                            // if is the key is found on the story's first level
                            if (_.contains(storyKeys, filterKey)) {
                                let condition = filters[filterKey];
                                let value = story[filterKey];
                                // if one condition fails, we don't add the story
                                isPassing = evaluateValue(condition, value);
                            }
                            // it is in story.extra
                            else if (_.contains(extraKeys, filterKey)) {
                                let condition = filters[filterKey];
                                let value = story.extra[filterKey];
                                // if one condition fails, we don't add the story
                                isPassing = evaluateValue(condition, value);
                            }
                            else {
                                console.log('/models/ranker.js: Should be unreachable');
                            }
                        }
                    });
                }
            });

            if (isPassing) {
                filteredStories.push(story);
            }
        }

        return {
            stories: _.shuffle(filteredStories),
            page: tobase64Str(JSON.stringify(storyIterator.getPaginationObject()))
        };
    }
};
module.exports._helperFns = {
    runOperator,
    evaluateValue,
    joinObjects,
    StoriesIterator,
    tobase64Str
};
