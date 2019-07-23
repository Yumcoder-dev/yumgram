/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

export function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

export function isArray(arr) {
  return Array.isArray(arr) || arr instanceof Array;
}

export function isObject(value) {
  return value !== null && typeof value === 'object';
}
