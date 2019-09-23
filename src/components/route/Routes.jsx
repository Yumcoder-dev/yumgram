/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LoginMainLayout } from '@login';
import Welcome from '../welcome/Welcome';
import Page404 from '../page404/Page404';
import { ImMainLayout } from '@im';
import PAGES from './master';

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={PAGES.ROOT} component={Welcome} />
        <Route exact path={PAGES.LOGIN} component={LoginMainLayout} />
        <Route exact path={PAGES.IM} component={ImMainLayout} />
        <Route component={Page404} />
      </Switch>
    </BrowserRouter>
  );
};
