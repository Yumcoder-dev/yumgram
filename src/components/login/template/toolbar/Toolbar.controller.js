/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import { pipe, withState, withHandlers, withEmitter } from '../../../../js/core/index';
import { EVENT_ON_STATUS_CHANGED, EVENT_ON_SUBMIT } from '../../constant';

const init = () =>
  Map({
    status_msg: '',
  });

const onNextClick = ({ data, emitter }) => () => {
  if (data.get('status_msg') === '') {
    emitter.emit(EVENT_ON_SUBMIT);
  }
};

// login.onChangeStatus: see pages controller
const addListener = ({ setData, emitter }) => {
  const subscription = emitter.addListener(EVENT_ON_STATUS_CHANGED, data => {
    setData(d => d.set('status_msg', data));
  });

  return [subscription];
};

export default pipe(
  withState(init),
  withEmitter(addListener),
  withHandlers({ onNextClick }),
);
