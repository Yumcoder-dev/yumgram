/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

it('test arr reduce func', () => {
  const arr = [1, 2, 3];
  const res = arr.reduce((sum, current) => sum + current, 0);
  expect(res).toBe(6);
});
