/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-restricted-globals */
import {
  aesEncryptSync,
  aesDecryptSync,
  // sha1HashSync,
  bytesModPow,
  pqPrimeFactorization,
} from './bin';

onmessage = e => {
  // eslint-disable-line no-restricted-globals
  if (!e) return;

  const { taskID } = e.data;
  let result;

  switch (e.data.task) {
    case 'factorize':
      result = pqPrimeFactorization(e.data.bytes);
      break;

    case 'mod-pow':
      result = bytesModPow(e.data.x, e.data.y, e.data.m);
      result = 1;
      break;

    // case 'sha1-hash':
    //   result = sha1HashSync(e.data.bytes);
    //   break;

    case 'aes-encrypt':
      result = aesEncryptSync(e.data.bytes, e.data.keyBytes, e.data.ivBytes);
      break;

    case 'aes-decrypt':
      result = aesDecryptSync(e.data.encryptedBytes, e.data.keyBytes, e.data.ivBytes);
      break;

    default:
      throw new Error(`Unknown task: ${e.data.task}`);
  }

  postMessage({ taskID, result });
};
