/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import pipe from '../pipe';

it('test pipe', () => {
  expect(pipe()(/* init value */)).toEqual({});

  const inc = num => num + 1;
  expect(
    pipe(
      inc,
      inc,
    )(0),
  ).toBe(2);

  expect(
    pipe(
      () => ({ num: 0 }),
      x => ({ num: x.num + 1 }),
    )(),
  ).toEqual({ num: 1 });
});
