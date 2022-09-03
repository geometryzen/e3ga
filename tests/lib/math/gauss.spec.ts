import { expect } from 'chai';
import { gauss } from '../../../src/lib/math/gauss';

describe("gauss", function () {

    it("4x = 8", function () {
        const A = [[4]];
        const b = [8];
        const result = gauss(A, b);
        expect(result.length).to.equal(1);
        expect(result[0]).to.equal(2);
    });

    it("x + y = 10, 2x + y = 16", function () {
        const A = [[1, 1], [2, 1]];
        const b = [10, 16];
        const result = gauss(A, b);
        expect(result.length).to.equal(2);
        expect(result[0]).to.equal(6);
        expect(result[1]).to.equal(4);
    });

    it("x + y + z = 6, 2x + y + 2z = 10, x + 2y + 3z = 14", function () {
        const A = [[1, 1, 1], [2, 1, 2], [1, 2, 3]];
        const b = [6, 10, 14];
        const result = gauss(A, b);
        expect(result.length).to.equal(3);
        expect(result[0]).to.equal(1);
        expect(result[1]).to.equal(2);
        expect(result[2]).to.equal(3);
    });

});
