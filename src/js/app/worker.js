/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

const createWorker = func => {
  const code = func.toString();
  const blob = new Blob([`(${code})()`]);
  return new Worker(URL.createObjectURL(blob), { type: 'module' });
};

export default createWorker;
