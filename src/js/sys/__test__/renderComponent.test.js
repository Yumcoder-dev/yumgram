/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import renderComponent from '../renderComponent';

it('test render component', () => {
  let e;

  try {
    renderComponent(() => 'something')();
  } catch (thrown) {
    e = thrown;
  }

  expect(e).toBe('something');
});
