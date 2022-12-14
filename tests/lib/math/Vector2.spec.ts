import { expect } from 'chai';
import { Vector2 } from '../../../src/lib/math/Vector2';

describe("Vector2", function () {

    describe("constructor", function () {
        const coords = [Math.random(), Math.random()];
        const v = new Vector2(coords, false);
        it("getComponent(0)", function () {
            expect(v.getComponent(0)).to.equal(coords[0]);
        });
        it("getComponent(1)", function () {
            expect(v.getComponent(1)).to.equal(coords[1]);
        });
    });

    describe("toString", function () {
        const coords = [2, 3];
        const v = new Vector2(coords, false);
        it("should match coordinates with basis vectors", function () {
            expect(v.toString()).to.equal('2*e1+3*e2');
        });
    });

    describe("toFixed", function () {
        const coords = [2, 3];
        const v = new Vector2(coords, false);
        it("should display correct number of decimals", function () {
            expect(v.toFixed(4)).to.equal('2.0000*e1+3.0000*e2');
        });
    });

    describe("toExponential", function () {
        const coords = [2, 3];
        const v = new Vector2(coords, false);
        it("should display with scientific notation", function () {
            expect(v.toExponential()).to.equal('2e+0*e1+3e+0*e2');
        });
    });
});
