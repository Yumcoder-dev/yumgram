/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { useEffect, useRef, useState } from 'react';

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
  const [state, setStateRaw] = useState({});
  const setState = update => {
    setStateRaw({
      ...state,
      ...(typeof update === 'function' ? update(state) : update),
    });
  };

  const self = { props, state, setState };

  if (spec.componentDidMount) {
    useEffect(() => {
      spec.componentDidMount.call(self, props);
    }, [props, self]);
  }
  // When you return a function in the callback passed to useEffect,
  // the returned function will be called before the component is removed from the UI
  if (spec.componentWillUnmount) {
    useEffect(
      () => () => {
        spec.componentWillUnmount.call(self);
      },
      [self],
    );
  }

  if (spec.componentDidUpdate) {
    const previousProps = usePrevious(props);
    useEffect(() => {
      spec.componentDidUpdate.call(self, previousProps);
    });
  }

  return { ...props, ...state };
};

export default withLifecycle;
