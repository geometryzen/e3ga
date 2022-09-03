import { expect } from 'chai';
import { BivectorE3 } from "../../src/math/BivectorE3";
import { Geometric3 } from "../../src/math/Geometric3";
import { Spinor3 } from "../../src/math/Spinor3";
import { Vector3 } from "../../src/math/Vector3";
import { VectorE3 } from "../../src/math/VectorE3";

/**
 * @hidden
 */
const one = Geometric3.ONE;
/**
 * @hidden
 */
const e1 = Geometric3.E1;
/**
 * @hidden
 */
const e2 = Geometric3.E2;
/**
 * @hidden
 */
const e3 = Geometric3.E3;
/**
 * @hidden
 */
const e23 = e2.clone().mul(e3);
e23.lock();
/**
 * @hidden
 */
const e31 = e3.clone().mul(e1);
e31.lock();
/**
 * @hidden
 */
const e12 = e1.clone().mul(e2);
e12.lock();
/**
 * @hidden
 */
const I = e1.clone().mul(e2).mul(e3);
I.lock();

/**
 * @hidden
 */
function reflectSpec(M: Geometric3, n: VectorE3) {
    const spec = function () {
        /**
         * We want to verify that coefficients are carried through.
         */
        const S = M.clone().scale(2);
        /**
         * We want the reflect method to work even when n is not a unit vector.
         */
        const N = Geometric3.fromVector(n).scale(3);
        /**
         * The 'Test' result using the specialized method.
         */
        const T = S.clone().reflect(N);
        /**
         * The 'Control' value computed explicitly as C = -n * S * n
         */
        const C = N.clone().mul(S).mul(N).scale(-1);

        it("should be -n * M * n", function () {
            expect(T.a).to.equal(C.a);
            expect(T.x).to.equal(C.x);
            expect(T.y).to.equal(C.y);
            expect(T.z).to.equal(C.z);
            expect(T.yz).to.equal(C.yz);
            expect(T.zx).to.equal(C.zx);
            expect(T.xy).to.equal(C.xy);
            expect(T.b).to.equal(C.b);
        });
    };
    return spec;
}
/**
 * @hidden
 */
function checkEQ(result: Geometric3, comp: Geometric3): void {
    expect(result.a).to.equal(comp.a);
    expect(result.x).to.equal(comp.x);
    expect(result.y).to.equal(comp.y);
    expect(result.z).to.equal(comp.z);
    expect(result.xy).to.equal(comp.xy);
    expect(result.yz).to.equal(comp.yz);
    expect(result.zx).to.equal(comp.zx);
    expect(result.b).to.equal(comp.b);
    expect(result.isLocked()).to.equal(comp.isLocked());
    // expect(result.isMutable()).to.equal(comp.isMutable(), `isMutable, result=${result.isMutable()}, comp=${comp.isMutable()}`);
}

/**
 * The decimal place up to which the numbers should agree.
 * Make this as large as possible while avoiding rounding errors.
 * @hidden
 */
const PRECISION = 14;

describe("Geometric3", function () {
    describe("cross", function () {
        it("should be consistent with a right-handed pseudoscalar.", function () {
            checkEQ(e1.cross(e2), e3);
            checkEQ(e2.cross(e3), e1);
            checkEQ(e3.cross(e1), e2);
        });
    });
    describe("dual", function () {
        it("should be consistent with a right-handed pseudoscalar.", function () {
            checkEQ(one.dual(), I.neg());
            checkEQ(e1.dual(), e23.neg());
            checkEQ(e2.dual(), e31.neg());
            checkEQ(e3.dual(), e12.neg());
            checkEQ(e12.dual(), e3);
            checkEQ(e23.dual(), e1);
            checkEQ(e31.dual(), e2);
            checkEQ(I.dual(), one);
        });
    });
    describe("equals", function () {
        it("(M) should be equal to M", function () {
            const zero: Geometric3 = Geometric3.ZERO;
            const one: Geometric3 = Geometric3.ONE;
            expect(zero.equals(zero)).to.equal(true);
            expect(one.equals(one)).to.equal(true);
            expect(zero.equals(one)).to.equal(false);
            expect(one.equals(zero)).to.equal(false);
        });
    });

    describe("locking", function () {
        const m = Geometric3.scalar(5);
        m.lock();
        it("", function () {
            expect(m.isLocked()).to.equal(true);
        });
    });

    describe("div", function () {
        it("1 / 1 should be 1", function () {
            const numer: Geometric3 = one.clone();
            const denom: Geometric3 = one.clone();
            const ratio = numer.clone().div(denom);
            expect(ratio.isOne()).to.be.true;
        });
        it("1 / 2 should be 0.5", function () {
            const numer: Geometric3 = one.clone();
            const denom: Geometric3 = one.clone().scale(2);
            const ratio = numer.clone().div(denom);
            expect(ratio.toString()).to.equal(one.clone().divByScalar(2).toString());
        });
        it("e1 / 1 should be e1", function () {
            const numer: Geometric3 = e1.clone();
            const denom: Geometric3 = one.clone();
            const ratio = numer.clone().div(denom);
            expect(ratio.toString()).to.equal(e1.toString());
        });
        it("e1 / e1 should be 1", function () {
            const numer: Geometric3 = e1.clone();
            const denom: Geometric3 = e1.clone();
            const ratio = numer.clone().div(denom);
            expect(ratio.toString()).to.equal(one.toString());
        });
        it("e1 / e2 should be e1 * e2", function () {
            const numer: Geometric3 = e1.clone();
            const denom: Geometric3 = e2.clone();
            const ratio = numer.clone().div(denom);
            expect(ratio.toString()).to.equal(e1.clone().mul(e2).toString());
        });
        it("e1 / I should be e3 * e2", function () {
            const numer: Geometric3 = e1.clone();
            const denom: Geometric3 = I.clone();
            const ratio = numer.clone().div(denom);
            expect(ratio.toString()).to.equal(e3.clone().mul(e2).toString());
        });
    });

    describe("inv", function () {
        it("(1) should be 1", function () {
            const one: Geometric3 = Geometric3.ONE;
            const inv = one.clone().inv();
            expect(inv.equals(one)).to.equal(true);
        });
        it("(2) should be 0.5", function () {
            const two: Geometric3 = Geometric3.scalar(2);
            const inv = two.clone().inv();
            const half: Geometric3 = Geometric3.scalar(0.5);
            expect(inv.equals(half)).to.equal(true);
        });
        it("(e1) should be e1", function () {
            const e1: Geometric3 = Geometric3.E1;
            const inv = e1.clone().inv();
            expect(inv.equals(e1)).to.equal(true);
        });
        it("(2 * e1) should be 0.5 * e1", function () {
            const e1: Geometric3 = Geometric3.E1;
            const inv = e1.clone().scale(2).inv();
            const halfE1 = e1.clone().scale(0.5);
            expect(inv.equals(halfE1)).to.equal(true);
        });
        it("(e2) should be e2", function () {
            const e2: Geometric3 = Geometric3.E2;
            const inv = e2.clone().inv();
            expect(inv.equals(e2)).to.equal(true);
        });
        it("(2 * e2) should be 0.5 * e2", function () {
            const e2: Geometric3 = Geometric3.E2;
            const inv = e2.clone().scale(2).inv();
            const halfE2 = e2.clone().scale(0.5);
            expect(inv.equals(halfE2)).to.equal(true);
        });
        it("(e3) should be e3", function () {
            const e3: Geometric3 = Geometric3.E3;
            const inv = e3.clone().inv();
            expect(inv.equals(e3)).to.equal(true);
        });
        it("(2 * e3) should be 0.5 * e3", function () {
            const e3: Geometric3 = Geometric3.E3;
            const inv = e3.clone().scale(2).inv();
            const halfE3 = e3.clone().scale(0.5);
            expect(inv.equals(halfE3)).to.equal(true);
        });
        it("(I) should be -I", function () {
            const e1: Geometric3 = Geometric3.E1;
            const e2: Geometric3 = Geometric3.E2;
            const e3: Geometric3 = Geometric3.E3;
            const I = e1.clone().mul(e2).mul(e3);
            const inv = I.clone().inv();
            const minusI = I.clone().neg();
            expect(inv.equals(minusI)).to.equal(true);
        });
        it("(2 * I) should be -0.5 * I", function () {
            const e1: Geometric3 = Geometric3.E1;
            const e2: Geometric3 = Geometric3.E2;
            const e3: Geometric3 = Geometric3.E3;
            const I = e1.clone().mul(e2).mul(e3);
            const inv = I.clone().scale(2).inv();
            const minusHalfI = I.clone().neg().scale(0.5);
            expect(inv.equals(minusHalfI)).to.equal(true);
        });
    });

    describe("maskG3", function () {
        it("0 => 0x0", function () {
            expect(Geometric3.ZERO.maskG3).to.equal(0x0);
        });
        it("1 => 0x1", function () {
            expect(Geometric3.ONE.maskG3).to.equal(0x1);
        });
        it("e1 => 0x2", function () {
            expect(e1.maskG3).to.equal(0x2);
        });
        it("e2 => 0x2", function () {
            expect(e2.maskG3).to.equal(0x2);
        });
        it("e3 => 0x2", function () {
            expect(e3.maskG3).to.equal(0x2);
        });
        it("1+e1 => 0x3", function () {
            expect(e1.clone().addScalar(1).maskG3).to.equal(0x3);
        });
        it("e1 ^ e2 => 0x4", function () {
            expect(Geometric3.wedge(e1, e2).maskG3).to.equal(0x4);
        });
        it("e2 ^ e3 => 0x4", function () {
            expect(Geometric3.wedge(e2, e3).maskG3).to.equal(0x4);
        });
        it("e3 ^ e1 => 0x4", function () {
            expect(Geometric3.wedge(e3, e1).maskG3).to.equal(0x4);
        });
        it("rotorFromDirections(e1, e2) => 0x5", function () {
            expect(Geometric3.rotorFromDirections(e1, e2).maskG3).to.equal(0x5);
        });
        it("pseudoscalar => 0x8", function () {
            const I = Geometric3.pseudo(1);
            expect(I.maskG3).to.equal(0x8);
        });
    });

    describe("rotorFromAxisAngle", function () {
        describe("(e3, PI)", function () {
            const axis: VectorE3 = e3;
            const R = Geometric3.random();
            R.rotorFromAxisAngle(axis, Math.PI);
            R.approx(12);
            it("should equal e2 ^ e1", function () {
                expect(R.equals(e2.clone().ext(e1))).to.be.true;
            });
        });
        describe("(e3, PI/2)", function () {
            const axis: VectorE3 = e3;
            const R = Geometric3.random();
            R.rotorFromAxisAngle(axis, Math.PI / 2);
            R.approx(12);
            it("should equal (1-e1e2)/sqrt(2)", function () {
                expect(R.a).to.be.closeTo(1 / Math.sqrt(2), 15);
                expect(R.x).to.equal(0);
                expect(R.y).to.equal(0);
                expect(R.z).to.equal(0);
                expect(R.yz).to.equal(0);
                expect(R.zx).to.equal(0);
                expect(R.xy).to.be.closeTo(-1 / Math.sqrt(2), 17);
                expect(R.b).to.equal(0);
            });
        });
        describe("(2 * e3, PI)", function () {
            const axis: VectorE3 = e3.clone().scale(2);
            const R = Geometric3.random();
            R.rotorFromAxisAngle(axis, Math.PI);
            R.approx(12);
            it("should equal e2 ^ e1", function () {
                expect(R.equals(e2.clone().ext(e1))).to.be.true;
            });
        });
    });

    describe("rotorFromDirections", function () {
        const cosPIdiv4 = Math.cos(Math.PI / 4);
        const sinPIdiv4 = Math.sin(Math.PI / 4);
        describe("from +e1", function () {
            it("to +e1", function () {
                const R = Geometric3.rotorFromDirections(e1, e1);
                expect(R.a).to.equal(1);
                expect(R.x).to.equal(0);
                expect(R.y).to.equal(0);
                expect(R.z).to.equal(0);
                expect(R.yz).to.equal(0);
                expect(R.zx).to.equal(0);
                expect(R.xy).to.equal(0);
            });
            it("to +e2", function () {
                const R = Geometric3.rotorFromDirections(e1, e2);
                expect(R.a).to.equal(cosPIdiv4);
                expect(R.x).to.equal(0);
                expect(R.y).to.equal(0);
                expect(R.z).to.equal(0);
                expect(R.yz).to.equal(0);
                expect(R.zx).to.equal(0);
                expect(R.xy).to.equal(-sinPIdiv4);
            });
            it("to +e3", function () {
                const R = Geometric3.rotorFromDirections(e1, e3);
                expect(R.a).to.equal(cosPIdiv4);
                expect(R.x).to.equal(0);
                expect(R.y).to.equal(0);
                expect(R.z).to.equal(0);
                expect(R.yz).to.equal(0);
                expect(R.zx).to.equal(sinPIdiv4);
                expect(R.xy).to.equal(0);
            });
            it("to -e1", function () {
                const R = Geometric3.rotorFromDirections(e1, e1.clone().neg());
                const V = e1.clone().rotate(R);
                expect(V.a).to.equal(0);
                expect(V.x).to.equal(-1);
                expect(V.y).to.equal(0);
                expect(V.z).to.equal(0);
                expect(V.yz).to.equal(0);
                expect(V.zx).to.equal(0);
                expect(V.xy).to.equal(0);
            });
            it("to -e2", function () {
                const R = Geometric3.rotorFromDirections(e1, e2.clone().neg());
                expect(R.a).to.equal(cosPIdiv4);
                expect(R.x).to.equal(0);
                expect(R.y).to.equal(0);
                expect(R.z).to.equal(0);
                expect(R.yz).to.equal(0);
                expect(R.zx).to.equal(0);
                expect(R.xy).to.equal(sinPIdiv4);
            });
            it("to -e3", function () {
                const R = Geometric3.rotorFromDirections(e1, e3.clone().neg());
                expect(R.a).to.equal(cosPIdiv4);
                expect(R.x).to.equal(0);
                expect(R.y).to.equal(0);
                expect(R.z).to.equal(0);
                expect(R.yz).to.equal(0);
                expect(R.zx).to.equal(-sinPIdiv4);
                expect(R.xy).to.equal(0);
            });
        });
        describe("from -e1", function () {
            it("to +e1", function () {
                const R = Geometric3.rotorFromDirections(e1.clone().neg(), e1);
                const V = e1.clone().neg().rotate(R);
                expect(V.a).to.equal(0);
                expect(V.x).to.equal(1);
                expect(V.y).to.equal(0);
                expect(V.z).to.equal(0);
                expect(V.yz).to.equal(0);
                expect(V.zx).to.equal(0);
                expect(V.xy).to.equal(0);
            });
            it("to +e2", function () {
                const R = Geometric3.rotorFromDirections(e1.clone().neg(), e2);
                expect(R.a).to.equal(cosPIdiv4);
                expect(R.x).to.equal(0);
                expect(R.y).to.equal(0);
                expect(R.z).to.equal(0);
                expect(R.yz).to.equal(0);
                expect(R.zx).to.equal(0);
                expect(R.xy).to.equal(sinPIdiv4);
            });
            it("to +e3", function () {
                const R = Geometric3.rotorFromDirections(e1.clone().neg(), e3);
                expect(R.a).to.equal(cosPIdiv4);
                expect(R.x).to.equal(0);
                expect(R.y).to.equal(0);
                expect(R.z).to.equal(0);
                expect(R.yz).to.equal(0);
                expect(R.zx).to.equal(-sinPIdiv4);
                expect(R.xy).to.equal(0);
            });
        });
        it("(+e2, +e1)", function () {
            const R = Geometric3.rotorFromDirections(e2, e1);
            expect(R.a).to.equal(cosPIdiv4);
            expect(R.x).to.equal(0);
            expect(R.y).to.equal(0);
            expect(R.z).to.equal(0);
            expect(R.yz).to.equal(0);
            expect(R.zx).to.equal(0);
            expect(R.xy).to.equal(+sinPIdiv4);
        });
        it("(+e2, -e1)", function () {
            const R = Geometric3.rotorFromDirections(e2, e1.clone().neg());
            expect(R.a).to.equal(cosPIdiv4);
            expect(R.x).to.equal(0);
            expect(R.y).to.equal(0);
            expect(R.z).to.equal(0);
            expect(R.yz).to.equal(0);
            expect(R.zx).to.equal(0);
            expect(R.xy).to.equal(-sinPIdiv4);
        });
        it("(+e2, +e2)", function () {
            const R = Geometric3.rotorFromDirections(e2, e2);
            expect(R.a).to.equal(1);
            expect(R.x).to.equal(0);
            expect(R.y).to.equal(0);
            expect(R.z).to.equal(0);
            expect(R.yz).to.equal(0);
            expect(R.zx).to.equal(0);
            expect(R.xy).to.equal(0);
        });
        it("(+e2, +e3)", function () {
            const R = Geometric3.rotorFromDirections(e2, e3);
            expect(R.a).to.equal(cosPIdiv4);
            expect(R.x).to.equal(0);
            expect(R.y).to.equal(0);
            expect(R.z).to.equal(0);
            expect(R.yz).to.equal(-sinPIdiv4);
            expect(R.zx).to.equal(0);
            expect(R.xy).to.equal(0);
        });
        it("(+e2, -e3)", function () {
            const R = Geometric3.rotorFromDirections(e2, e3.clone().neg());
            expect(R.a).to.equal(cosPIdiv4);
            expect(R.x).to.equal(0);
            expect(R.y).to.equal(0);
            expect(R.z).to.equal(0);
            expect(R.yz).to.equal(sinPIdiv4);
            expect(R.zx).to.equal(0);
            expect(R.xy).to.equal(0);
        });
        it("(+e3, +e1)", function () {
            const R = Geometric3.rotorFromDirections(e3, e1);
            expect(R.a).to.equal(cosPIdiv4);
            expect(R.x).to.equal(0);
            expect(R.y).to.equal(0);
            expect(R.z).to.equal(0);
            expect(R.yz).to.equal(0);
            expect(R.zx).to.equal(-sinPIdiv4);
            expect(R.xy).to.equal(0);
        });
        it("(+e3, -e1)", function () {
            const R = Geometric3.rotorFromDirections(e3, e1.clone().neg());
            expect(R.a).to.equal(cosPIdiv4);
            expect(R.x).to.equal(0);
            expect(R.y).to.equal(0);
            expect(R.z).to.equal(0);
            expect(R.yz).to.equal(0);
            expect(R.zx).to.equal(sinPIdiv4);
            expect(R.xy).to.equal(0);
        });
        it("(+e3, +e2)", function () {
            const R = Geometric3.rotorFromDirections(e3, e2);
            expect(R.a).to.equal(cosPIdiv4);
            expect(R.x).to.equal(0);
            expect(R.y).to.equal(0);
            expect(R.z).to.equal(0);
            expect(R.yz).to.equal(+sinPIdiv4);
            expect(R.zx).to.equal(0);
            expect(R.xy).to.equal(0);
        });
        it("(+e3, -e2)", function () {
            const R = Geometric3.rotorFromDirections(e3, e2.clone().neg());
            expect(R.a).to.equal(cosPIdiv4);
            expect(R.x).to.equal(0);
            expect(R.y).to.equal(0);
            expect(R.z).to.equal(0);
            expect(R.yz).to.equal(-sinPIdiv4);
            expect(R.zx).to.equal(0);
            expect(R.xy).to.equal(0);
        });
        it("(+e3, +e3)", function () {
            const R = Geometric3.rotorFromDirections(e3, e3);
            expect(R.a).to.equal(1);
            expect(R.x).to.equal(0);
            expect(R.y).to.equal(0);
            expect(R.z).to.equal(0);
            expect(R.yz).to.equal(0);
            expect(R.zx).to.equal(0);
            expect(R.xy).to.equal(0);
        });
        it("(+e2, -e2)", function () {
            const R = Geometric3.rotorFromDirections(e2, e2.clone().neg());
            const V = e2.clone().rotate(R);
            expect(V.a).to.equal(0);
            expect(V.x).to.equal(0);
            expect(V.y).to.equal(-1);
            expect(V.z).to.equal(0);
            expect(V.yz).to.equal(0);
            expect(V.zx).to.equal(0);
            expect(V.xy).to.equal(0);
        });
        it("(-e2, +e2)", function () {
            const R = Geometric3.rotorFromDirections(e2.clone().neg(), e2);
            const V = e2.clone().neg().rotate(R);
            expect(V.a).to.equal(0);
            expect(V.x).to.equal(0);
            expect(V.y).to.equal(1);
            expect(V.z).to.equal(0);
            expect(V.yz).to.equal(0);
            expect(V.zx).to.equal(0);
            expect(V.xy).to.equal(0);
        });
        it("(+e3, -e3)", function () {
            const R = Geometric3.rotorFromDirections(e3, e3.clone().neg());
            const V = e3.clone().rotate(R);
            expect(V.a).to.equal(0);
            expect(V.x).to.equal(0);
            expect(V.y).to.equal(0);
            expect(V.z).to.equal(-1);
            expect(V.yz).to.equal(0);
            expect(V.zx).to.equal(0);
            expect(V.xy).to.equal(0);
        });
        it("(-e3, +e3)", function () {
            const R = Geometric3.rotorFromDirections(e3.clone().neg(), e3);
            const V = e3.clone().neg().rotate(R);
            expect(V.a).to.equal(0);
            expect(V.x).to.equal(0);
            expect(V.y).to.equal(0);
            expect(V.z).to.equal(1);
            expect(V.yz).to.equal(0);
            expect(V.zx).to.equal(0);
            expect(V.xy).to.equal(0);
        });
        it("(random, random) should be rotor that rotates a to b", function () {
            const a = Geometric3.random().grade(1).normalize();
            const b = Geometric3.random().grade(1).normalize();
            const R = Geometric3.rotorFromDirections(a, b);
            const V = a.clone().rotate(R);
            expect(V.a).to.equal(0);
            expect(V.x).to.be.closeTo(b.x, 13);
            expect(V.y).to.be.closeTo(b.y, 13);
            expect(V.z).to.be.closeTo(b.z, 13);
            expect(V.yz).to.equal(0);
            expect(V.zx).to.equal(0);
            expect(V.xy).to.equal(0);
        });
    });

    describe("rotorFromFrameToFrame", function () {
        it("[e1, e2, e3] to [e1, e2, e3] should be 1", function () {
            const R = Geometric3.rotorFromFrameToFrame([e1, e2, e3], [e1, e2, e3]);
            expect(R.a).to.equal(1);
            expect(R.x).to.equal(0);
            expect(R.y).to.equal(0);
            expect(R.z).to.equal(0);
            expect(R.yz).to.equal(0);
            expect(R.zx).to.equal(0);
            expect(R.xy).to.equal(0);
            expect(R.b).to.equal(0);
        });
        it("[e2, e3, e1] to [e3, e2, -e1]", function () {
            const R = Geometric3.rotorFromFrameToFrame(
                [e2, e3, e1],
                [e3, e2, e1.__neg__()]
            );
            const f1 = e2.clone().rotate(R);
            expect(f1.x).to.be.closeTo(e3.x, 14);
            expect(f1.y).to.be.closeTo(e3.y, 14);
            expect(f1.z).to.be.closeTo(e3.z, 14);
            const f2 = e3.clone().rotate(R);
            expect(f2.x).to.be.closeTo(e2.x, 14);
            expect(f2.y).to.be.closeTo(e2.y, 14);
            expect(f2.z).to.be.closeTo(e2.z, 14);
        });
    });

    describe("rotorFrmGeneratorAngle", function () {
        describe("(e1 ^ e2, PI)", function () {
            const B: BivectorE3 = e1.clone().ext(e2);
            const R = Geometric3.random();
            R.rotorFromGeneratorAngle(B, Math.PI);
            R.approx(12);
            it("shoud equal e2 ^ e1", function () {
                expect(R.equals(e2.clone().ext(e1))).to.be.true;
            });
        });
        describe("(2  e1 ^ e2, PI/2)", function () {
            const B = e1.clone().ext(e2).scale(2);
            const R = Geometric3.scalar(1)
                .addVector(e1)
                .addVector(e2)
                .addVector(e3)
                .addPseudo(1)
                .add(B);
            R.rotorFromGeneratorAngle(B, Math.PI / 2);
            R.approx(12);
            it("shoud equal e2 ^ e1", function () {
                expect(R.equals(e2.clone().ext(e1))).to.be.true;
            });
        });
    });

    describe("reflect", function () {
        const n = Vector3.vector(1, 0, 0);
        const a = Geometric3.vector(2, 3, 0);
        const chain = a.reflect(n);

        it("shoud reflect (2,3)", function () {
            expect(a.x).to.equal(-2);
            expect(a.y).to.equal(+3);
            expect(a.z).to.equal(0);
        });
        it("shold be chainable", function () {
            expect(chain === a).to.equal(true);
        });
        describe("(n)", function () {
            const S = Geometric3.random();
            const n = Geometric3.random().grade(1).normalize();
            /**
             * The 'Test' result using the specialized method.
             */
            const T = S.clone().reflect(n);
            /**
             * The 'Control' value computed explicitly as C = -n * S * n
             */
            const C = n.clone().mul(S).mul(n).scale(-1);

            it("shoud be -n * M * n", function () {
                expect(T.a).to.be.closeTo(C.a, PRECISION);
                expect(T.x).to.be.closeTo(C.x, PRECISION);
                expect(T.y).to.be.closeTo(C.y, PRECISION);
                expect(T.z).to.be.closeTo(C.z, PRECISION);
                expect(T.yz).to.be.closeTo(C.yz, PRECISION);
                expect(T.zx).to.be.closeTo(C.zx, PRECISION);
                expect(T.xy).to.be.closeTo(C.xy, PRECISION);
                expect(T.b).to.be.closeTo(C.b, PRECISION);
            });
        });
        describe("one reflected in e1", reflectSpec(one, e1));
        describe("one reflected in e2", reflectSpec(one, e2));
        describe("one reflected in e3", reflectSpec(one, e3));

        describe("e1 reflected in e1", reflectSpec(e1, e1));
        describe("e1 reflected in e2", reflectSpec(e1, e2));
        describe("e1 reflected in e3", reflectSpec(e1, e3));

        describe("e2 reflected in e1", reflectSpec(e2, e1));
        describe("e2 reflected in e2", reflectSpec(e2, e2));
        describe("e2 reflected in e3", reflectSpec(e2, e3));

        describe("e3 reflected in e1", reflectSpec(e3, e1));
        describe("e3 reflected in e2", reflectSpec(e3, e2));
        describe("e3 reflected in e3", reflectSpec(e3, e3));

        describe("e12 reflected in e1", reflectSpec(e12, e1));
        describe("e12 reflected in e2", reflectSpec(e12, e2));
        describe("e12 reflected in e3", reflectSpec(e12, e3));

        describe("e23 reflected in e1", reflectSpec(e23, e1));
        describe("e23 reflected in e2", reflectSpec(e23, e2));
        describe("e23 reflected in e3", reflectSpec(e23, e3));

        describe("e31 reflected in e1", reflectSpec(e31, e1));
        describe("e31 reflected in e2", reflectSpec(e31, e2));
        describe("e31 reflected in e3", reflectSpec(e31, e3));

        describe("I reflected in e1", reflectSpec(I, e1));
        describe("I reflected in e2", reflectSpec(I, e2));
        describe("I reflected in e3", reflectSpec(I, e3));
    });

    describe("stress", function () {
        const stress = Vector3.vector(7, 11, 13);
        const position = Geometric3.vector(2, 3, 5);
        const chain = position.stress(stress);

        it("should piece-wise multiply grde 1 components", function () {
            expect(position.x).to.equal(14);
            expect(position.y).to.equal(33);
            expect(position.z).to.equal(65);
        });
        it("shold be chainable", function () {
            expect(chain === position).to.equal(true);
        });
    });

    describe("__add__", function () {
        describe("(Geometric3, Geometric3)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Geometric3.random();
            const rhG = r.clone();
            const a = l.__add__(r);
            const b = lhG.clone().add(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });

        describe("(Geomtric3, Vector3)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Vector3.random();
            const rhG = Geometric3.fromVector(r);
            const a = l.__add__(r);
            const b = lhG.clone().add(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });
        describe("(Geomtric3, Spinor3)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Spinor3.random();
            const rhG = Geometric3.fromSpinor(r);
            const a = l.__add__(r);
            const b = lhG.clone().add(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });
        describe("(Geoetric3, number)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Math.random();
            const rhG = Geometric3.scalar(r);
            const a = l.__add__(r);
            const b = lhG.clone().add(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });
    });

    describe("__sub__", function () {
        describe("(Geometrc3, Geometric3)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Geometric3.random();
            const rhG = r.clone();
            const a = l.__sub__(r);
            const b = lhG.clone().sub(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });

        describe("(Geomtric3, Vector3)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Vector3.random();
            const rhG = Geometric3.fromVector(r);
            const a = l.__sub__(r);
            const b = lhG.clone().sub(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });

        describe("(Geomtric3, Spinor3)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Spinor3.random();
            const rhG = Geometric3.fromSpinor(r);
            const a = l.__sub__(r);
            const b = lhG.clone().sub(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });

        describe("(Geoetric3, number)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Math.random();
            const rhG = Geometric3.scalar(r);
            const a = l.__sub__(r);
            const b = lhG.clone().sub(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });
    });

    describe("__mul__", function () {
        describe("(Geometrc3, Geometric3)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Geometric3.random();
            const rhG = r.clone();
            const a = l.__mul__(r);
            const b = lhG.clone().mul(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });

        describe("(Geomtric3, Vector3)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Vector3.random();
            const rhG = Geometric3.fromVector(r);
            const a = l.__mul__(r);
            const b = lhG.clone().mul(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });

        describe("(Geomtric3, Spinor3)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Spinor3.random();
            const rhG = Geometric3.fromSpinor(r);
            const a = l.__mul__(r);
            const b = lhG.clone().mul(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });

        describe("(Geoetric3, number)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Math.random();
            const rhG = Geometric3.scalar(r);
            const a = l.__mul__(r);
            const b = lhG.clone().mul(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });
    });

    describe("__div__", function () {
        describe("(Geometrc3, Geometric3)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Geometric3.random();
            const rhG = r.clone();
            const a = l.__div__(r);
            const b = lhG.clone().div(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });

        describe("(Geomtric3, Vector3)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Vector3.random();
            const rhG = Geometric3.fromVector(r);
            const a = l.__div__(r);
            const b = lhG.clone().div(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });

        describe("(Geomtric3, Spinor3)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Spinor3.random();
            const rhG = Geometric3.fromSpinor(r);
            const a = l.__div__(r);
            const b = lhG.clone().div(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });

        describe("(Geoetric3, number)", function () {
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Math.random();
            const rhG = Geometric3.scalar(r);
            const a = l.__div__(r);
            const b = lhG.clone().div(rhG);
            it("α", function () {
                expect(a.a).to.equal(b.a);
            });
            it("x", function () {
                expect(a.x).to.equal(b.x);
            });
            it("y", function () {
                expect(a.y).to.equal(b.y);
            });
            it("z", function () {
                expect(a.z).to.equal(b.z);
            });
            it("yz", function () {
                expect(a.yz).to.equal(b.yz);
            });
            it("zx", function () {
                expect(a.zx).to.equal(b.zx);
            });
            it("xy", function () {
                expect(a.xy).to.equal(b.xy);
            });
            it("β", function () {
                expect(a.b).to.equal(b.b);
            });
        });
    });

    describe("copySpinor", function () {
        const target = Geometric3.random();
        const a = Math.random();
        const yz = Math.random();
        const zx = Math.random();
        const xy = Math.random();
        const spinor = Geometric3.spinor(yz, zx, xy, a);
        target.copySpinor(spinor);
        describe("should copy spinor components andzero out others", function () {
            it("a", function () {
                expect(target.a).to.equal(spinor.a);
            });
            it("x", function () {
                expect(target.x).to.equal(0);
            });
            it("y", function () {
                expect(target.y).to.equal(0);
            });
            it("z", function () {
                expect(target.z).to.equal(0);
            });
            it("yz", function () {
                expect(target.yz).to.equal(yz);
            });
            it("zx", function () {
                expect(target.zx).to.equal(zx);
            });
            it("xy", function () {
                expect(target.xy).to.equal(xy);
            });
            it("b", function () {
                expect(target.b).to.equal(0);
            });
        });
    });

    describe("copyVector", function () {
        const target = Geometric3.random();
        const x = Math.random();
        const y = Math.random();
        const z = Math.random();
        const vector = Geometric3.vector(x, y, z);
        target.copyVector(vector);
        describe("should copy vector components andzero out others", function () {
            it("a", function () {
                expect(target.a).to.equal(0);
            });
            it("x", function () {
                expect(target.x).to.equal(x);
            });
            it("y", function () {
                expect(target.y).to.equal(y);
            });
            it("z", function () {
                expect(target.z).to.equal(z);
            });
            it("yz", function () {
                expect(target.yz).to.equal(0);
            });
            it("zx", function () {
                expect(target.zx).to.equal(0);
            });
            it("xy", function () {
                expect(target.xy).to.equal(0);
            });
            it("b", function () {
                expect(target.b).to.equal(0);
            });
        });
    });
});
