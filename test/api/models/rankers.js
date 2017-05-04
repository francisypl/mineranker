const expect = require('chai').expect;
const rankers = require('../../../api/models/rankers');
rankers.setDb({});

describe('ranking helper methods', () => {
    it('runOperator gt should return the right values', done => {
        const runOperator = rankers._helperFns.runOperator;

        // gt: Number
        expect(runOperator(3, 'gt', 2)).to.be.true;
        expect(runOperator(1, 'gt', 2)).to.be.false;
        expect(runOperator(3, 'gt', -2)).to.be.true;
        // gt: String
        expect(runOperator('b', 'gt', 'a')).to.be.true;
        expect(runOperator('a', 'gt', 'c')).to.be.false;
        // gt: Boolean
        expect(runOperator(true, 'gt', true)).to.be.false;
        expect(runOperator(true, 'gt', false)).to.be.true;
        expect(runOperator(false, 'gt', true)).to.be.false;
        expect(runOperator(false, 'gt', false)).to.be.false;
        // gt: Object
        expect(runOperator({a:1}, 'gt', {})).to.be.false;
        expect(runOperator({}, 'gt', {})).to.be.false;

        return done();
    });

    it('runOperator gte should return the right values', done => {
        const runOperator = rankers._helperFns.runOperator;

        // gt: Number
        expect(runOperator(3, 'gte', 2)).to.be.true;
        expect(runOperator(1, 'gte', 2)).to.be.false;
        expect(runOperator(3, 'gte', -2)).to.be.true;
        expect(runOperator(3, 'gte', 3)).to.be.true;
        // gt: String
        expect(runOperator('b', 'gte', 'a')).to.be.true;
        expect(runOperator('a', 'gte', 'c')).to.be.false;
        expect(runOperator('a', 'gte', 'a')).to.be.true;
        // gt: Boolean
        expect(runOperator(true, 'gte', true)).to.be.true;
        expect(runOperator(true, 'gte', false)).to.be.true;
        expect(runOperator(false, 'gte', true)).to.be.false;
        expect(runOperator(false, 'gte', false)).to.be.true;
        // gt: Object
        expect(runOperator({a:1}, 'gte', {})).to.be.false;
        expect(runOperator({}, 'gte', {})).to.be.false;

        return done();
    });

    it('runOperator lt should return the right values', done => {
        const runOperator = rankers._helperFns.runOperator;

        // gt: Number
        expect(runOperator(3, 'lt', 2)).to.be.false;
        expect(runOperator(1, 'lt', 2)).to.be.true;
        expect(runOperator(3, 'lt', -2)).to.be.false;
        expect(runOperator(3, 'lt', 3)).to.be.false;
        // gt: String
        expect(runOperator('b', 'lt', 'a')).to.be.false;
        expect(runOperator('a', 'lt', 'c')).to.be.true;
        expect(runOperator('a', 'lt', 'a')).to.be.false;
        // gt: Boolean
        expect(runOperator(true, 'lt', true)).to.be.false;
        expect(runOperator(true, 'lt', false)).to.be.false;
        expect(runOperator(false, 'lt', true)).to.be.true;
        expect(runOperator(false, 'lt', false)).to.be.false;
        // gt: Object
        expect(runOperator({a:1}, 'lt', {})).to.be.false;
        expect(runOperator({}, 'lt', {})).to.be.false;

        return done();
    });

    it('runOperator lte should return the right values', done => {
        const runOperator = rankers._helperFns.runOperator;

        // gt: Number
        expect(runOperator(3, 'lte', 2)).to.be.false;
        expect(runOperator(1, 'lte', 2)).to.be.true;
        expect(runOperator(3, 'lte', -2)).to.be.false;
        expect(runOperator(3, 'lte', 3)).to.be.true;
        // gt: String
        expect(runOperator('b', 'lte', 'a')).to.be.false;
        expect(runOperator('a', 'lte', 'c')).to.be.true;
        expect(runOperator('a', 'lte', 'a')).to.be.true;
        // gt: Boolean
        expect(runOperator(true, 'lte', true)).to.be.true;
        expect(runOperator(true, 'lte', false)).to.be.false;
        expect(runOperator(false, 'lte', true)).to.be.true;
        expect(runOperator(false, 'lte', false)).to.be.true;
        // gt: Object
        expect(runOperator({a:1}, 'lte', {})).to.be.false;
        expect(runOperator({}, 'lte', {})).to.be.false;

        return done();
    });

    it('runOperator contains should return the right values', done => {
        const runOperator = rankers._helperFns.runOperator;

        // contains: Number
        expect(runOperator(1, 'contains', 2)).to.be.false;

        // contains: String
        expect(runOperator('hello world', 'contains', 'world')).to.be.true;
        expect(runOperator('hello world', 'contains', 'WOLRD')).to.be.false;
        expect(runOperator('hello world', 'contains', 'foobar')).to.be.false;
        expect(runOperator('hello world', 'contains', '')).to.be.false;
        expect(runOperator('', 'contains', '')).to.be.true;
        expect(runOperator('hello world', 'contains', 'hello world')).to.be.true;

        // contains:Boolean
        expect(runOperator(true, 'contains', true)).to.be.false;
        expect(runOperator(true, 'contains', false)).to.be.false;
        expect(runOperator(false, 'contains', true)).to.be.false;
        expect(runOperator(false, 'contains', false)).to.be.false;

        // contains: Object
        expect(runOperator({foo: 100}, 'contains', 'foo')).to.be.true;
        expect(runOperator({foo: 100}, 'contains', 'bar')).to.be.false;
        expect(runOperator({}, 'contains', 'bar')).to.be.false;

        return done();
    });

    it('runOperator eq should return the right values', done => {
        const runOperator = rankers._helperFns.runOperator;

        // contains: Number
        expect(runOperator(1, 'eq', 1)).to.be.true;
        expect(runOperator(123, 'eq', 123)).to.be.true;
        expect(runOperator(-123, 'eq', -123)).to.be.true;
        expect(runOperator(123, 'eq', -123)).to.be.false;
        expect(runOperator(123, 'eq', 0)).to.be.false;
        expect(runOperator(0, 'eq', 0)).to.be.true;

        // contains: String
        expect(runOperator('hello world', 'eq', 'world')).to.be.false;
        expect(runOperator('hello world', 'eq', 'foo')).to.be.false;
        expect(runOperator('hello world', 'eq', '')).to.be.false;
        expect(runOperator('', 'eq', '')).to.be.true;
        expect(runOperator('hello world', 'eq', 'hello world')).to.be.true;
        expect(runOperator('hello world', 'eq', 'HELLO WORLD')).to.be.false;

        // contains:Boolean
        expect(runOperator(true, 'eq', true)).to.be.true;
        expect(runOperator(true, 'eq', false)).to.be.false;
        expect(runOperator(false, 'eq', true)).to.be.false;
        expect(runOperator(false, 'eq', false)).to.be.true;

        // contains: Object
        expect(runOperator({foo: 100}, 'eq', {foo: 100})).to.be.true;
        expect(runOperator({foo: 100}, 'eq', {})).to.be.false;
        expect(runOperator({foo: [1,2,3]}, 'eq', {foo: [1,2,3]})).to.be.true;
        expect(runOperator({foo: {bar: 3}}, 'eq', {foo: {bar: 3}})).to.be.true;

        return done();
    });

    it('evaluateValue gt should return the right values', done => {
        const evaluateValue = rankers._helperFns.evaluateValue;

        const gtSuccessCondition = {gt: 3};
        const gtFailCondition = {gt: 10};
        const gtValue = 5;
        expect(evaluateValue(gtSuccessCondition, gtValue)).to.be.true;
        expect(evaluateValue(gtFailCondition, gtValue)).to.be.false;

        return done();
    });

    it('evaluateValue gte should return the right values', done => {
        const evaluateValue = rankers._helperFns.evaluateValue;

        const gteSuccessCondition = {gte: 3};
        const gteSuccessCondition2 = {gte: 2};
        const gteFailCondition = {gte: 10};
        const gteValue = 3;
        expect(evaluateValue(gteSuccessCondition, gteValue)).to.be.true;
        expect(evaluateValue(gteSuccessCondition2, gteValue)).to.be.true;
        expect(evaluateValue(gteFailCondition, gteValue)).to.be.false;

        return done();
    });

    it('evaluateValue lt should return the right values', done => {
        const evaluateValue = rankers._helperFns.evaluateValue;

        const ltSuccessCondition = {lt: 10};
        const ltFailCondition = {lt: 3};
        const ltValue = 5;
        expect(evaluateValue(ltSuccessCondition, ltValue)).to.be.true;
        expect(evaluateValue(ltFailCondition, ltValue)).to.be.false;

        return done();
    });

    it('evaluateValue lte should return the right values', done => {
        const evaluateValue = rankers._helperFns.evaluateValue;

        const lteSuccessCondition = {lte: 3};
        const lteSuccessCondition2 = {lte: 10};
        const lteFailCondition = {lte: 2};
        const lteValue = 3;
        expect(evaluateValue(lteSuccessCondition, lteValue)).to.be.true;
        expect(evaluateValue(lteSuccessCondition2, lteValue)).to.be.true;
        expect(evaluateValue(lteFailCondition, lteValue)).to.be.false;

        return done();
    });

    it('evaluateValue contains should return the right values', done => {
        const evaluateValue = rankers._helperFns.evaluateValue;

        const containsSuccessCondition = {contains: 'hello'};
        const containsFailConition = {contains: 'belo'};
        const containsVal = 'hello world';
        expect(evaluateValue(containsSuccessCondition, containsVal)).to.be.true;
        expect(evaluateValue(containsFailConition, containsVal)).to.be.false;

        const objContainsSuccessCondition = {contains: 'hello'};
        const objContainsFailConition = {contains: 'belo'};
        const objContainsVal = {hello: 'world'};
        expect(evaluateValue(objContainsSuccessCondition, objContainsVal)).to.be.true;
        expect(evaluateValue(objContainsFailConition, objContainsVal)).to.be.false;

        return done();
    });

    it('evaluateValue eq should return the right values', done => {
        const evaluateValue = rankers._helperFns.evaluateValue;

        const eqSuccessCondition = {eq: 3};
        const eqFailCondition = {eq: 4};
        const eqValue = 3;
        expect(evaluateValue(eqSuccessCondition, eqValue)).to.be.true;
        expect(evaluateValue(eqFailCondition, eqValue)).to.be.false;

        return done();
    });

    it('joinObjects should return the right values', done => {
        const joinObjects = rankers._helperFns.joinObjects;

        const data = [
            {
                downvote: {
                    gt: 10
                },
                upvote: {
                    lt: 100
                }
            },
            {
                downvote: {
                    gt: 20
                },
                title: {
                    contains: 'cool'
                }
            }
        ];

        expect(joinObjects(data)).to.deep.equal({
            downvote: {
                gt: 20
            },
            upvote: {
                lt: 100
            },
            title: {
                contains: 'cool'
            }
        });

        return done();
    });

    it('StoriesIterator allVisited should return the right values', done => {
        let sIterator = new rankers._helperFns.StoriesIterator([
            {'a': [1,2,3]},
            {'b': [4,5,6]},
            {'c': [7,8,9]}
        ]);

        expect(sIterator.allVisited()).to.be.false;

        sIterator = new rankers._helperFns.StoriesIterator([]);

        expect(sIterator.allVisited()).to.be.true;

        return done();
    });

    it('StoriesIterator getNextStory should return the right values', done => {
        let sIterator = new rankers._helperFns.StoriesIterator([
            {'a': [{_id: '1'}, {_id: '2'}, {_id: '3'}]},
            {'b': [{_id: '4'}, {_id: '5'}, {_id: '6'}]},
            {'c': [{_id: '7'}, {_id: '8'}, {_id: '9'}]}
        ]);

        expect(sIterator.getNextStory()).to.deep.equal({_id: '1'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '4'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '7'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '2'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '5'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '8'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '3'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '6'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '9'});
        expect(sIterator.allVisited()).to.be.true;
        expect(sIterator.getNextStory()).to.be.null;
        expect(sIterator.getNextStory()).to.be.null;
        expect(sIterator.getNextStory()).to.be.null;
        expect(sIterator.allVisited()).to.be.true;

        return done();
    });

    it('StoriesIterator getNextStory should return the right values', done => {
        let sIterator = new rankers._helperFns.StoriesIterator([
            {'a': [{_id: '1'}, {_id: '2'}, {_id: '3'}]},
            {'b': [{_id: '4'}, {_id: '5'}, {_id: '6'}]},
            {'c': [{_id: '7'}, {_id: '8'}, {_id: '9'}]}
        ]);

        expect(sIterator.getNextStory()).to.deep.equal({_id: '1'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '4'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '7'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '2'});
        expect(sIterator.allVisited()).to.be.false;

        expect(sIterator.getPaginationObject()).to.deep.equal({
            'a': '2',
            'b': '4',
            'c': '7'
        });

        expect(sIterator.getNextStory()).to.deep.equal({_id: '5'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '8'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '3'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '6'});
        expect(sIterator.allVisited()).to.be.false;
        expect(sIterator.getNextStory()).to.deep.equal({_id: '9'});
        expect(sIterator.allVisited()).to.be.true;
        expect(sIterator.getNextStory()).to.be.null;

        expect(sIterator.getPaginationObject()).to.deep.equal({
            'a': '3',
            'b': '6',
            'c': '9'
        });

        return done();
    });
});

describe('rankStories tests', () => {
    const testStories = [
        {
            '5900fbc638675e6d72747b45':[
                {
                    // currency stories
                    '_id' : '590123b9a47700769b5a9a63',
                    'title' : 'USD to AUD : 1 to 1.3365',
                    'url' : 'http://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=AUD',
                    'extra' : {
                        'AUD' : 1.3365
                    },
                    'source' : 'Exchange Rate Miner',
                    'upvote' : 3,
                    'downvote' : 4
                },
                {
                    '_id' : '590123b9a47700769b5a9a64',
                    'title' : 'USD to BGN : 1 to 1.7955',
                    'url' : 'http://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=BGN',
                    'extra' : {
                        'BGN' : 1.7955
                    },
                    'source' : 'Exchange Rate Miner',
                    'upvote' : 2,
                    'downvote' : 10
                },
                {
                    '_id' : '590123b9a47700769b5a9a65',
                    'title' : 'USD to BRL : 1 to 3.1691',
                    'url' : 'http://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=BRL',
                    'extra' : {
                        'BRL' : 3.1691
                    },
                    'source' : 'Exchange Rate Miner',
                    'upvote' : 1,
                    'downvote' : 6
                }
            ]
        },
    // hacker news stories
        {
            '5900d2cf0b9c9157e66e5f56': [
                {
                    '_id' : '5900d6bd0b9c9157e66e5f5a',
                    'source' : 'hacker-news',
                    'title' : 'Mylan’s EpiPen price hike was a scheme to stifle competition, rival claims',
                    'url' : 'https://arstechnica.com/science/2017/04/lawsuit-mylans-epic-epipen-price-hike-wasnt-about-greed-its-worse/',
                    'og_image_url' : 'https://cdn.arstechnica.net/wp-content/uploads/2017/04/GettyImages-609574212-760x380.jpg',
                    'description' : 'Front page layoutSite themeSign up or login to join the discussions!According to the lawsuit:',
                    'upvote' : 0,
                    'downvote' : 0
                },
                {
                    '_id' : '5900d6bd0b9c9157e66e5f5e',
                    'source' : 'hacker-news',
                    'title' : 'Banks should let COBOL die',
                    'url' : 'https://thenextweb.com/finance/2017/04/25/banks-should-let-ancient-programming-language-cobol-die/',
                    'og_image_url' : 'https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/1cbd7a2d21b6a46a5561f507ea58e444.jpg',
                    'description' : '\n                            TNW uses cookies to personalize content and ads to\n                            make our site easier for you to use.\n                            We do also share that information with third parties for\n                            advertising &amp; analytics.\n                        ',
                    'upvote' : 3,
                    'downvote' : 10
                }
            ]
        }
    ];

    it('rankStories gt should return the right values', done => {
        const rankersArr = [{
            filter: {
                downvote: {
                    gt: 5
                }
            },
            sort: {}
        }];
        const {stories, page} = rankers.rankStories(testStories, rankersArr, 30);

        expect(stories.length).to.equal(3);

        return done();
    });

    it('rankStories gte should return the right values', done => {
        const rankersArr = [{
            filter: {
                upvote: {
                    gte: 3
                }
            },
            sort: {}
        }];
        const {stories, page} = rankers.rankStories(testStories, rankersArr, 30);

        expect(stories.length).to.equal(2);

        return done();
    });

    it('rankStories lt should return the right values', done => {
        const rankersArr = [{
            filter: {
                downvote: {
                    lt: 5
                }
            },
            sort: {}
        }];
        const {stories, page} = rankers.rankStories(testStories, rankersArr, 30);

        expect(stories.length).to.equal(2);

        return done();
    });

    it('rankStories lte should return the right values', done => {
        const rankersArr = [{
            filter: {
                upvote: {
                    lte: 3
                }
            },
            sort: {}
        }];
        const {stories, page} = rankers.rankStories(testStories, rankersArr, 30);

        expect(stories.length).to.equal(5);

        return done();
    });

    it('rankStories contains should return the right values', done => {
        const rankersArr = [{
            filter: {
                source: {
                    contains: 'Exchange'
                }
            },
            sort: {}
        }];
        const {stories, page} = rankers.rankStories(testStories, rankersArr, 30);

        expect(stories.length).to.equal(3);

        return done();
    });

    it('rankStories contains2 should return the right values', done => {
        const rankersArr = [{
            filter: {
                source: {
                    contains: 'hacker'
                }
            },
            sort: {}
        }];
        const {stories, page} = rankers.rankStories(testStories, rankersArr, 30);

        expect(stories.length).to.equal(2);

        return done();
    });

    it('rankStories eq should return the right values', done => {
        const rankersArr = [{
            filter: {
                upvote: {
                    eq: 3
                }
            },
            sort: {}
        }];
        const {stories, page} = rankers.rankStories(testStories, rankersArr, 30);

        expect(stories.length).to.equal(2);

        return done();
    });

    it('rankStories should return the right values when some stories dont have keys', done => {
        const rankersArr = [{
            filter: {
                extra: {
                    contains: 'BRL'
                }
            },
            sort: {}
        }];
        const {stories, page} = rankers.rankStories(testStories, rankersArr, 30);

        expect(stories.length).to.equal(3);

        return done();
    });

    it('rankStories should return the right values with two filters', done => {
        const rankersArr = [{
            filter: {
                upvote: {
                    eq: 3
                },
                extra: {
                    contains: 'AUD'
                }
            },
            sort: {}
        }];
        const {stories, page} = rankers.rankStories(testStories, rankersArr, 30);

        expect(stories.length).to.equal(3);

        return done();
    });

    it('rankStories should return the right values with two filters', done => {
        const rankersArr = [{
            filter: {
                upvote: {
                    eq: 3
                },
                extra: {
                    contains: 'AUD'
                }
            },
            sort: {}
        }];
        const {stories, page} = rankers.rankStories(testStories, rankersArr, 30);

        expect(stories.length).to.equal(3);

        return done();
    });

    it('rankStories should return the right values with two ranker filters', done => {
        const rankersArr = [{
            filter: {
                upvote: {
                    gt: 2
                }
            },
            sort: {}
        },
        {
            filter: {
                extra: {
                    contains: 'AUD'
                }
            }
        }];
        const {stories, page} = rankers.rankStories(testStories, rankersArr, 30);

        expect(stories.length).to.equal(2);

        return done();
    });
});
