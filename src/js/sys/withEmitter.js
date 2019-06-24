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
  let tokens;
  const params = { ...props, emitter };
  if (fn.addListener) {
    useEffect(() => {
      tokens = fn.addListener.call(props, params);
    }, []);
  }

  // When you return a function in the callback passed to useEffect,
  // the returned function will be called before the component is removed from the UI
  useEffect(
    () => () => {
      if (tokens !== undefined) {
        // var token = emitter.addListener('change', (...args) => {
        //   console.log(...args);
        // });
        //
        // emitter.emit('change', 10); // 10 is logged
        // token.remove();
        // emitter.emit('change', 10); // nothing is logged
        tokens.map(t => t.remove()); // remove all regisered tokens
      }
    },
    []
  );

  // if (fn.removeListener) {
  //   useEffect(
  //     () => () => {
  //       fn.removeListener.call(props, params);
  //     },
  //     [],
  //   );
  // }

  return { ...props, emitter };
};

export default withEmitter;
