/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import { pipe, withState, withEmitter } from '../../js/core/index';

const init = () =>
  Map({
    contentFragment: 'loginFragment',
  });

const addListener = ({ setData, emitter }) => {
  const subscription = emitter.addListener('toolbar.onNextClick', () => {
    setData(d => d.set('contentFragment', 'passwordFragment'));
  });

  return [subscription];
};

export default pipe(
  withState(init),
  withEmitter(addListener),
);
