import { expect } from 'chai';
import { Spinor3 } from '../../src/lib/math/Spinor3';
import { Vector3 } from '../../src/lib/math/Vector3';

const e1 = Vector3.e1();
e1.lock();
const e2 = Vector3.e2();
e2.lock();
const e3 = Vector3.e3();
e3.lock();

describe("Vector3", function () {
    describe("constructor", function () {
        const data: [number, number, number] = [Math.random(), Math.random(), Math.random()];
        const vec = new Vector3(data, false);
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
    describe("locking", function () {
        it("new Vector3", function () {
            // Not sure why TypeScript infers the type of data to be number[]. 
            const data: [number, number, number] = [1, 2, 3];
            const vec = new Vector3(data, false);
            expect(vec.isLocked()).to.equal(false);
            expect(vec.isLocked()).to.equal(false);
        });
        it("vector(x, y, z)", function () {
            const vec = Vector3.vector(1, 1, 1);
            expect(vec.isLocked()).to.equal(false);
        });
    });
    describe("modified", function () {
        it("new Vector3", function () {
            // Not sure why TypeScript infers the type of data to be number[]. 
            const data: [number, number, number] = [1, 2, 3];
            const vec = new Vector3(data, false);
            expect(vec.modified).to.equal(false);
        });
        it("vector(x, y, z)", function () {
            const vec = Vector3.vector(1, 1, 1);
            expect(vec.modified).to.equal(false);
        });
    });
    describe("maskG3", function () {
        it("should be 0x2 for non-zero vectors", function () {
            expect(Vector3.vector(1, 0, 0).maskG3).to.equal(0x2);
            expect(Vector3.vector(0, 1, 0).maskG3).to.equal(0x2);
            expect(Vector3.vector(0, 0, 1).maskG3).to.equal(0x2);
        });
        it("should be 0x0 for the zero vector", function () {
            expect(Vector3.vector(0, 0, 0).maskG3).to.equal(0x0);
        });
    });
    describe("operator", function () {
        describe("__add__", function () {
            const a = new Vector3([1, 2, 3]);
            const b = new Vector3([3, 2, 1]);
            const q = a.__add__(b);
            it("(rhs is vector)", function () {
                expect(q.x).to.equal(4);
                expect(q.y).to.equal(4);
                expect(q.z).to.equal(4);
            });
            it("should not change lhs", function () {
                expect(a.x).to.equal(1);
                expect(a.y).to.equal(2);
                expect(a.z).to.equal(3);
            });
            it("should not change rhs", function () {
                expect(b.x).to.equal(3);
                expect(b.y).to.equal(2);
                expect(b.z).to.equal(1);
            });
        });
        describe("__radd__", function () {
            const a = new Vector3([1, 2, 3]);
            const b = new Vector3([3, 2, 1]);
            const q = a.__radd__(b);
            it("(rhs is vector)", function () {
                expect(q.x).to.equal(4);
                expect(q.y).to.equal(4);
                expect(q.z).to.equal(4);
            });
            it("should not change lhs", function () {
                expect(a.x).to.equal(1);
                expect(a.y).to.equal(2);
                expect(a.z).to.equal(3);
            });
            it("should not change rhs", function () {
                expect(b.x).to.equal(3);
                expect(b.y).to.equal(2);
                expect(b.z).to.equal(1);
            });
        });
        describe("__sub__", function () {
            const a = new Vector3([6, 4, 2]);
            const b = new Vector3([3, 2, 1]);
            const q = a.__sub__(b);
            it("(rhs is vector)", function () {
                expect(q.x).to.equal(3);
                expect(q.y).to.equal(2);
                expect(q.z).to.equal(1);
            });
            it("should not change lhs", function () {
                expect(a.x).to.equal(6);
                expect(a.y).to.equal(4);
                expect(a.z).to.equal(2);
            });
            it("should not change rhs", function () {
                expect(b.x).to.equal(3);
                expect(b.y).to.equal(2);
                expect(b.z).to.equal(1);
            });
        });
        describe("__rsub__", function () {
            const a = new Vector3([3, 2, 1]);
            const b = new Vector3([6, 4, 2]);
            const q = a.__rsub__(b);
            it("(lhs is vector)", function () {
                expect(q.x).to.equal(3);
                expect(q.y).to.equal(2);
                expect(q.z).to.equal(1);
            });
            it("should not change a", function () {
                expect(a.x).to.equal(3);
                expect(a.y).to.equal(2);
                expect(a.z).to.equal(1);
            });
            it("should not change b", function () {
                expect(b.x).to.equal(6);
                expect(b.y).to.equal(4);
                expect(b.z).to.equal(2);
            });
        });
        describe("__mul__", function () {
            const a = new Vector3([1, 2, 3]);
            const ?? = 2;
            const q = a.__mul__(??);
            it("(rhs is number)", function () {
                expect(q.x).to.equal(2);
                expect(q.y).to.equal(4);
                expect(q.z).to.equal(6);
            });
            it("should not change the vector", function () {
                expect(a.x).to.equal(1);
                expect(a.y).to.equal(2);
                expect(a.z).to.equal(3);
            });
        });
        describe("__div__", function () {
            const a = new Vector3([2, 4, 6]);
            const ?? = 2;
            const q = a.__div__(??);
            it("(rhs is number)", function () {
                expect(q.x).to.equal(1);
                expect(q.y).to.equal(2);
                expect(q.z).to.equal(3);
            });
            it("should not change the vector", function () {
                expect(a.x).to.equal(2);
                expect(a.y).to.equal(4);
                expect(a.z).to.equal(6);
            });
        });
        describe("__rdiv__", function () {
            const a = new Vector3([2, 4, 6]);
            const ?? = 2;
            const q = a.__rdiv__(??);
            it("(lhs is number)", function () {
                expect(q).to.be.undefined;
            });
            it("should not change the vector", function () {
                expect(a.x).to.equal(2);
                expect(a.y).to.equal(4);
                expect(a.z).to.equal(6);
            });
        });
        describe("__neg__", function () {
            const a = new Vector3([1, 2, 3]);
            const b = a.__neg__();
            it("should have negated coordinates", function () {
                expect(b.x).to.equal(-a.x);
                expect(b.y).to.equal(-a.y);
                expect(b.z).to.equal(-a.z);
            });
            it("should not change the vector", function () {
                expect(a.x).to.equal(1);
                expect(a.y).to.equal(2);
                expect(a.z).to.equal(3);
            });
        });
        describe("__pos__", function () {
            const a = new Vector3([1, 2, 3]);
            const b = a.__pos__();
            it("should have same coordinates", function () {
                expect(b.x).to.equal(a.x);
                expect(b.y).to.equal(a.y);
                expect(b.z).to.equal(a.z);
                expect(b.x).to.equal(+a.x);
                expect(b.y).to.equal(+a.y);
                expect(b.z).to.equal(+a.z);
            });
            it("should not change the vector", function () {
                expect(a.x).to.equal(1);
                expect(a.y).to.equal(2);
                expect(a.z).to.equal(3);
            });
        });
    });
    describe("dual", function () {
        describe("e12", function () {
            it("should use right hand rule for bivector to vector.", function () {
                const e12 = Spinor3.wedge(e1, e2);
                const v = Vector3.dual(e12);
                expect(v.x).to.equal(e3.x);
                expect(v.y).to.equal(e3.y);
                expect(v.z).to.equal(e3.z);
            });
        });
        describe("e23", function () {
            it("should use right hand rule for bivector to vector.", function () {
                const e23 = Spinor3.wedge(e2, e3);
                const v = Vector3.dual(e23);
                expect(v.x).to.equal(e1.x);
                expect(v.y).to.equal(e1.y);
                expect(v.z).to.equal(e1.z);
            });
        });
        describe("e31", function () {
            it("should use right hand rule for bivector to vector.", function () {
                const e31 = Spinor3.wedge(e3, e1);
                const v = Vector3.dual(e31);
                expect(v.x).to.equal(e2.x);
                expect(v.y).to.equal(e2.y);
                expect(v.z).to.equal(e2.z);
            });
        });
    });
});
