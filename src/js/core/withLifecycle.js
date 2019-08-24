/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';

function usePrevious(value) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
/**
 * @param {object} spec
 * @returns {object}
 */
const withLifecycle = spec => (props = {}) => {
  if (spec.componentDidMount) {
    useEffect(() => {
      spec.componentDidMount.call(props, props);
    });
  }
  // When you return a function in the callback passed to useEffect,
  // the returned function will be called before the component is removed from the UI
  if (spec.componentWillUnmount) {
    useEffect(() => () => {
      spec.componentWillUnmount.call(props);
    });
  }

  if (spec.componentWillUpdate) {
    const previousProps = usePrevious(props);
    useEffect(() => {
      spec.componentWillUpdate.call(props, previousProps);
    });
  }

  return { ...props };
};

export default withLifecycle;
