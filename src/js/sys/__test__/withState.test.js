/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { act } from 'react-dom/test-utils';
import testUtil from '../testUtils';
import withState from '../withState';

it('test with state primitive', () => {
  const getProps = testUtil(withState(0, 'state', 'setState'));

  expect(getProps().state).toEqual(0);
  act(() => getProps().setState(1));
  expect(getProps().state).toEqual(1);
});

it('test with state obj', () => {
  const getProps = testUtil(withState({ a: 1 }));

  expect(getProps().data).toEqual({ a: 1 });
  act(() => getProps().setData({ a: 2, c: 3 }));
  expect(getProps().data).toEqual({ a: 2, c: 3 });
});

it('test with state func', () => {
  let called = 0;
  const getProps = testUtil(
    withState(
      () => {
        called += 1;
        return 0;
      },
      'state',
      'setState'
    )
  );

  expect(getProps().state).toEqual(0);
  act(() => getProps().setState(1));
  expect(getProps().state).toEqual(1);
  expect(called).toEqual(1);
});
