/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { useEffect } from 'react';
import emitter from './emitter';
/**
 * @param {Function|object} fn
 */
const withEmitter = fn => (props = {}) => {
  const params = { ...props, emitter };
  if (fn.componentDidMount) {
    useEffect(() => {
      fn.componentDidMount.call(props, params);
    }, []);
  }

  // When you return a function in the callback passed to useEffect,
  // the returned function will be called before the component is removed from the UI
  if (fn.componentWillUnmount) {
    useEffect(
      () => () => {
        fn.componentWillUnmount.call(props, params);
      },
      []
    );
  }

  return { ...props, emitter };
};

export default withEmitter;
