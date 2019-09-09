/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { isFunction } from '../type';

class T1 {
  f1() {
    return this;
  }
}

it('type - is func', () => {
  expect(isFunction(() => true)).toBeTruthy();
  expect(isFunction([])).toBeFalsy();
  // eslint-disable-next-line no-new-object
  expect(isFunction(new Object())).toBeFalsy();
  // eslint-disable-next-line no-array-constructor
  expect(isFunction(new Array())).toBeFalsy();
  expect(isFunction({})).toBeFalsy();
  // eslint-disable-next-line func-names
  expect(isFunction(function() {})).toBeTruthy();
  expect(isFunction(new T1().f1)).toBeTruthy();
});
