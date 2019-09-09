/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { useReducer, useMemo } from 'react';

const withStateHandlers = (initialValue, handlers) => (props = {}) => {
  const actionTypes = Object.keys(handlers);

  // note: action.type is function name, action.payload are function parameters
  // handler = function [action.type](action.payload)
  const reducer = (state, action) => ({
    ...state,
    ...handlers[action.type](state, props)(...action.payload),
  });

  // see https://reactjs.org/docs/hooks-reference.html#usereducer
  const [state, dispatch] = useReducer(
    reducer,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    typeof initialValue === 'function' ? useMemo(() => initialValue(props), []) : initialValue,
  );

  const boundHandlers = actionTypes.reduce(
    (obj, type) =>
      Object.assign(obj, {
        [type]: (...payload) => {
          if (payload !== undefined) dispatch({ type, payload });
        },
      }),
    {},
  );

  return { ...props, ...state, ...boundHandlers };
};

export default withStateHandlers;
