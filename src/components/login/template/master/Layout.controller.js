/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import { pipe, withState, withEmitter } from '@yumjs';
import { PAGE_SENDCODE, EVENT_SHOW_PAGE, EVENT_AUTH_USER } from '@login-shared';
import { mtpApiManager } from '@appjs';

const init = () =>
  Map({
    view: PAGE_SENDCODE, // state for current active view
  });

const addListener = ({ setData, emitter }) => {
  const changeViewSubscription = emitter.addListener(EVENT_SHOW_PAGE, (view, viewProps) => {
    setData(d => d.set('view', view).set('props', viewProps));
  });

  const saveAuthScription = emitter.addListener(EVENT_AUTH_USER, (dcId, id) => {
    mtpApiManager.mtpSetUserAuth(dcId, { id });
    setData(d => d.set('RedirectToIm', true));
  });

  return [changeViewSubscription, saveAuthScription];
};

export default pipe(
  withState(init),
  withEmitter(addListener),
);
