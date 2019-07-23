/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { TLSerialization } from '../tl';
import { bytesToHex } from '../bin';

it('tl - serialization', () => {
  let serializer = new TLSerialization({ mtproto: true });
  serializer.storeMethod('http_wait', {
    max_delay: 500,
    wait_after: 150,
    max_wait: 25000,
  });
  expect(bytesToHex(serializer.getBytes())).toEqual('9f359992f401000096000000a8610000');
  serializer = new TLSerialization({ mtproto: true });
  serializer.storeMethod('ping', { ping_id: 100 });
  expect(bytesToHex(serializer.getBytes())).toEqual('ec77be7a6400000000000000');
});
