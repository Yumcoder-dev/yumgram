/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import Storage from '../storage';

it('storage - set and get', () => {
  return Storage.set({ a: 1, b: 2 }).then(() => {
    expect(Storage.get(['a', 'b'])).resolves.toEqual([1, 2]);
    expect(Storage.get(['a', 'b', 'c'])).resolves.toEqual([1, 2, false]);
  });
});
