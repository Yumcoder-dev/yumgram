/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { act } from 'react-dom/test-utils';
import testUtil from '../testUtils';
import withStateHandlers from '../withStateHandlers';

it('test with state handlers', () => {
  const getProps = testUtil(
    withStateHandlers(
      { b: false }, // initial state
      {
        // reducers
        handle: () => ({ b }) => ({ b }), //  () => ({ b }) => {return { b }}
        // explicit return:
        //      const Welcome = (props) => {
        //          return <h1>Hello, {props.name}</h1>;
        //      }
        //
        // Implicit return:
        //      const Welcome = (props) => (
        //          <h1>Hello, {props.name}</h1>;
        //      )
        addNewDataState: () => ({ c }) => ({ c })
      }
    ),
    {} // props pass to withStateHandlers
  );

  act(() => getProps().handle({ b: true }));
  expect(getProps().b).toEqual(true);

  act(() => getProps().addNewDataState({ c: 10 }));
  expect(getProps().c).toEqual(10);
});

it('test with state handlers unchanged state', () => {
  const getProps = testUtil(
    withStateHandlers(
      { b: true },
      {
        handle: () => () => undefined
      }
    ),
    {}
  );

  act(() => getProps().handle());
  expect(getProps().b).toBe(true);
});

it('test with state handlers props memo', () => {
  const getProps = testUtil(
    withStateHandlers(() => ({ b: false }) /* useMemo */, {
      handle: () => ({ b }) => ({ b })
    }),
    { c: 10 } // props
  );

  act(() => getProps().handle({ b: true }));
  expect(getProps().b).toBe(true);
  expect(getProps().c).toBe(10);
});
