/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

export default class Timeout {
  constructor(fn, delay) {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.timeoutId = setTimeout(() => {
      try {
        const result = fn();
        this.resolve(result);
      } catch (e) {
        this.reject(e);
      }
    }, delay || 0);
  }

  // then(resolve, reject) {
  //   this.promise.then(resolve, reject);
  // }

  // catch(reject) {
  //   this.promise.catch(reject);
  // }

  cancel() {
    if (!this.promise || !this.timeoutId) return;
    clearTimeout(this.timeoutId);
    this.promise = null;
    this.timeoutId = 0;
  }
}
