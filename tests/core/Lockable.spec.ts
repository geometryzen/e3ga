import { expect } from 'chai';
import { LockableMixin } from '../../src/core/Lockable';
import { applyMixins } from '../../src/utils/applyMixins';

/**
 * WARNING: property getter and setter don't work with this mixin approach.
 * Notice that isLocked is now a standard function.
 * @hidden
 */
class HAL implements LockableMixin {
    // Lockable
    isLocked: () => boolean;
    lock: () => number;
    unlock: (token: number) => void;

    changeMe(): void {
        if (this.isLocked()) {
            throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");
        }
    }
}
applyMixins(HAL, [LockableMixin]);

describe("Lockable", function () {
    describe("mixin", function () {
        const chameleon = new HAL();
        it("isLocked should ", function () {
            // expect(typeof chameleon.isLocked).to.be.a('function');
            expect(chameleon.isLocked()).to.be.false;
            chameleon.changeMe();
            chameleon.lock();
            expect(chameleon.isLocked()).to.be.true;
            expect(function () {
                chameleon.changeMe();
            }).to.throw(Error, "I'm sorry, Dave. I'm afraid I can't do that.");
        });
    });
});
