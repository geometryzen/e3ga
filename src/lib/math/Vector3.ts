import { VectorN } from '../atoms/VectorN';
import { isDefined } from '../checks/isDefined';
import { isNumber } from '../checks/isNumber';
import { lock, LockableMixin as Lockable, TargetLockedError } from '../core/Lockable';
import { readOnly } from '../i18n/readOnly';
import { applyMixins } from '../utils/applyMixins';
import { approx } from './approx';
import { BivectorE3 } from './BivectorE3';
import { CartesianG3 } from './CartesianG3';
import { dotVectorE3 } from './dotVectorE3';
import { randomRange } from './randomRange';
import { SpinorE3 } from './SpinorE3';
import { toStringCustom } from './toStringCustom';
import { VectorE3 } from './VectorE3';
import { wedgeXY } from './wedgeXY';
import { wedgeYZ } from './wedgeYZ';
import { wedgeZX } from './wedgeZX';

const sqrt = Math.sqrt;

const COORD_X = 0;
const COORD_Y = 1;
const COORD_Z = 2;
const BASIS_LABELS = ['e1', 'e2', 'e3'];

/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m: VectorE3): number[] {
    return [m.x, m.y, m.z];
}

/**
 * @hidden
 */
export class Vector3 implements CartesianG3, VectorE3, Lockable, VectorN<number> {
    // Lockable
    isLocked: () => boolean;
    lock: () => number;
    unlock: (token: number) => void;

    /**
     * 
     */
    private coords_: number[];

    /**
     * 
     */
    private modified_: boolean;

    /**
     * @param a
     * @param b
     */
    public static dot(a: VectorE3, b: VectorE3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    /**
     * Initializes the vector to the specified coordinates and modification state.
     * The returned vector is not locked.
     * @param coords Three numbers corresponding to the x, y, and z coordinates. Default is [0, 0, 0].
     * @param modified The modification state. Default is false.
     */
    constructor(coords: [number, number, number] = [0, 0, 0], modified = false) {
        this.coords_ = coords;
        this.modified_ = modified;
    }

    get length(): number {
        return 3;
    }

    get modified(): boolean {
        return this.modified_;
    }
    set modified(modified: boolean) {
        if (this.isLocked()) {
            throw new TargetLockedError('set modified');
        }
        this.modified_ = modified;
    }

    getComponent(i: number): number {
        return this.coords_[i];
    }

    /**
     * The coordinate corresponding to the e1 basis vector.
     */
    get x(): number {
        return this.coords_[COORD_X];
    }
    set x(value: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set x');
        }
        const coords = this.coords_;
        this.modified_ = this.modified_ || coords[COORD_X] !== value;
        coords[COORD_X] = value;
    }

    /**
     * The coordinate corresponding to the e2 basis vector.
     */
    get y(): number {
        return this.coords_[COORD_Y];
    }
    set y(value: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set y');
        }
        const coords = this.coords_;
        this.modified_ = this.modified_ || coords[COORD_Y] !== value;
        coords[COORD_Y] = value;
    }

    /**
     * The coordinate corresponding to the e3 basis vector.
     */
    get z(): number {
        return this.coords_[COORD_Z];
    }
    set z(value: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set z');
        }
        const coords = this.coords_;
        this.modified_ = this.modified_ || coords[COORD_Z] !== value;
        coords[COORD_Z] = value;
    }

    /**
     *
     */
    get maskG3(): number {
        return this.isZero() ? 0x0 : 0x2;
    }
    set maskG3(unused: number) {
        throw new Error(readOnly('maskG3').message);
    }

    /**
     * <p>
     * <code>this ??? this + vector * ??</code>
     * </p>
     *
     * @param vector
     * @param ??
     * @return <code>this</code>
     * @chainable
     */
    add(vector: VectorE3, ?? = 1): this {
        this.x += vector.x * ??;
        this.y += vector.y * ??;
        this.z += vector.z * ??;
        return this;
    }

    /**
     *
     */
    approx(n: number): Vector3 {
        approx(this.coords_, n);
        return this;
    }

    /**
     * <p>
     * <code>this ??? - n * this * n</code>
     * </p>
     *
     * @method reflect
     * @param n {VectorE3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): this {
        const ax = this.x;
        const ay = this.y;
        const az = this.z;
        const nx = n.x;
        const ny = n.y;
        const nz = n.z;
        const dot2 = (ax * nx + ay * ny + az * nz) * 2;
        this.x = ax - dot2 * nx;
        this.y = ay - dot2 * ny;
        this.z = az - dot2 * nz;
        return this;
    }

    /**
     * @param R
     * @returns R * this * reverse(R)
     */
    rotate(R: SpinorE3): Vector3 {
        const x = this.x;
        const y = this.y;
        const z = this.z;

        const a = R.xy;
        const b = R.yz;
        const c = R.zx;
        const w = R.a;

        const ix = w * x - c * z + a * y;
        const iy = w * y - a * x + b * z;
        const iz = w * z - b * y + c * x;
        const iw = b * x + c * y + a * z;

        this.x = ix * w + iw * b + iy * a - iz * c;
        this.y = iy * w + iw * c + iz * b - ix * a;
        this.z = iz * w + iw * a + ix * c - iy * b;

        return this;
    }

    /**
     * @method clone
     * @return {Vector3} <code>copy(this)</code>
     */
    clone(): Vector3 {
        return new Vector3([this.x, this.y, this.z], this.modified_);
    }

    /**
     * this ??? copy(source)
     *
     * @returns copy(this)
     */
    copy(source: VectorE3): this {
        if (source) {
            this.x = source.x;
            this.y = source.y;
            this.z = source.z;
            return this;
        }
        else {
            throw new Error("source for copy must be a vector");
        }
    }

    /**
     * Copies the coordinate values into this <code>Vector3</code>.
     *
     * @param coordinates {number[]}
     * @returns
     */
    copyCoordinates(coordinates: number[]): this {
        // Copy using the setters so that the modified flag is updated.
        this.x = coordinates[COORD_X];
        this.y = coordinates[COORD_Y];
        this.z = coordinates[COORD_Z];
        return this;
    }

    /**
     * <p>
     * <code>this ??? this ??? v</code>
     * </p>
     *
     * @method cross
     * @param v {VectorE3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    cross(v: VectorE3): Vector3 {
        return this.cross2(this, v);
    }

    /**
     * <code>this ??? a ??? b</code>
     *
     * @param a
     * @param b
     * @returns a x b
     */
    cross2(a: VectorE3, b: VectorE3): Vector3 {

        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;

        this.x = wedgeYZ(ax, ay, az, bx, by, bz);
        this.y = wedgeZX(ax, ay, az, bx, by, bz);
        this.z = wedgeXY(ax, ay, az, bx, by, bz);
        return this;
    }

    /**
     * @method distanceTo
     * @param point {VectorE3}
     * @return {number}
     */
    distanceTo(point: VectorE3): number {
        if (isDefined(point)) {
            return sqrt(this.quadranceTo(point));
        }
        else {
            return void 0;
        }
    }

    /**
     * @method quadranceTo
     * @param point {VectorE3}
     * @return {number}
     */
    quadranceTo(point: VectorE3): number {
        if (isDefined(point)) {
            const dx = this.x - point.x;
            const dy = this.y - point.y;
            const dz = this.z - point.z;
            return dx * dx + dy * dy + dz * dz;
        }
        else {
            return void 0;
        }
    }

    /**
     * <p>
     * <code>this ??? this / ??</code>
     * </p>
     * @method divByScalar
     * @param ?? {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    divByScalar(??: number) {
        if (?? !== 0) {
            let invScalar = 1 / ??;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
        }
        else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    }

    /**
     * @method dot
     * @param v {VectorE3}
     * @return {number}
     */
    dot(v: VectorE3): number {
        return Vector3.dot(this, v);
    }

    /**
     * <p>
     * <code>this ??? I * B</code>
     * </p>
     *
     * Sets this vector to the dual of the bivector, B.
     * If changeSign is <code>true</code>, the direction of the resulting vector is reversed.
     *
     * @method dual
     * @param B {SpinorE3}
     * @param changeSign {boolean}
     * @return {Vector3}
     * @chainable
     */
    dual(B: SpinorE3, changeSign: boolean): Vector3 {
        if (changeSign) {
            this.x = B.yz;
            this.y = B.zx;
            this.z = B.xy;
        }
        else {
            this.x = -B.yz;
            this.y = -B.zx;
            this.z = -B.xy;
        }
        return this;
    }

    /**
     * @method equals
     * @param other {any}
     * @return {boolean}
     */
    equals(other: any): boolean {
        if (other instanceof Vector3) {
            return this.x === other.x && this.y === other.y && this.z === other.z;
        }
        else {
            return false;
        }
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        return this.x === 0 && this.y === 0 && this.z === 0;
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     *
     * @method magnitude
     * @return {number}
     */
    magnitude(): number {
        return sqrt(this.squaredNorm());
    }

    /**
     * @method neg
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    neg() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    /**
     * <p>
     * <code>this ??? this + ?? * (target - this)</code>
     * </p>
     *
     * @method lerp
     * @param target {VectorE3}
     * @param ?? {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    lerp(target: VectorE3, ??: number) {
        this.x += (target.x - this.x) * ??;
        this.y += (target.y - this.y) * ??;
        this.z += (target.z - this.z) * ??;
        return this;
    }

    /**
     * <p>
     * <code>this ??? a + ?? * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param ?? {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    lerp2(a: VectorE3, b: VectorE3, ??: number) {
        this.copy(a).lerp(b, ??);
        return this;
    }

    /**
     * <p>
     * <code>this ??? this / norm(this)</code>
     * </p>
     *
     * @method normalize
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    normalize(): Vector3 {
        const m = this.magnitude();
        if (m !== 0) {
            return this.divByScalar(m);
        }
        else {
            return this.zero();
        }
    }

    /**
     * <p>
     * <code>this ??? this * ??</code>
     * </p>
     *
     * @method scale
     * @param ?? {number} 
     */
    scale(??: number): Vector3 {
        this.x *= ??;
        this.y *= ??;
        this.z *= ??;
        return this;
    }

    /**
     * @method stress
     * @param ?? {VectorE3}
     * @return Vector3
     */
    stress(??: VectorE3) {
        this.x *= ??.x;
        this.y *= ??.y;
        this.z *= ??.z;
        return this;
    }

    /**
     * <p>
     * <code>this ??? this</code>, with components modified.
     * </p>
     *
     * @method set
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    setXYZ(x: number, y: number, z: number): this {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * Returns the (Euclidean) inner product of this vector with itself.
     *
     * @method squaredNorm
     * @return {number} <code>this ??? this</code> or <code>norm(this) * norm(this)</code>
     */
    squaredNorm(): number {
        // quad = scp(v, rev(v)) = scp(v, v)
        // TODO: This is correct but could be optimized.
        return dotVectorE3(this, this);
    }

    /**
     * <p>
     * <code>this ??? this - v</code>
     * </p>
     *
     * @method sub
     * @param v {VectorE3}
     * @param [?? = 1] {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    sub(v: VectorE3, ?? = 1): Vector3 {
        this.x -= v.x * ??;
        this.y -= v.y * ??;
        this.z -= v.z * ??;
        return this;
    }

    sub2(a: VectorE3, b: VectorE3): Vector3 {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }

    /**
     * 
     */
    toArray(): number[] {
        return coordinates(this);
    }

    /**
     * @param fractionDigits
     * @returns
     */
    toExponential(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toExponential(fractionDigits); };
        return toStringCustom(coordinates(this), coordToString, BASIS_LABELS);
    }

    /**
     * @param fractionDigits
     * @returns
     */
    toFixed(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toFixed(fractionDigits); };
        return toStringCustom(coordinates(this), coordToString, BASIS_LABELS);
    }

    /**
     * @param precision
     * @returns
     */
    toPrecision(precision?: number): string {
        const coordToString = function (coord: number): string { return coord.toPrecision(precision); };
        return toStringCustom(coordinates(this), coordToString, BASIS_LABELS);
    }

    /**
     * @param radix
     * @returns
     */
    toString(radix?: number): string {
        const coordToString = function (coord: number): string { return coord.toString(radix); };
        return toStringCustom(coordinates(this), coordToString, BASIS_LABELS);
    }

    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     */
    zero(): Vector3 {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    }

    __add__(rhs: Vector3): Vector3 {
        if (rhs instanceof Vector3) {
            return lock(this.clone().add(rhs, 1.0));
        }
        else {
            return void 0;
        }
    }

    __radd__(lhs: Vector3): Vector3 {
        if (lhs instanceof Vector3) {
            return lock(lhs.clone().add(this, 1.0));
        }
        else {
            return void 0;
        }
    }

    __sub__(rhs: Vector3): Vector3 {
        if (rhs instanceof Vector3) {
            return lock(this.clone().sub(rhs));
        }
        else {
            return void 0;
        }
    }

    __rsub__(lhs: Vector3): Vector3 {
        if (lhs instanceof Vector3) {
            return lock(lhs.clone().sub(this, 1.0));
        }
        else {
            return void 0;
        }
    }

    __mul__(rhs: number): Vector3 {
        if (isNumber(rhs)) {
            return lock(this.clone().scale(rhs));
        }
        else {
            return void 0;
        }
    }

    __div__(rhs: number): Vector3 {
        if (isNumber(rhs)) {
            return lock(this.clone().divByScalar(rhs));
        }
        else {
            return void 0;
        }
    }

    __rdiv__(lhs: any): Vector3 {
        return void 0;
    }

    __pos__(): Vector3 {
        return lock(Vector3.copy(this));
    }

    __neg__(): Vector3 {
        return lock(Vector3.copy(this).neg());
    }

    /**
     * @method copy
     * @param vector {VectorE3}
     * @return {Vector3}
     * @static
     * @chainable
     */
    static copy(vector: VectorE3): Vector3 {
        return new Vector3([vector.x, vector.y, vector.z]);
    }

    /**
     * Constructs a vector which is the dual of the supplied bivector, B.
     * dual(B) = B << inv(I)
     */
    static dual(B: BivectorE3): Vector3 {
        return new Vector3([B.yz, B.zx, B.xy]);
    }

    static e1(): Vector3 {
        return new Vector3([1, 0, 0]);
    }

    static e2(): Vector3 {
        return new Vector3([0, 1, 0]);
    }

    static e3(): Vector3 {
        return new Vector3([0, 0, 1]);
    }

    /**
     *
     */
    static isInstance(x: any): x is Vector3 {
        return x instanceof Vector3;
    }

    /**
     * @method lerp
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param ?? {number}
     * @return {Vector3} <code>a + ?? * (b - a)</code>
     * @static
     * @chainable
     */
    static lerp(a: VectorE3, b: VectorE3, ??: number): Vector3 {
        return Vector3.copy(b).sub(a).scale(??).add(a);
    }

    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     *
     * @method random
     * @return {Vector3}
     * @static
     * @chainable
     */
    static random(): Vector3 {
        const x = randomRange(-1, 1);
        const y = randomRange(-1, 1);
        const z = randomRange(-1, 1);
        return Vector3.vector(x, y, z).normalize();
    }

    /**
     * Creates a vector with the specified cartesian coordinates.
     * The returned vector is not locked.
     * The returned vector is not modified.
     * @param x The x-coordinate.
     * @param y The y-coordinate.
     * @param z The z-coordinate.
     */
    static vector(x: number, y: number, z: number): Vector3 {
        return new Vector3([x, y, z]);
    }

    /**
     * Creates a vector with all cartesian coordinates set to zero.
     * The returned vector is not locked.
     * The returned vector is not modified.
     */
    static zero(): Vector3 {
        return new Vector3([0, 0, 0]);
    }
}
applyMixins(Vector3, [Lockable]);
