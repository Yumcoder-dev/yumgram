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

const withLifecycle = spec => (props = {}) => {
  if (spec.onCreate) {
    // If you only want to run the function given to useEffect after the initial render,
    // you can give it an empty array as second argument.
    useEffect(() => {
      spec.onCreate.call(props, props);
    }, []);
  }

  if (spec.onDestroy) {
    // When you return a function in the callback passed to useEffect,
    // the returned function will be called before the component is removed from the UI
    useEffect(
      () => () => {
        spec.onDestroy.call(props, props);
      },
      [],
    );
  }

  if (spec.onUpdate) {
    const previousProps = usePrevious(props);
    useEffect(() => {
      spec.onUpdate.call(props, previousProps);
    });
  }

  return { ...props };
};

export default withLifecycle;
