/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import withHandlers from '../withHandlers';
import testUtil from '../testUtils';

it('test with handlers obj', () => {
  let result = null;
  const getProps = testUtil(
    withHandlers({
      // handler = (props) => (payload) => {}
      // eslint-disable-next-line no-return-assign
      handle: ({ a }) => ({ b }) => (result = { a, b }),
    }),
    { a: true }, // input props for mounted component
  );

  getProps().handle({ b: true });
  expect(result).toEqual({ a: true, b: true });
});

it('test with handlers func', () => {
  let result = null;
  let called = 0;
  const getProps = testUtil(
    withHandlers(() => {
      called += 1;
      return {
        // handler = (props) => (payload) => {}
        // eslint-disable-next-line no-return-assign
        handle: ({ a }) => ({ b }) => (result = { a, b }),
      };
    }),
    { a: true }, // input props for mounted component
  );

  getProps().handle({ b: true });
  expect(called).toBe(1);
  expect(result).toEqual({ a: true, b: true });

  getProps().handle({ c: true });
  expect(called).toBe(1);
  expect(result).toEqual({ a: true, b: undefined });
});
