/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.module.less';
import Router from './router';
import WindowResizeEmitter from './js/app/windowResizeEmitter';
import Application from './components/application';

function App() {
  useEffect(() => {
    Application.start();
  }, []);
  useEffect(WindowResizeEmitter, []);
  return (
    <BrowserRouter>
      <Switch>
        {Router.map(r => (
          <Route key={r.name} exact path={r.path} component={r.component} />
        ))}
      </Switch>
    </BrowserRouter>
  );
}

export default App;

// const w = new Worker();
// w.onmessage = event => {
//   console.log('onmessage', event);
// };
// w.postMessage({ task: 'mod-pow', x: [2, 2, 2], y: [1, 2, 3], m: [1, 2, 3] });

// const hw = new HelloWorld();
// hw.memFunc().then(res => {
//   console.log('ressss', res);
// });
