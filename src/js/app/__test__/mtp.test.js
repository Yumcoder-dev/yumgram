/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

// import MtpAuthorizer from '../mtpAuthorizer';
import MtpApiManager from '../mtpApiManager';
import Config from '../config';

// it('auth', async () => {
//   let i = 0;
//   await MtpAuthorizer.auth(2).then(() => {
//     i += 1;
//   });
//   await expect(i).toBe(1);
// }, 60000);

it('network', async () => {
  // console.log('network1');
  // let i = 0;
  // const dcID = 2;
  // const options = { dcID, createNetworker: true };
  // await MtpApiManager.invokeApi(
  //   'auth.sendCode',
  //   {
  //     flags: 0,
  //     phone_number: '989125621200',
  //     api_id: Config.App.id,
  //     api_hash: Config.App.hash,
  //     lang_code: navigator.language || 'en',
  //   },
  //   options,
  // ).then(sentCode => {
  //   i += 1;
  //   console.log('auth.sendCode', sentCode);
  // });
  // await expect(i).toBe(1);
}, 60000);
