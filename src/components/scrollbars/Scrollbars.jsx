/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Scrollbars } from 'react-custom-scrollbars';
import React, { useCallback } from 'react';

// eslint-disable-next-line react/prop-types
const CustomScrollbars = ({ onScroll, forwardedRef, style, children }) => {
  const refSetter = useCallback(
    scrollbarsRef => {
      if (scrollbarsRef) {
        forwardedRef(scrollbarsRef.view);
      } else {
        forwardedRef(null);
      }
    },
    [forwardedRef],
  );

  return (
    <Scrollbars ref={refSetter} style={{ ...style, overflow: 'hidden' }} onScroll={onScroll}>
      {children}
    </Scrollbars>
  );
};

export default React.forwardRef((props, ref) => <CustomScrollbars {...props} forwardedRef={ref} />);
