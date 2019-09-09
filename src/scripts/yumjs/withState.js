/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { useState, useMemo } from 'react';

const withState = (initialState, stateName = 'data', stateUpdaterName = 'setData') => (
  props = {},
) => {
  const [state, update] = useState(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    typeof initialState === 'function' ? useMemo(() => initialState(props), []) : initialState,
  );

  return {
    ...props,
    [stateName]: state,
    [stateUpdaterName]: update,
  };
};

export default withState;
