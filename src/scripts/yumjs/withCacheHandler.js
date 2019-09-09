/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { useRef, useLayoutEffect, useMemo } from 'react';

/* eslint-disable react-hooks/rules-of-hooks */
const withCacheHandler = fn => {
  const ref = useRef();
  useLayoutEffect(() => {
    ref.current = fn;
  });
  return useMemo(() => (...args) => (0, ref.current)(...args), []);
};

export default withCacheHandler;
