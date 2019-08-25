/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import { pipe, withState, withEmitter } from '../../../../js/core/index';

const init = () =>
  Map({
    view: 'login', // state for current active view
  });

const addListener = ({ setData, emitter }) => {
  // for login.toolbar.onNextClick see login toolbar controller
  const subscription = emitter.addListener('login.toolbar.onNextClick', () => {
    setData(d => d.set('view', 'password'));
  });

  return [subscription];
};

export default pipe(
  withState(init),
  withEmitter(addListener),
);
