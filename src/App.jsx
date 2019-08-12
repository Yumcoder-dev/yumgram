/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.module.less';
import Worker from './js/app/crypto.worker';
import routes from './router';

const w = new Worker();
w.onmessage = event => {
  console.log('onmessage', event);
};
w.postMessage({ task: 'mod-pow', x: [2, 2, 2], y: [1, 2, 3], m: [1, 2, 3] });

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
