/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-underscore-dangle */
import { createWebAssembly, getImportObject } from './wsam';

class Crypto {
  getInstance() {
    if (this.cachePromise) {
      return this.cachePromise;
    }
    const importObject = getImportObject();
    this.memory = importObject.env.memory;
    this.cachePromise = createWebAssembly('crypto.wasm', importObject);
    return this.cachePromise;
  }

  // aesEncrypt(encryptedBytes, keyBytes, ivBytes) {
  //   this.getInstance().a(encryptedBytes, keyBytes, ivBytes);
  // }

  // aesDecrypt(bytes, keyBytes, ivBytes) {
  //   this.getInstance().b(bytes, keyBytes, ivBytes);
  // }

  factorize(bytes) {
    return this.getInstance().then(instance => {
      const memH8 = new Uint8Array(this.memory.buffer);
      // to heap
      for (let i = 0; i < bytes.length; i += 1) {
        memH8[i] = bytes[i];
      }
      // let resOffset = instance._factorize(0, bytes.length); // _factorize
      instance._factorize(0, bytes.length); // _factorize
      // get respose from heap
      const p = [];
      // const pLen = memH8[resOffset];
      // for (let i = 1; i <= pLen; i += 1) {
      //   p.push(memH8[resOffset + i]);
      // }
      const g = [];
      // resOffset += pLen + 1;
      // const gLen = memH8[resOffset];
      // for (let i = 1; i <= gLen; i += 1) {
      //   g.push(memH8[resOffset + i]);
      // }

      const c = [];
      for (let i = 0; i <= 20; i += 1) {
        c.push(memH8[i]);
      }
      return [p, g, c];
    });
  }
}

export default new Crypto();
