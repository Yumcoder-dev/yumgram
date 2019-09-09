/* eslint-disable no-unused-vars */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import React from 'react';
import { pipe, withState, withEmitter } from '@yumjs';

const init = props =>
  Map({
    percentage: props.percentage,
    padding: props.padding,
    contHeight: props.contHeight,
    elm: React.createRef(),
  });

const addListener = ({ data, setData, emitter }) => {
  // size : {width, height}
  const subscription = emitter.addListener('onWindowResize', size => {
    const elm = data.get('elm');

    if (elm && elm.current && elm.current.style) {
      const height = elm.current.offsetHeight;
      const { marginTop, paddingTop } = elm.current.style;

      const percentage = data.get('percentage');
      let contHeight = data.get('contHeight');
      const usePadding = data.get('padding') === 'true';
      const fullHeight = height - (height && usePadding ? 2 * parseInt(marginTop || 0, 10) : 0);
      const ratio = (percentage > 0 && percentage) || 0.5;
      contHeight = contHeight || size.height;
      const margin = fullHeight < contHeight ? `${(contHeight - fullHeight) * ratio}px` : '';
      const styles = usePadding
        ? { paddingTop: margin, paddingBottom: margin }
        : { marginTop: margin, marginBottom: margin };
      setData(d => d.set('styles', styles));
    }
  });

  return [subscription];
};

export default pipe(
  withState(init),
  withEmitter(addListener),
);
