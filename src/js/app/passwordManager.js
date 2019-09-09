/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { bufferConcat } from './bin';
import crypto from './crypto';

// makePasswordHash
export default (salt, password) => {
  const passwordUTF8 = unescape(encodeURIComponent(password));

  let buffer = new ArrayBuffer(passwordUTF8.length);
  const byteView = new Uint8Array(buffer);
  for (let i = 0, len = passwordUTF8.length; i < len; i += 1) {
    byteView[i] = passwordUTF8.charCodeAt(i);
  }

  buffer = bufferConcat(bufferConcat(salt, byteView), salt);

  return crypto.sha256Hash(buffer);
};
