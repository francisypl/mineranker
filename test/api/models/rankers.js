const expect = require('chai').expect;
const rankers = require('../../../api/models/rankers');

describe('ranker model', () => {
    it('operatorFns gt should return the right values', done => {
        const runOperator = rankers._helperFns.runOperator;

        // gt: Number
        expect(runOperator('gt', 3, 2)).to.be.true;
        expect(runOperator('gt', 1, 2)).to.be.false;
        expect(runOperator('gt', 3, -2)).to.be.true;
        // gt: String
        expect(runOperator('gt', 'b', 'a')).to.be.true;
        expect(runOperator('gt', 'a', 'c')).to.be.false;
        // gt: Boolean
        expect(runOperator('gt', true, true)).to.be.false;
        expect(runOperator('gt', true, false)).to.be.true;
        expect(runOperator('gt', false, true)).to.be.false;
        expect(runOperator('gt', false, false)).to.be.false;
        // gt: Object
        expect(runOperator('gt', {a:1}, {})).to.be.false;
        expect(runOperator('gt', {}, {})).to.be.false;

        return done();
    });

    it('operatorFns gte should return the right values', done => {
        const runOperator = rankers._helperFns.runOperator;

        // gt: Number
        expect(runOperator('gte', 3, 2)).to.be.true;
        expect(runOperator('gte', 1, 2)).to.be.false;
        expect(runOperator('gte', 3, -2)).to.be.true;
        expect(runOperator('gte', 3, 3)).to.be.true;
        // gt: String
        expect(runOperator('gte', 'b', 'a')).to.be.true;
        expect(runOperator('gte', 'a', 'c')).to.be.false;
        expect(runOperator('gte', 'a', 'a')).to.be.true;
        // gt: Boolean
        expect(runOperator('gte', true, true)).to.be.true;
        expect(runOperator('gte', true, false)).to.be.true;
        expect(runOperator('gte', false, true)).to.be.false;
        expect(runOperator('gte', false, false)).to.be.true;
        // gt: Object
        expect(runOperator('gte', {a:1}, {})).to.be.false;
        expect(runOperator('gte', {}, {})).to.be.false;

        return done();
    });

    it('operatorFns lt should return the right values', done => {
        const runOperator = rankers._helperFns.runOperator;

        // gt: Number
        expect(runOperator('lt', 3, 2)).to.be.false;
        expect(runOperator('lt', 1, 2)).to.be.true;
        expect(runOperator('lt', 3, -2)).to.be.false;
        expect(runOperator('lt', 3, 3)).to.be.false;
        // gt: String
        expect(runOperator('lt', 'b', 'a')).to.be.false;
        expect(runOperator('lt', 'a', 'c')).to.be.true;
        expect(runOperator('lt', 'a', 'a')).to.be.false;
        // gt: Boolean
        expect(runOperator('lt', true, true)).to.be.false;
        expect(runOperator('lt', true, false)).to.be.false;
        expect(runOperator('lt', false, true)).to.be.true;
        expect(runOperator('lt', false, false)).to.be.false;
        // gt: Object
        expect(runOperator('lt', {a:1}, {})).to.be.false;
        expect(runOperator('lt', {}, {})).to.be.false;

        return done();
    });

    it('operatorFns lte should return the right values', done => {
        const runOperator = rankers._helperFns.runOperator;

        // gt: Number
        expect(runOperator('lte', 3, 2)).to.be.false;
        expect(runOperator('lte', 1, 2)).to.be.true;
        expect(runOperator('lte', 3, -2)).to.be.false;
        expect(runOperator('lte', 3, 3)).to.be.true;
        // gt: String
        expect(runOperator('lte', 'b', 'a')).to.be.false;
        expect(runOperator('lte', 'a', 'c')).to.be.true;
        expect(runOperator('lte', 'a', 'a')).to.be.true;
        // gt: Boolean
        expect(runOperator('lte', true, true)).to.be.true;
        expect(runOperator('lte', true, false)).to.be.false;
        expect(runOperator('lte', false, true)).to.be.true;
        expect(runOperator('lte', false, false)).to.be.true;
        // gt: Object
        expect(runOperator('lte', {a:1}, {})).to.be.false;
        expect(runOperator('lte', {}, {})).to.be.false;

        return done();
    });

    it('operationFns contains should return the right values', done => {
        const runOperator = rankers._helperFns.runOperator;

        // contains: Number
        expect(runOperator('contains', 1, 2)).to.be.false;

        // contains: String
        expect(runOperator('contains', 'hello world', 'world')).to.be.true;
        expect(runOperator('contains', 'hello world', 'WOLRD')).to.be.false;
        expect(runOperator('contains', 'hello world', 'foobar')).to.be.false;
        expect(runOperator('contains', 'hello world', '')).to.be.false;
        expect(runOperator('contains', '', '')).to.be.true;
        expect(runOperator('contains', 'hello world', 'hello world')).to.be.true;

        // contains:Boolean
        expect(runOperator('contains', true, true)).to.be.false;
        expect(runOperator('contains', true, false)).to.be.false;
        expect(runOperator('contains', false, true)).to.be.false;
        expect(runOperator('contains', false, false)).to.be.false;

        // contains: Object
        expect(runOperator('contains', {foo: 100}, 'foo')).to.be.true;
        expect(runOperator('contains', {foo: 100}, 'bar')).to.be.false;
        expect(runOperator('contains', {}, 'bar')).to.be.false;

        return done();
    });
});
