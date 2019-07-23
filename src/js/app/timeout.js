/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

// class Deferred {
//   constructor() {
//     this.promise = new Promise((resolve, reject) => {
//       this.reject = reject;
//       this.resolve = resolve;
//     });
//     this.timeoutId = 0;
//   }
// }

// function Timeout(fn, delay) {
//   const q = new Deferred();

//   q.timeoutId = setTimeout(() => {
//     try {
//       q.resolve(fn());
//     } catch (e) {
//       q.reject(e);
//     }
//   }, delay || 0);

//   return q;
// }

// Timeout.cancel = q => {
//   console.log('!this.timeoutId', q);
//   if (!(q instanceof Deferred) || q.timeoutId === 0) return;
//   //q.reject('canceled');
//   console.log('!this.timeoutId', q.timeoutId);
//   clearTimeout(q.timeoutId);
//   q.timeoutId = 0;
// };

class Timeout {
  constructor(fn, delay) {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    // performance tuning: enable polyfill for zero-timeout-message
    this.timeoutId = setTimeout(() => {
      try {
        const result = fn();
        this.resolve(result);
      } catch (e) {
        this.reject(e);
      }
    }, delay || 0);
  }

  then(resolve, reject) {
    this.promise.then(resolve, reject);
  }

  catch(reject) {
    this.promise.catch(reject);
  }

  cancel() {
    if (!this.promise || !this.timeoutId) return;
    clearTimeout(this.timeoutId);
    this.promise = null;
    this.timeoutId = 0;
  }
}

export default Timeout;

// import Promise from 'bluebird'

// const cancelToken = Symbol('cancel token')

// const timeoutRefs = new WeakSet

// const pause = (delay: number): Promise<void> => new Promise(r => setTimeout(r, delay))

// export const smartTimeout = <T>(fn: (...args: Array<*>) => T, delay?: number = 0, ...args: Array<*>) => {
//   const newToken = Symbol('cancel id')
//   const checkRun = () => {
//     if (timeoutRefs.has(newToken)) {
//       timeoutRefs.delete(newToken)
//       return fn(...args)
//     } else return false
//   }
//   const promise = pause(delay).then(checkRun)
//   promise[cancelToken] = newToken
//   return promise
// }

// smartTimeout.cancel = promise => {
//   if (!promise || !promise[cancelToken]) return false
//   const token = promise[cancelToken]
//   return timeoutRefs.has(token)
//     ? timeoutRefs.delete(token)
//     : false
// }

// export const immediate = <T>(fn: (...args: Array<*>) => T, ...args: Array<*>) =>
//   Promise
//     .resolve()
//     .then(() => fn(...args))

// export const delayedCall =
//   <T>(fn: (...args: Array<*>) => T, delay?: number = 0, ...args: Array<*>) =>
//     pause(delay)
//       .then(() => fn(...args))

// smartTimeout.immediate = immediate
// smartTimeout.promise = delayedCall

// export default smartTimeout
