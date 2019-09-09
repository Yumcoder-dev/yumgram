/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import Timeout from './timeout';
import { emitter } from '@yumjs';
import Config from './config';

class Idle {
  constructor() {
    this.isIDLE = false;
    this.initial = true;
    this.started = false;

    // see https://whatwebcando.today/foreground-detection.html
    this.hidden = 'hidden';
    this.visibilityChange = 'visibilitychange';
    if (typeof document.hidden !== 'undefined') {
      // default
    } else if (typeof document.mozHidden !== 'undefined') {
      this.hidden = 'mozHidden';
      this.visibilityChange = 'mozvisibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      this.hidden = 'msHidden';
      this.visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      this.hidden = 'webkitHidden';
      this.visibilityChange = 'webkitvisibilitychange';
    }
    if (!Config.Mobile) {
      this.visibilityChange = '';
    }

    this.timeout = false;
    this.debouncePromise = false;
    // in order to add and remove in bind mode
    this.onEvent = this.onEvent.bind(this);
  }

  start() {
    if (!this.started) {
      this.started = true;
      window.addEventListener('mousedown', this.onEvent);
      window.addEventListener('keydown', this.onEvent);
      window.addEventListener('focus', this.onEvent);
      window.addEventListener('blur', this.onEvent);
      window.addEventListener('touchstart', this.onEvent);
      if (this.visibilityChange !== '') {
        document.addEventListener(this.visibilityChange, this.onEvent);
      }

      setTimeout(() => {
        this.onEvent({ type: 'blur', fake_initial: true });
      }, 0);
    }
  }

  onEvent(e) {
    if (e.type === 'mousemove') {
      const originalEvent = e.originalEvent || e;
      if (originalEvent && originalEvent.movementX === 0 && originalEvent.movementY === 0) {
        return;
      }
      window.removeEventListener('mousedown', this.onEvent);
    }

    let isIDLE = !!(e.type === 'blur' || e.type === 'timeout');
    if (this.hidden && document[this.hidden]) {
      isIDLE = true;
    }

    if (this.timeout) {
      this.timeout.cancel();
    }
    if (!isIDLE) {
      // console.log('update timeout');
      this.timeout = new Timeout(() => this.onEvent({ type: 'timeout' }), 30000);
    }

    if (e.type === 'focus' && !this.idleAfterFocus) {
      this.idleAfterFocus = true;
      setTimeout(() => {
        this.idleAfterFocus = false;
      }, 10);
    }

    // const debounceTimeout = $rootScope.idle.initial ? 0 : 1000;
    // if (e && !e.fake_initial) {
    //   delete $rootScope.idle.initial;
    // }

    if (this.debouncePromise) {
      this.debouncePromise.cancel();
    }

    if (this.isIDLE === isIDLE) {
      return;
    }

    this.debouncePromise = new Timeout(() => {
      // console.log(dT(), 'IDLE changed', isIDLE)
      this.isIDLE = isIDLE;
      emitter.emit('idle.isIDLE', isIDLE);
      if (isIDLE && e.type === 'timeout') {
        window.addEventListener('mousemove', this.onEvent); // () -=
      }
    }, 1000);
  }
}

export default Idle;
