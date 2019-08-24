/* eslint-disable no-unused-vars */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import React from 'react';
import { pipe, withState, withEmitter } from '../../js/core/index';
import Config from '../../js/app/config';

const init = props =>
  Map({
    percentage: props.percentage,
    padding: props.padding,
    contHeight: props.contHeight,
    elm: React.createRef(),
  });

const addListener = ({ setData, emitter }) => {
  // size : {width, height}
  const subscription = emitter.addListener('onWindowResize', size => {
    setData(d => {
      const percentage = d.get('percentage');
      let contHeight = d.get('contHeight');
      const usePadding = d.get('padding') === 'true';

      const height = d.get('elm').current.offsetHeight;
      const { marginTop, paddingTop } = d.get('elm').current.style;

      const fullHeight = height - (height && usePadding ? 2 * parseInt(marginTop || 0, 10) : 0);
      const ratio = (percentage > 0 && percentage) || 0.5;
      contHeight = contHeight || size.height;
      const margin = fullHeight < contHeight ? `${(contHeight - fullHeight) * ratio}px` : '';
      const styles = usePadding
        ? { paddingTop: margin, paddingBottom: margin }
        : { marginTop: margin, marginBottom: margin };

      return d.set('styles', styles);
    });
  });

  return [subscription];
};

export default pipe(
  withState(init),
  withEmitter(addListener),
);
