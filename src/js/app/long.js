/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-bitwise */
// see` https://github.com/google/closure-library/blob/master/closure/goog/math/long.js
class Long {
  // A cache of the Long representations of small integer values.
  static IntCache = {};

  // eslint-disable-next-line no-bitwise
  static TWO_PWR_16_DBL = 1 << 16;

  // eslint-disable-next-line no-bitwise
  static TWO_PWR_24_DBL = 1 << 24;

  static TWO_PWR_32_DBL = Long.TWO_PWR_16_DBL * Long.TWO_PWR_16_DBL;

  static TWO_PWR_31_DBL = Long.TWO_PWR_32_DBL / 2;

  static TWO_PWR_48_DBL = Long.TWO_PWR_32_DBL * Long.TWO_PWR_16_DBL;

  static TWO_PWR_64_DBL = Long.TWO_PWR_32_DBL * Long.TWO_PWR_32_DBL;

  static TWO_PWR_63_DBL = Long.TWO_PWR_64_DBL / 2;

  static ZERO = Long.fromInt(0);

  static ONE = Long.fromInt(1);

  static NEG_ONE = Long.fromInt(-1);

  // eslint-disable-next-line no-bitwise
  static MAX_VALUE = Long.fromBits(0xffffffff | 0, 0x7fffffff | 0);

  // eslint-disable-next-line no-bitwise
  static MIN_VALUE = Long.fromBits(0, 0x80000000 | 0);

  // eslint-disable-next-line no-bitwise
  static TWO_PWR_24 = Long.fromInt(1 << 24);

  constructor(low, high) {
    this.low = low | 0; // force into 32 signed bits.
    this.high = high | 0; // force into 32 signed bits.
  }

  static fromInt(value) {
    if (value >= -128 && value < 128) {
      const cachedObj = this.IntCache[value];
      if (cachedObj) {
        return cachedObj;
      }
    }

    const obj = new Long(value, value < 0 ? -1 : 0);
    if (value >= -128 && value < 128) {
      this.IntCache[value] = obj;
    }
    return obj;
  }

  static fromNumber(value) {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(value) || !isFinite(value)) {
      return Long.ZERO;
    }
    if (value <= -Long.TWO_PWR_63_DBL) {
      return Long.MIN_VALUE;
    }
    if (value + 1 >= Long.TWO_PWR_63_DBL) {
      return Long.MAX_VALUE;
    }
    if (value < 0) {
      return Long.fromNumber(-value).negate();
    }
    return new Long(value % Long.TWO_PWR_32_DBL, value / Long.TWO_PWR_32_DBL);
  }

  static fromBits(lowBits, highBits) {
    return new Long(lowBits, highBits);
  }

  static fromString(str, optRadix) {
    if (str.charAt(0) === '-') {
      return Long.fromString(str.substring(1), optRadix).negate();
    }

    // We can avoid very expensive multiply based code path for some common cases.
    const numberValue = parseInt(str, optRadix || 10);
    if (numberValue <= Long.MAX_SAFE_INTEGER) {
      return new Long(
        numberValue % Long.TWO_PWR_32_DBL | 0,
        (numberValue / Long.TWO_PWR_32_DBL) | 0,
      );
    }

    if (str.length === 0) {
      throw new Error('number format error: empty string');
    }
    if (str.indexOf('-') >= 0) {
      throw new Error(`number format error: interior "-" character: ${str}`);
    }

    const radix = optRadix || 10;
    if (radix < 2 || radix > 36) {
      throw new Error(`radix out of range: ${radix}`);
    }

    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated multiply.
    const radixToPower = Long.fromNumber(radix ** 8);

    let result = Long.ZERO;
    for (let i = 0; i < str.length; i += 8) {
      const size = Math.min(8, str.length - i);
      const value = parseInt(str.substring(i, i + size), radix);
      if (size < 8) {
        const power = Long.fromNumber(radix ** size);
        result = result.multiply(power).add(Long.fromNumber(value));
      } else {
        result = result.multiply(radixToPower);
        result = result.add(Long.fromNumber(value));
      }
    }
    return result;
  }

  toInt() {
    return this.low;
  }

  getLowBitsUnsigned() {
    return this.low >= 0 ? this.low : Long.TWO_PWR_32_DBL + this.low;
  }

  toNumber() {
    return this.high * Long.TWO_PWR_32_DBL + this.getLowBitsUnsigned();
  }

  isSafeInteger() {
    const top11Bits = this.high >> 21;
    // If top11Bits are all 0s, then the number is between [0, 2^53-1]
    return (
      top11Bits === 0 ||
      // If top11Bits are all 1s, then the number is between [-1, -2^53]
      (top11Bits === -1 &&
        // and exclude -2^53
        !(this.low === 0 && this.high === (0xffe00000 | 0)))
    );
  }

  toString(optRadix) {
    const radix = optRadix || 10;
    if (radix < 2 || radix > 36) {
      throw new Error(`radix out of range: ${radix}`);
    }

    // We can avoid very expensive division based code path for some common cases.
    if (this.isSafeInteger()) {
      const asNumber = this.toNumber();
      // Shortcutting for radix 10 (common case) to avoid boxing via toString:
      // https://jsperf.com/tostring-vs-vs-if
      return radix === 10 ? `${asNumber}` : asNumber.toString(radix);
    }

    // We need to split 64bit integer into: `a * radix**safeDigits + b` where
    // neither `a` nor `b` exceeds 53 bits, meaning that safeDigits can be any
    // number in a range: [(63 - 53) / log2(radix); 53 / log2(radix)].

    // Other options that need to be benchmarked:
    //   11..16 - (radix >> 2);
    //   10..13 - (radix >> 3);
    //   10..11 - (radix >> 4);
    const safeDigits = 14 - (radix >> 2);

    const radixPowSafeDigits = radix ** safeDigits;
    const radixToPower = Long.fromBits(
      radixPowSafeDigits,
      radixPowSafeDigits / Long.TWO_PWR_32_DBL,
    );

    const remDiv = this.div(radixToPower);
    let val = Math.abs(this.subtract(remDiv.multiply(radixToPower)).toNumber());
    let digits = radix === 10 ? `${val}` : val.toString(radix);

    if (digits.length < safeDigits) {
      // Up to 13 leading 0s we might need to insert as the greatest safeDigits
      // value is 14 (for radix 2).
      digits = '0000000000000'.substr(digits.length - safeDigits) + digits;
    }

    val = remDiv.toNumber();
    return (radix === 10 ? val : val.toString(radix)) + digits;
  }

  getHighBits() {
    return this.high;
  }

  getLowBits() {
    return this.low;
  }

  getNumBitsAbs() {
    if (this.isNegative()) {
      if (this.equals(Long.MIN_VALUE)) {
        return 64;
      }
      return this.negate().getNumBitsAbs();
    }
    const val = this.high !== 0 ? this.high : this.low;
    let bit = 31;
    for (; bit > 0; bit -= 1) {
      // eslint-disable-next-line no-bitwise
      if ((val & (1 << bit)) !== 0) {
        break;
      }
    }
    return this.high !== 0 ? bit + 33 : bit + 1;
  }

  isZero() {
    return this.high === 0 && this.low === 0;
  }

  isNegative() {
    return this.high < 0;
  }

  isOdd() {
    // eslint-disable-next-line no-bitwise
    return (this.low & 1) === 1;
  }

  equals(other) {
    return this.high === other.high && this.low === other.low;
  }

  notEquals(other) {
    return this.high !== other.high || this.low !== other.low;
  }

  lessThan(other) {
    return this.compare(other) < 0;
  }

  lessThanOrEqual(other) {
    return this.compare(other) <= 0;
  }

  greaterThan(other) {
    return this.compare(other) > 0;
  }

  greaterThanOrEqual(other) {
    return this.compare(other) >= 0;
  }

  compare(other) {
    if (this.equals(other)) {
      return 0;
    }

    const thisNeg = this.isNegative();
    const otherNeg = other.isNegative();
    if (thisNeg && !otherNeg) {
      return -1;
    }
    if (!thisNeg && otherNeg) {
      return 1;
    }

    // at this point, the signs are the same, so subtraction will not overflow
    if (this.subtract(other).isNegative()) {
      return -1;
    }
    return 1;
  }

  negate() {
    if (this.equals(Long.MIN_VALUE)) {
      return Long.MIN_VALUE;
    }
    return this.not().add(Long.ONE);
  }

  add(other) {
    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

    const a48 = this.high >>> 16;
    const a32 = this.high & 0xffff;
    const a16 = this.low >>> 16;
    const a00 = this.low & 0xffff;

    const b48 = other.high >>> 16;
    const b32 = other.high & 0xffff;
    const b16 = other.low >>> 16;
    const b00 = other.low & 0xffff;

    let c48 = 0;
    let c32 = 0;
    let c16 = 0;
    let c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xffff;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xffff;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xffff;
    c48 += a48 + b48;
    c48 &= 0xffff;
    return Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  }

  subtract(other) {
    return this.add(other.negate());
  }

  multiply(other) {
    if (this.isZero()) {
      return Long.ZERO;
    }
    if (other.isZero()) {
      return Long.ZERO;
    }

    if (this.equals(Long.MIN_VALUE)) {
      return other.isOdd() ? Long.MIN_VALUE : Long.ZERO;
    }
    if (other.equals(Long.MIN_VALUE)) {
      return this.isOdd() ? Long.MIN_VALUE : Long.ZERO;
    }

    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().multiply(other.negate());
      }
      return this.negate()
        .multiply(other)
        .negate();
    }
    if (other.isNegative()) {
      return this.multiply(other.negate()).negate();
    }

    // If both longs are small, use float multiplication
    if (this.lessThan(Long.TWO_PWR_24) && other.lessThan(Long.TWO_PWR_24)) {
      return Long.fromNumber(this.toNumber() * other.toNumber());
    }

    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.

    const a48 = this.high >>> 16;
    const a32 = this.high & 0xffff;
    const a16 = this.low >>> 16;
    const a00 = this.low & 0xffff;

    const b48 = other.high >>> 16;
    const b32 = other.high & 0xffff;
    const b16 = other.low >>> 16;
    const b00 = other.low & 0xffff;

    let c48 = 0;
    let c32 = 0;
    let c16 = 0;
    let c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xffff;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xffff;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xffff;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xffff;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xffff;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xffff;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xffff;
    return Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  }

  div(other) {
    if (other.isZero()) {
      throw Error('division by zero');
    } else if (this.isZero()) {
      return Long.ZERO;
    }

    if (this.equals(Long.MIN_VALUE)) {
      if (other.equals(Long.ONE) || other.equals(Long.NEG_ONE)) {
        return Long.MIN_VALUE; // recall that -MIN_VALUE == MIN_VALUE
      }
      if (other.equals(Long.MIN_VALUE)) {
        return Long.ONE;
      }

      // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
      const halfThis = this.shiftRight(1);
      const approx = halfThis.div(other).shiftLeft(1);
      if (approx.equals(Long.ZERO)) {
        return other.isNegative() ? Long.ONE : Long.NEG_ONE;
      }
      const rem = this.subtract(other.multiply(approx));
      const result = approx.add(rem.div(other));
      return result;
    }

    if (other.equals(Long.MIN_VALUE)) {
      return Long.ZERO;
    }

    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().div(other.negate());
      }
      return this.negate()
        .div(other)
        .negate();
    }
    if (other.isNegative()) {
      return this.div(other.negate()).negate();
    }

    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    let res = Long.ZERO;
    let rem = this;
    while (rem.greaterThanOrEqual(other)) {
      // Approximate the result of division. This may be a little greater or
      // smaller than the actual value.
      let approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

      // We will tweak the approximate result by changing it in the 48-th digit or
      // the smallest non-fractional digit, whichever is larger.
      const log2 = Math.ceil(Math.log(approx) / Math.LN2);
      const delta = log2 <= 48 ? 1 : 2 ** (log2 - 48);

      // Decrease the approximation until it is smaller than the remainder.  Note
      // that if it is too large, the product overflows and is negative.
      let approxRes = Long.fromNumber(approx);
      let approxRem = approxRes.multiply(other);
      while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
        approx -= delta;
        approxRes = Long.fromNumber(approx);
        approxRem = approxRes.multiply(other);
      }

      // We know the answer can't be zero... and actually, zero would cause
      // infinite recursion since we would make no progress.
      if (approxRes.isZero()) {
        approxRes = Long.ONE;
      }

      res = res.add(approxRes);
      rem = rem.subtract(approxRem);
    }
    return res;
  }

  modulo(other) {
    return this.subtract(this.div(other).multiply(other));
  }

  not() {
    return Long.fromBits(~this.low, ~this.high);
  }

  and(other) {
    return Long.fromBits(this.low & other.low, this.high & other.high);
  }

  or(other) {
    return Long.fromBits(this.low | other.low, this.high | other.high);
  }

  xor(other) {
    return Long.fromBits(this.low ^ other.low, this.high ^ other.high);
  }

  shiftLeft(amount) {
    const numBits = amount & 63;
    if (numBits === 0) {
      return this;
    }

    if (numBits < 32) {
      return Long.fromBits(
        this.low << numBits,
        (this.high << numBits) | (this.low >>> (32 - numBits)),
      );
    }
    return Long.fromBits(0, this.low << (numBits - 32));
  }

  shiftRight(amount) {
    const numBits = amount & 63;
    if (numBits === 0) {
      return this;
    }
    if (numBits < 32) {
      return Long.fromBits(
        (this.low >>> numBits) | (this.high << (32 - numBits)),
        this.high >> numBits,
      );
    }
    return Long.fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1);
  }

  shiftRightUnsigned(amount) {
    const numBits = amount & 63;

    if (numBits === 0) {
      return this;
    }
    if (numBits < 32) {
      return Long.fromBits(
        (this.low >>> numBits) | (this.high << (32 - numBits)),
        this.high >>> numBits,
      );
    }
    if (numBits === 32) {
      return Long.fromBits(this.high, 0);
    }
    return Long.fromBits(this.high >>> (numBits - 32), 0);
  }
}

export default Long;
