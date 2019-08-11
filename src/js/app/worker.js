/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

// const createWorker = func => {
//   const code = func.toString();
//   const blob = new Blob([`(${code})()`]);
//   return new Worker(URL.createObjectURL(blob), { type: 'module' });
// };

// export default createWorker;
export default class createWorker {
  constructor(worker) {
    let code = worker.toString();
    code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

    const blob = new Blob([code], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
  }
}
