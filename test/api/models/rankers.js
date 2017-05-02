const expect = require('chai').expect;
const rankers = require('../../../api/models/rankers');

describe('ranker model', () => {
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
});
