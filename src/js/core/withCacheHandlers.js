/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { useMemo } from 'react';
import withCacheHandler from './withCacheHandler';
/**
 * withHandlers(
 * handlerCreators: {
 *   [handlerName: string]: (props: Object) => Function
 *  } |
 * handlerCreatorsFactory: (initialProps) => {
 *   [handlerName: string]: (props: Object) => Function
 * }
 *): (props: Object) => Object
 *
 * @param {object|func} handlers
 * @returns {object}
 */
const withCacheHandlers = handlers => (props = {}) => {
  const realHandlers = useMemo(
    () => (typeof handlers === 'function' ? handlers(props) : handlers),
    [], // eslint-disable-line
  );

  const actionTypes = Object.keys(realHandlers);

  const boundHandlers = actionTypes.reduce(
    (obj, type) =>
      Object.assign(obj, {
        // note: handler = (props) => (payload) => {}
        [type]: withCacheHandler((...payload) => realHandlers[type](props)(...payload)),
      }),
    {},
  );

  return { ...props, ...boundHandlers };
};

export default withCacheHandlers;
