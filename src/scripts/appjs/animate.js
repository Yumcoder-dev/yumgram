/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

class RequestAnimationFrame {
  animate(fn, duration) {
    this.rafId = window.requestAnimationFrame(timestamp => this.step(timestamp));
    this.duration = duration;
    this.fn = fn;
  }

  step(timestamp) {
    if (!this.start) this.start = timestamp;
    if (this.state > 0) return; // end or cancle
    const progress = timestamp - this.start;
    this.fn(progress);

    if (progress < this.duration) {
      this.rafId = window.requestAnimationFrame(t => this.step(t));
    } else {
      this.state = 2;
    }
  }

  cancle() {
    if (!this.state) {
      this.state = 1;
      window.cancelAnimationFrame(this.rafId);
    }
  }
}

export default RequestAnimationFrame;
