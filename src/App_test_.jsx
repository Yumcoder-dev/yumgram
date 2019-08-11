/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.module.less';
import routes from './router_test_';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        {routes.map(r => (
          <Route key={r.name} exact path={r.path} component={r.component} />
        ))}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
