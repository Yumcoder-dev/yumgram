/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

export function tsNow(seconds) {
  // #todo replace with global object
  const t = +new Date() + (window.tsOffset || 0);
  return seconds ? Math.floor(t / 1000) : t;
}

const logTimer = new Date().getTime();
export const dT = () => `[${((new Date().getTime() - logTimer) / 1000).toFixed(3)}]`;
