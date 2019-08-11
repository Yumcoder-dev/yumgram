/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.module.less';
// eslint-disable-next-line
// import TestWorker from './test.worker';
// import Worker from './js/app/worker';
import routes from './router';

// const piWorker = new Worker(TestWorker);
// piWorker.onmessage = event => {
//   console.log(`pi: ${event.data}`);
// };
// piWorker.postMessage(42);

// import('./test.worker.js').then(m => {
//   console.log(m.default.toString());
//   const workerInstance = new Worker(m.default);
//   workerInstance.addEventListener(
//     'message',
//     e => {
//       console.log('Received response:');
//       console.log(e.data);
//     },
//     false,
//   );
//   workerInstance.postMessage('bar');
// });

// console.log('start...');
// const workerInstance = new Worker(TestWorker);
// workerInstance.addEventListener(
//   'message',
//   e => {
//     console.log('Received response:');
//     console.log(e.data);
//   },
//   false,
// );
// workerInstance.postMessage('bar');
// console.log('end...');

function App() {
  // CryptoWorker.modPow([2, 2, 2], [1, 2, 3], [1, 2, 3]); // .then(r => console.log('worker2----', r));
  // new IdleManager().start();
  // emitter.addListener('idle.isIDLE', data => console.log('*****', data));
  // const a = new A();
  // emitter.emit('aaaa');
  // a.r();
  // emitter.emit('aaaa');

  // MtpService.start();

  // const dcID = 4;
  // const options = { dcID, createNetworker: true };
  // MtpApiManager.invokeApi(
  //   'auth.sendCode',
  //   {
  //     flags: 0,
  //     phone_number: '989125621200',
  //     api_id: Config.App.id,
  //     api_hash: Config.App.hash,
  //     lang_code: navigator.language || 'en',
  //   },
  //   options,
  // )
  //   .then(sentCode => {
  //     console.log('auth.sendCode:', sentCode);
  //   })
  //   .catch(e => console.log('auth.sendCode, err:', e));

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
