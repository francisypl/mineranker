const _ = require('underscore');
const Promise = require('bluebird');
const db = require('../lib/db/mongo');

/**
 * Add some other fields to the story. For now upvote and downvotes.
 * @param story {Object} - the story object to enrichStory
 * @return {Object} - the enriched story
 */
function enrichStory(story) {
    story.upvote = 0;
    story.downvote = 0;

    return story;
}

module.exports = {
    /**
     * Make sure the story have useful info. Check url and og_image_url. Filed
     * types are checked by the Swagger validator - don't need to check those.
     * @param stories {Array} - the array of stories to be checked
     * @return {Promise}
     */
    validateStories(stories) {
        // TODO: check to see if url and og_image_url (if exists) have content,
        // if not then set those fields to null
        return new Promise.resolve(null);
    },

    /**
     * Insert Stories into the database
     * @param minerId {String} - the id of the miner the new story belongs to
     * @param stories {Array} - stories to be insertedCount
     * @return {Promise}
     */
    insertStories(minerId, stories) {
        let richStories = _.map(stories, enrichStory);
        return db.getMinerStoryCollection(minerId).insertMany(richStories)
            .then(function(data) {
                return Promise.resolve(data.insertedCount);
            });
    },

    /**
     * Fetches a story by its id.
     * @param mienrId {String} - the id of the miner the story belongs to
     * @param storyId {String} - the string id
     * @return return {Promise}
     */
    fetchById(minerId, storyId) {
        let objId = db.getObjectId(storyId);

        if (!objId) {
            return Promise.reject('id string is not valid');
        }

        return db.getMinerStoryCollection(minerId).find({_id: objId}).toArray()
            .then(function(fetchedStory) {
                if (_.isEmpty(fetchedStory)) {
                    return Promise.reject('id is not found');
                }

                return Promise.resolve(fetchedStory[0]);
            });
    },

    /**
     * Fetches all stories in the story collection.
     * @param miners - a list of miner ids to fetch stories from
     * @param rankers - a list of ranker ids to rank stories with
     * @param offsetId - the id of the last item fetched
     * @param limit - the number of stories to return
     * @return {Promise}
     */
    fetchAll(miners, rankers, offsetId, limit) {
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

        let filter = {};
        let options = {};

        if (!_.isNull(offsetId) && !_.isUndefined(offsetId)) {
            filter = {
                _id: {
                    '$lt': offsetId
                }
            };
        }

        options.limit = limit;
        options.sort = [['_id', 'desc']];

        return db.getCollection().find(filter, options).toArray()
            .then(function(stories) {
                return Promise.resolve(stories);
            });
    },

    /**
     * Fetch stories from a miner.
     * @param minerId - a valid id of the miner
     * @param offsetId - id of the last story, this will get stories after this
     * @param limit - the number of stories to return
     * @return a promise of stories
     */
    fetchMinerStories(minerId, offsetId = null, limit = 30) {
        let objectId = db.getObjectId(minerId);
        if (_.isNull(objectId)) {
            return Promise.reject(`Miner ${minerId} id is not valid`);
        }

        let filter = {};
        let options = {};

        if (!_.isNull(offsetId) && !_.isUndefined(offsetId) &&
            !_.isNull(db.getObjectId(offsetId))) {
            filter = {
                _id: {
                    '$lt': offsetId
                }
            };
        }

        options.limit = limit;
        options.sort = [['_id', 'desc']];

        return db.getMinerStoryCollection(minerId).find(filter, options)
            .toArray().then(function(result) {
                return Promise.resolve(result);
            });
    },

    /**
     * Upvote or Downvote on a story.
     * @param mienrId {String} - the id of the miner the story belongs to
     * @param storyId {String} - the story's string id
     * @param upvote {Boolean} - if true then upvote this story
     * @return {Promise}
     */
    voteOnStory(minerId, storyId, upvote) {
        let objectId = db.getObjectId(storyId);
        let voteObj = {
            $inc: null
        };

        if (!objectId) {
            return Promise.reject('story id is not a valid id string');
        }

        if (upvote) {
            voteObj.$inc = {
                upvote: 1
            };
        }
        else {
            voteObj.$inc = {
                downvote: 1
            };
        }

        return db.getMinerStoryCollection(minerId)
            .update({_id: objectId}, voteObj)
            .then(function() {
                return Promise.resolve(updatedStory => {
                    if (upvote) {
                        updatedStory.upvote += 1;
                    }
                    else {
                        updatedStory.downvote += 1;
                    }

                    return updatedStory;
                });
            });
    }
};
