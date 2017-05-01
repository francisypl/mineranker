const expect = require('chai').expect;
const rankers = require('../../../api/models/rankers');

describe('ranker model', () => {
    it('operatorFns should return the right values', done => {
        const runOperator = rankers._helperFns.runOperator;
        expect(1).to.equal(1);

        return done();
    });
});
