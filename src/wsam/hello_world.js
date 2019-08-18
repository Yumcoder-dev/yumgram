/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { createWebAssembly, getImportObject } from './wsam';

class HelloWorld {
  getInstance() {
    if (this.cachePromise) {
      return this.cachePromise;
    }
    const importObject = getImportObject();
    this.mem = importObject.env.memory;
    this.cachePromise = createWebAssembly('hello_world.wasm', importObject);
    return this.cachePromise;
  }

  arrFunc(bytes) {
    // see https://ariya.io/2019/05/basics-of-memory-access-in-webassembly
    return this.getInstance().then(instance => {
      const i32 = new Uint8Array(this.mem.buffer);
      // to heap
      for (let i = 0; i < bytes.length; i += 1) {
        i32[i] = bytes[i];
      }
      instance.b(0, bytes.length);
      const res = [];
      for (let i = 0; i < bytes.length; i += 1) {
        res.push(i32[i]);
      }
      return res;
    });
  }

  memFunc() {
    return this.getInstance().then(instance => {
      const view1 = new DataView(this.mem.buffer);
      view1.setUint8(0, 10);
      view1.setUint8(1, 30);
      view1.setUint8(2, 40);
      // eslint-disable-next-line no-underscore-dangle
      const loc = instance._arrFunc();
      console.log('loc = ', loc);

      for (let i = 0; i < 3; i += 1) {
        console.log(i, ' = ', view1.getUint8(loc + i));
      }
      // console.log('0 = ', view1.getUint8(0));
      // console.log('1 = ', view1.getUint32(1));
      // console.log('2 = ', view1.getUint32(5));
    });
  }
}

export default HelloWorld;
