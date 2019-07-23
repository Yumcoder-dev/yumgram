/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

class Arcfour {
  constructor(key) {
    this.i = 0;
    this.j = 0;
    this.S = [];
    let i;
    let j;
    let t;
    for (i = 0; i < 256; i += 1) this.S[i] = i;
    j = 0;
    for (i = 0; i < 256; i += 1) {
      j = (j + this.S[i] + key[i % key.length]) & 255;
      t = this.S[i];
      this.S[i] = this.S[j];
      this.S[j] = t;
    }
    this.i = 0;
    this.j = 0;
  }

  next() {
    this.i = (this.i + 1) & 255;
    this.j = (this.j + this.S[this.i]) & 255;
    const t = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = t;
    return this.S[(t + this.S[this.i]) & 255];
  }
}

// pseudorandom number generator
class PRNG {
  constructor() {
    this.pool = [];
    this.pptr = 0;
    let t;
    if (global && global.crypto && global.crypto.getRandomValues) {
      // Use webcrypto if available
      const ua = new Uint8Array(32);
      global.crypto.getRandomValues(ua);
      for (t = 0; t < 32; ++t) this.pool[this.pptr++] = ua[t];
    }
    if (
      window.navigator.appName === 'Netscape' &&
      window.navigator.appVersion < '5' &&
      global &&
      global.crypto
    ) {
      // Extract entropy (256 bits) from NS4 RNG if available
      const z = global.crypto.random(32);
      for (t = 0; t < z.length; ++t) rng_pool[this.pptr++] = z.charCodeAt(t) & 255;
    }

    while (this.pptr < 255) {
      // extract some randomness from Math.random()
      t = Math.floor(65536 * Math.random());
      this.pool[this.pptr++] = t >>> 8;
      this.pool[this.pptr++] = t & 255;
    }
    this.pptr = 0;
    this.seedInt(new Date().getTime());
  }

  // Mix in a 32-bit integer into the pool
  seedInt(x) {
    this.pool[this.pptr++] ^= x & 255;
    this.pool[this.pptr++] ^= (x >> 8) & 255;
    this.pool[this.pptr++] ^= (x >> 24) & 255;
    this.pool[this.pptr++] ^= (x >> 16) & 255;
    if (this.pptr >= 255) this.pptr -= 255;
  }

  getByte() {
    if (this.state == null) {
      this.seedInt(new Date().getTime());
      this.state = new Arcfour(this.pool);
      for (this.pptr = 0; this.pptr < this.pool.length; this.pptr += 1) this.pool[this.pptr] = 0;
      this.pptr = 0;
      // rng_pool = null;
    }

    // TODO: allow reseeding after first request
    return this.state.next();
  }

  nextBytes(ba) {
    for (let i = 0; i < ba.length; ++i) ba[i] = this.getByte();
  }
}

const SecureRandom = new PRNG();
document.addEventListener('mousedown', () => SecureRandom.seedInt(new Date().getTime()));
export default SecureRandom;
