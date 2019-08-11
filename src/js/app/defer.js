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

  notify(progress) {
    if (this.promise.progress) {
      this.promise.progress(progress);
    }
  }

  cancel() {
    this.canceled = true;
    if (this.promise.cancel) {
      this.promise.cancel();
    }
  }
}

export default Defer;
