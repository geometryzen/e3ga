import { expect } from 'chai';
import { VectorN } from '../../src/math/VectorN';

describe("VectorN", function () {
    describe("constructor", function () {
        const data = [Math.random(), Math.random(), Math.random()];
        const vec = new VectorN(data, false, 3);
        it("getComponent(0)", function () {
            expect(vec.getComponent(0)).to.equal(data[0]);
        });
        it("getComponent(1)", function () {
            expect(vec.getComponent(1)).to.equal(data[1]);
        });
        it("getComponent(2)", function () {
            expect(vec.getComponent(2)).to.equal(data[2]);
        });
    });
});
