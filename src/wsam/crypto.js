/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { createWebAssembly, getImportObject } from './wsam';

class Crypto {
  constructor() {
    this.cachePromise = {};
  }

  getInstance() {
    if (this.cachePromise.Crypto) {
      return this.cachePromise.Crypto;
    }
    this.cachePromise.Crypto = createWebAssembly('aes.wasm', getImportObject());
    return this.cachePromise.Crypto;
  }

  aesEncrypt(encryptedBytes, keyBytes, ivBytes) {
    this.getInstance().a(encryptedBytes, keyBytes, ivBytes);
  }

  aesDecrypt(bytes, keyBytes, ivBytes) {
    this.getInstance().b(bytes, keyBytes, ivBytes);
  }

  factorize(bytes) {
    this.getInstance().then(instance => {
      instance.a(bytes);
    });
  }
}

export default Crypto;
