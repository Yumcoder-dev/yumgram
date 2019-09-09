/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import { pipe, withState, withLifecycle } from '@yumjs';
import { mtpApiManager } from '@appjs';
import { PAGES } from '@components-shared';

const init = () =>
  Map({
    view: PAGES.NONE,
  });

const onCreate = ({ setData }) => {
  mtpApiManager.mtpGetUserID().then(id => {
    if (id) {
      setData(d => d.set('view', PAGES.IM));
    } else {
      setData(d => d.set('view', PAGES.LOGIN));
    }
    // # todo
    // if (
    //   location.protocol == 'http:' &&
    //   !Config.Modes.http &&
    //   Config.App.domains.indexOf(location.hostname) != -1
    // ) {
    //   location.href = location.href.replace(/^http:/, 'https:');
    //   return;
    // }
    // $location.url('/login');
  });
};

export default pipe(
  withState(init),
  withLifecycle({ onCreate }),
);
