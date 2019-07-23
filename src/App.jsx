/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.module.less';
import routes from './router';
// import CryptoWorker from './js/app/crypto';
import IdleManager from './js/app/idle';
import emitter from './js/core/emitter';
import MtpApiManager from './js/app/mtpApiManager';
import Config from './js/app/config';
import MtpService from './js/app/mtpService';

class A {
  constructor() {
    this.a = 100;
    this.ecb = emitter.addListener('aaaa', () => this.f());
  }

  f() {
    console.log('aaaa', this.a);
  }

  r() {
    this.ecb.remove();
  }
}
function App() {
  // CryptoWorker.modPow([2, 2, 2], [1, 2, 3], [1, 2, 3]); // .then(r => console.log('worker2----', r));
  // new IdleManager().start();
  // emitter.addListener('idle.isIDLE', data => console.log('*****', data));
  // const a = new A();
  // emitter.emit('aaaa');
  // a.r();
  // emitter.emit('aaaa');
  MtpService.start();
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
