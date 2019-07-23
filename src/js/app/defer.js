/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

class Defer {
  constructor() {
    this.canceled = false;
    this.promise = new Promise((resolve, reject) => {
      this.resolver = value => {
        if (!this.canceled) resolve(value);
      };
      this.rejecter = value => {
        if (!this.canceled) reject(value);
      };
    });
  }

  resolve(value) {
    this.resolver(value);
  }

  reject(value) {
    this.rejecter(value);
  }

  then(onFulfilled, onRejected) {
    this.promise.then(onFulfilled, onRejected);
  }

  cancel() {
    this.canceled = true;
  }
}

export default Defer;

// export const blueDefer = () => {
//   let resolve, reject
//   const promise = new Promise((rs, rj) => {
//     resolve = rs
//     reject = rj
//   })
//   return {
//     resolve,
//     reject,
//     promise
//   }
// }

// export default blueDefer
