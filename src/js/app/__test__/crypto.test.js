/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import Crypto from '../crypto';
import { bytesToHex } from '../bin';

it('crypto - sha256Hash', async () => {
  const sha256 = await Crypto.sha256Hash([1, 2, 3]);
  expect(bytesToHex(sha256)).toEqual(
    '039058c6f2c0cb492c533b0a4d14ef77cc0f78abccced5287d84a1a2011cfb81',
  );
});
