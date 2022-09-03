import { expect } from 'chai';
import { Geometric2 } from '../../../src/lib/math/Geometric2';

// const zero = Geometric2.zero;
const one = Geometric2.one(true);
// const two = Geometric2.one(true).scale(2);
const e1 = Geometric2.e1(true);
const e2 = Geometric2.e2(true);
const e12 = Geometric2.e1(false).mul(e2);
e12.lock();
const I = e12;
/**
 * @hidden
 */
const elements = [one, e1, e2, e12];

/**
 * The decimal place up to which the numbers should agree.
 * Make this as large as possible while avoiding rounding errors.
 */
const PRECISION = 14;

/**
 * @hidden
 */
function checkEQ(result: Geometric2, comp: Geometric2): void {
    expect(result.a).to.equal(comp.a);
    expect(result.x).to.equal(comp.x);
    expect(result.y).to.equal(comp.y);
    expect(result.b).to.equal(comp.b);
    expect(result.isLocked()).to.equal(comp.isLocked());
    // expect(result.isMutable()).to.equal(comp.isMutable(), `isMutable, result=${result.isMutable()}, comp=${comp.isMutable()}`);
}

describe("Geometric2", function () {
    describe("constructor()", function () {
        it("should be the value 0", function () {
            const zero: Geometric2 = new Geometric2();
            expect(zero.a).to.equal(0);
            expect(zero.x).to.equal(0);
            expect(zero.y).to.equal(0);
            expect(zero.b).to.equal(0);
        });
    });

    describe("static e1", function () {
        it("(true) should be the vector (1, 0)", function () {
            const e1: Geometric2 = Geometric2.e1(true);
            expect(e1.a).to.equal(0);
            expect(e1.x).to.equal(1);
            expect(e1.y).to.equal(0);
            expect(e1.b).to.equal(0);
            expect(e1.isLocked()).to.equal(true);
        });
        it("(false) should be the vector (1, 0)", function () {
            const e1: Geometric2 = Geometric2.e1(false);
            expect(e1.a).to.equal(0);
            expect(e1.x).to.equal(1);
            expect(e1.y).to.equal(0);
            expect(e1.b).to.equal(0);
            expect(e1.isLocked()).to.equal(false);
        });
    });

    describe("static e2()", function () {
        it("(true) should be the vector (0, 1)", function () {
            const e2: Geometric2 = Geometric2.e2(true);
            expect(e2.a).to.equal(0);
            expect(e2.x).to.equal(0);
            expect(e2.y).to.equal(1);
            expect(e2.b).to.equal(0);
            expect(e2.isLocked()).to.equal(true);
        });
        it("(false) should be the vector (0, 1)", function () {
            const e2: Geometric2 = Geometric2.e2(false);
            expect(e2.a).to.equal(0);
            expect(e2.x).to.equal(0);
            expect(e2.y).to.equal(1);
            expect(e2.b).to.equal(0);
            expect(e2.isLocked()).to.equal(false);
        });
    });

    describe("static one", function () {
        it("(true) should be the scalar 1", function () {
            const one: Geometric2 = Geometric2.one(true);
            expect(one.a).to.equal(1);
            expect(one.x).to.equal(0);
            expect(one.y).to.equal(0);
            expect(one.b).to.equal(0);
            expect(one.isLocked()).to.equal(true);
        });
        it("(false) should be the scalar 1", function () {
            const one: Geometric2 = Geometric2.one(false);
            expect(one.a).to.equal(1);
            expect(one.x).to.equal(0);
            expect(one.y).to.equal(0);
            expect(one.b).to.equal(0);
            expect(one.isLocked()).to.equal(false);
        });
    });

    describe("static I", function () {
        it("(true) should be the pseudoscalar 1", function () {
            const I: Geometric2 = Geometric2.I(true);
            expect(I.a).to.equal(0);
            expect(I.x).to.equal(0);
            expect(I.y).to.equal(0);
            expect(I.b).to.equal(1);
            expect(I.isLocked()).to.equal(true);
        });
        it("(false) should be the pseudoscalar 1", function () {
            const I: Geometric2 = Geometric2.I(false);
            expect(I.a).to.equal(0);
            expect(I.x).to.equal(0);
            expect(I.y).to.equal(0);
            expect(I.b).to.equal(1);
            expect(I.isLocked()).to.equal(false);
        });
    });

    describe("distanceTo", function () {
        it("(0, 0) should be zero", function () {
            const zero: Geometric2 = Geometric2.zero(true);
            expect(zero.clone().distanceTo(zero)).to.equal(0);
        });
        it("(0, e1) should be 1", function () {
            const zero: Geometric2 = Geometric2.zero(true);
            const e1: Geometric2 = Geometric2.vector(1, 0);
            expect(zero.clone().distanceTo(e1)).to.equal(1);
        });
        it("(0, e2) should be 1", function () {
            const zero: Geometric2 = Geometric2.zero(true);
            const e2: Geometric2 = Geometric2.vector(0, 1);
            expect(zero.clone().distanceTo(e2)).to.equal(1);
        });
        it("(-e2, e2) should be 1", function () {
            const a: Geometric2 = Geometric2.vector(-1, 0);
            const b: Geometric2 = Geometric2.vector(+1, 0);
            expect(a.clone().distanceTo(b)).to.equal(2);
        });
        it("(0, e1 + e2) should be sqrt(2)", function () {
            const a: Geometric2 = Geometric2.vector(0, 0);
            const b: Geometric2 = Geometric2.vector(1, 1);
            expect(a.clone().distanceTo(b)).to.equal(Math.sqrt(2));
        });
    });

    describe("div", function () {
        it("1 / 1 should be 1", function () {
            const x: Geometric2 = Geometric2.one();
            const ans = x.clone().div(x);
            expect(ans.a).to.equal(1);
            expect(ans.x).to.equal(0);
            expect(ans.y).to.equal(0);
            expect(ans.b).to.equal(0);
        });
        it("e1 / e1 should be 1", function () {
            const x: Geometric2 = Geometric2.e1();
            const ans = x.clone().div(x);
            expect(ans.a).to.equal(1);
            expect(ans.x).to.equal(0);
            expect(ans.y).to.equal(0);
            expect(ans.b).to.equal(0);
        });
        it("e1 / e2 should be I", function () {
            const ans: Geometric2 = Geometric2.e1().clone().div(Geometric2.e2());
            expect(ans.a).to.equal(0);
            expect(ans.x).to.equal(0);
            expect(ans.y).to.equal(0);
            expect(ans.b).to.equal(1);
        });
        it("e2 / e2 should be 1", function () {
            const x: Geometric2 = Geometric2.e2();
            const ans = x.clone().div(x);
            expect(ans.a).to.equal(1);
            expect(ans.x).to.equal(0);
            expect(ans.y).to.equal(0);
            expect(ans.b).to.equal(0);
        });
        it("I / I should be 1", function () {
            const I: Geometric2 = Geometric2.e1().clone().mul(Geometric2.e2());
            const ans = I.clone().div(I);
            expect(ans.a).to.equal(1);
            expect(ans.x).to.equal(0);
            expect(ans.y).to.equal(0);
            expect(ans.b).to.equal(0);
        });
    });

    describe("dual", function () {
        it("", function () {
            checkEQ(one.dual(), I.neg());
            checkEQ(e1.dual(), e2.neg());
            checkEQ(e2.dual(), e1);
            checkEQ(I.dual(), one);
        });
        it("dual(Ak) = Ak << inv(I)", function () {
            for (const element of elements) {
                checkEQ(element.dual(), element.lco(I.rev()));
                checkEQ(element.dual(), element.lco(I.inv()));
            }
        });
    });

    describe("inv", function () {
        it("(1) should be 1", function () {
            const one: Geometric2 = Geometric2.one();
            const inv = one.clone().inv();
            expect(inv.a).to.equal(1);
            expect(inv.x).to.equal(0);
            expect(inv.y).to.equal(0);
            expect(inv.b).to.equal(0);
        });
        it("(2) should be 0.5", function () {
            const one: Geometric2 = Geometric2.scalar(2);
            const inv = one.clone().inv();
            expect(inv.a).to.equal(0.5);
            expect(inv.x).to.equal(0);
            expect(inv.y).to.equal(0);
            expect(inv.b).to.equal(0);
        });
        it("(e1) should be e1", function () {
            const e1: Geometric2 = Geometric2.e1();
            const inv = e1.clone().inv();
            expect(inv.a).to.equal(0);
            expect(inv.x).to.equal(1);
            expect(inv.y).to.equal(0);
            expect(inv.b).to.equal(0);
        });
        it("(2 * e1) should be 0.5 * e1", function () {
            const e1: Geometric2 = Geometric2.e1();
            const inv = e1.clone().scale(2).inv();
            expect(inv.a).to.equal(0);
            expect(inv.x).to.equal(0.5);
            expect(inv.y).to.equal(0);
            expect(inv.b).to.equal(0);
        });
        it("(e2) should be e2", function () {
            const e2: Geometric2 = Geometric2.e2();
            const inv = e2.clone().inv();
            expect(inv.a).to.equal(0);
            expect(inv.x).to.equal(0);
            expect(inv.y).to.equal(1);
            expect(inv.b).to.equal(0);
        });
        it("(2 * e2) should be 0.5 * e2", function () {
            const e2: Geometric2 = Geometric2.e2();
            const inv = e2.clone().scale(2).inv();
            expect(inv.a).to.equal(0);
            expect(inv.x).to.equal(0);
            expect(inv.y).to.equal(0.5);
            expect(inv.b).to.equal(0);
        });
        it("(I) should be -I", function () {
            const e1: Geometric2 = Geometric2.e1();
            const e2: Geometric2 = Geometric2.e2();
            const I = e1.clone().mul(e2);
            const inv = I.clone().inv();
            expect(inv.a).to.equal(0);
            expect(inv.x).to.equal(0);
            expect(inv.y).to.equal(0);
            expect(inv.b).to.equal(-1);
        });
        it("(2 * I) should be -0.5 * I", function () {
            const e1: Geometric2 = Geometric2.e1();
            const e2: Geometric2 = Geometric2.e2();
            const I = e1.clone().mul(e2);
            const inv = I.clone().scale(2).inv();
            expect(inv.a).to.equal(0);
            expect(inv.x).to.equal(0);
            expect(inv.y).to.equal(0);
            expect(inv.b).to.equal(-0.5);
        });
    });

    describe("magnitude", function () {
        describe("(1) should be 1", function () {
            it("should be the number 1", function () {
                const one: Geometric2 = Geometric2.one();
                expect(one.magnitude()).to.equal(1);
                expect(one.equals(Geometric2.one())).to.equal(true);
            });
        });
    });

    describe("reflect", function () {
        describe("(n) should be -n * M * n", function () {
            const S = Geometric2.fromCartesian(2, 3, 5, 7);
            const n = Geometric2.vector(1, 2).normalize();
            const T = S.clone().reflect(n);
            const C = n.clone().mul(S).mul(n).scale(-1);

            it("should be the number 1", function () {
                expect(C.a).to.be.closeTo(-2.0, PRECISION);
                expect(C.x).to.be.closeTo(-2.2, PRECISION);
                expect(C.y).to.be.closeTo(-5.4, PRECISION);
                expect(C.b).to.be.closeTo(7, PRECISION);

                expect(T.a).to.be.closeTo(-2.0, PRECISION);
                expect(T.x).to.be.closeTo(-2.2, PRECISION);
                expect(T.y).to.be.closeTo(-5.4, PRECISION);
                expect(T.b).to.be.closeTo(7, PRECISION);
            });
        });
    });
});
