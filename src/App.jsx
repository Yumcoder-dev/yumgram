/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.module.less';
import routes from './components/router/routes';
import WindowResizeEmitter from './js/app/windowResizeEmitter';

// import Login from './components/login/index';
// import Welcome from './components/welcome/Welcome';
// import Im from './components/im/Im';
// import Page404 from './components/page404/Page404';

function App() {
  useEffect(WindowResizeEmitter, []);
  const routeComponents = routes.map(({ path, component }, index) => {
    if (path !== '' || path !== undefined) {
      return <Route exact path={path} component={component} key={index} />; // eslint-disable-line
    }
    return <Route component={component} key={index} />; // eslint-disable-line
  });

  return (
    <BrowserRouter>
      <Switch>{routeComponents}</Switch>
    </BrowserRouter>
  );
  // return (
  //   <BrowserRouter>
  //     <Switch>
  //       {/* {Router.map(r => (
  //         <Route exact={r.path !== ''} path={r.path} component={r.component} />
  //       ))} */}
  //       <Route exact path="/" component={Welcome} />
  //       <Route exact path="/login" component={Login} />
  //       <Route exact path="/im" component={Im} />
  //       <Route exact={false} path="" component={Page404} />
  //     </Switch>
  //   </BrowserRouter>
  // );
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
