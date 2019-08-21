/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-underscore-dangle */
import { createWebAssembly, getImportObject } from './wsam';

class Tutorial {
  getInstance() {
    if (this.cachePromise) {
      return this.cachePromise;
    }
    const importObject = getImportObject();
    importObject.env._js_add = (a, b) => a + b;
    this.memory = importObject.env.memory;
    this.cachePromise = createWebAssembly('tutorial.wasm', importObject);
    return this.cachePromise;
  }

  callJsFuncFromC() {
    // call a JavaScript function form c code
    // const add = (a, b) => a + b;
    // const env = { js_add: add };
    //
    // declar external func in env
    return this.getInstance(true).then(instance => {
      return instance._callJsFuncFromC(10, 20);
    });
  }

  arrFunc(bytes) {
    // see https://ariya.io/2019/05/basics-of-memory-access-in-webassembly
    return this.getInstance().then(instance => {
      const i32 = new Uint8Array(this.memory.buffer);
      // to heap
      for (let i = 0; i < bytes.length; i += 1) {
        i32[i] = bytes[i];
      }
      const resOffset = instance._arrFunc(0, bytes.length);
      // get respose from heap
      const res = [];
      for (let i = 0; i < bytes.length; i += 1) {
        res.push(i32[resOffset + i]);
      }
      return res;
    });
  }

  // memFunc() {
  //   return this.getInstance().then(instance => {
  //     const view1 = new DataView(this.mem.buffer);
  //     view1.setUint8(0, 10);
  //     view1.setUint8(1, 30);
  //     view1.setUint8(2, 40);
  //     // eslint-disable-next-line no-underscore-dangle
  //     const loc = instance._arrFunc();
  //     console.log('loc = ', loc);

  //     for (let i = 0; i < 3; i += 1) {
  //       console.log(i, ' = ', view1.getUint8(loc + i));
  //     }
  //     // console.log('0 = ', view1.getUint8(0));
  //     // console.log('1 = ', view1.getUint32(1));
  //     // console.log('2 = ', view1.getUint32(5));
  //   });
  // }
}

export default new Tutorial();
