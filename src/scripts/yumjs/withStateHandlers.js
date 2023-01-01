/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { useReducer} from 'react';

const withStateHandlers = (initialValue, handlers) => {
  const actionTypes = Object.keys(handlers);

  const reducer = (state, action) => ({
    ...state,
    ...handlers[action.type](state, action.payload),
  });

  const initialState =
    typeof initialValue === 'function' ? initialValue() : initialValue;

  const [state, dispatch] = useReducer(reducer, initialState);

  const boundHandlers = actionTypes.reduce((obj, type) => {
    obj[type] = (...payload) => {
      if (payload !== undefined) dispatch({ type, payload });
    };

    return obj;
  }, {});

  return { ...state, ...boundHandlers };
};

export default withStateHandlers;
