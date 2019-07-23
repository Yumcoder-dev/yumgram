/* eslint-disable no-param-reassign */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import {
  convertToUint8Array,
  sha256HashSync,
  bytesModPow,
  addPadding,
  convertToArrayBuffer,
  convertToByteArray,
  aesEncryptSync,
  pqPrimeFactorization,
  aesDecryptSync,
} from './bin';
import Config from './config';
import Timeout from './timeout';
import Defer from './defer';

class CryptoManger {
  constructor() {
    this.webWorker = false;
    this.awaiting = {};
    this.taskID = 0;
    this.webCrypto =
      Config.Modes.webcrypto &&
      window.crypto &&
      (window.crypto.subtle || window.crypto.webkitSubtle);
    this.useSha256Crypto = this.webCrypto && this.webCrypto.digest !== undefined;
    // #todo wsam/nacl
    this.naClEmbed = false; // todo
    if (window.Worker) {
      // console.error('CW start...');
      // const tmpWorker = new Worker('./crypto.worker.js');
      // this.webWorker = tmpWorker;
      // tmpWorker.onmessage = e => {
      //   console.error('CW onmessage...');
      //   if (!this.webWorker) {
      //     this.webWorker = tmpWorker;
      //   } else {
      //     this.finalizeTask(e.data.taskID, e.data.result);
      //   }
      // };
      // tmpWorker.onerror = error => {
      //   console.error('CW error', error, error.stack);
      //   this.webWorker = false;
      // };
    }
  }

  finalizeTask(taskID, result) {
    const deferred = this.awaiting[taskID];
    if (deferred !== undefined) {
      // console.log(dT(), 'CW done')
      deferred.resolve(result);
      delete this.awaiting[taskID];
    }
  }

  performTaskWorker(task, params, embed) {
    // console.log(dT(), 'CW start', task)
    // const deferred = new Promise();

    // this.awaiting[this.taskID] = deferred;

    params.task = task;
    params.taskID = this.taskID;
    (embed || this.webWorker).postMessage(params);

    this.taskID += 1;

    // return deferred;
  }

  sha256Hash(bytes) {
    if (this.useSha256Crypto) {
      const deferred = new Defer();
      const bytesTyped = Array.isArray(bytes) ? convertToUint8Array(bytes) : bytes;
      // console.log(dT(), 'Native sha1 start')
      this.webCrypto.digest({ name: 'SHA-256' }, bytesTyped).then(
        digest => {
          // console.log(dT(), 'Native sha1 done')
          deferred.resolve(digest);
        },
        e => {
          console.error('Crypto digest error', e);
          this.useSha256Crypto = false;
          deferred.resolve(sha256HashSync(bytes));
        },
      );

      return deferred.promise;
    }

    return new Timeout(() => sha256HashSync(bytes)).promise;
  }

  aesEncrypt(bytes, keyBytes, ivBytes) {
    if (this.naClEmbed) {
      return this.performTaskWorker(
        'aes-encrypt',
        {
          bytes: addPadding(convertToArrayBuffer(bytes)),
          keyBytes: convertToArrayBuffer(keyBytes),
          ivBytes: convertToArrayBuffer(ivBytes),
        },
        this.naClEmbed,
      );
    }
    return new Timeout(() => convertToArrayBuffer(aesEncryptSync(bytes, keyBytes, ivBytes)))
      .promise;
  }

  aesDecrypt(encryptedBytes, keyBytes, ivBytes) {
    if (this.naClEmbed) {
      return this.performTaskWorker(
        'aes-decrypt',
        {
          encryptedBytes: addPadding(convertToArrayBuffer(encryptedBytes)),
          keyBytes: convertToArrayBuffer(keyBytes),
          ivBytes: convertToArrayBuffer(ivBytes),
        },
        this.naClEmbed,
      );
    }
    return new Timeout(() =>
      convertToArrayBuffer(aesDecryptSync(encryptedBytes, keyBytes, ivBytes)),
    ).promise;
  }

  factorize(bytes) {
    bytes = convertToByteArray(bytes);
    if (this.naClEmbed && bytes.length <= 8) {
      return this.performTaskWorker('factorize', { bytes }, this.naClEmbed);
    }
    if (this.webWorker) {
      return this.performTaskWorker('factorize', { bytes });
    }
    return new Timeout(() => pqPrimeFactorization(bytes)).promise;
  }

  modPow(x, y, m) {
    console.error('CW modPow...', window.Worker, this.webWorker);

    if (this.webWorker) {
      return this.performTaskWorker('mod-pow', {
        x,
        y,
        m,
      });
    }
    return new Timeout(() => bytesModPow(x, y, m)).promise;
  }
}

const Crypto = new CryptoManger();
export default Crypto;
