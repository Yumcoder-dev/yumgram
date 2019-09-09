/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import MtpSecureRandom from '../mtpSecureRandom';

it('secure random - ', () => {
  // usage example
  const data = [];
  for (let i = 0; i < 10; i += 1) {
    const saltRandom = new Array(8);
    MtpSecureRandom.nextBytes(saltRandom);
    data.push(saltRandom);
  }
  // console.log('xxxx', data);
});
