/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { BigInteger, SecureRandom } from 'jsbn';
import {
  one,
  bigInt2str,
  bpe,
  copyInt_,
  copy_,
  isZero,
  add_,
  greater,
  rightShift_,
  divide_,
  sub_,
  eGCD_,
  equalsInt,
  str2bigInt,
  powMod,
} from 'leemon';
import Rusha from 'rusha';
import { Zlib } from 'zlibjs/bin/gunzip.min';
import CryptoJS from './vendor/crypto';
import Long from './long';

export function bigint(num) {
  return new BigInteger(num.toString(16), 16);
}

export function bigStringInt(strNum) {
  return new BigInteger(strNum, 10);
}

export function dHexDump(bytes) {
  const arr = [];
  for (let i = 0; i < bytes.length; i += 1) {
    if (i && !(i % 2)) {
      if (!(i % 16)) {
        arr.push('\n');
      } else if (!(i % 4)) {
        arr.push('  ');
      } else {
        arr.push(' ');
      }
    }
    arr.push((bytes[i] < 16 ? '0' : '') + bytes[i].toString(16));
  }

  // eslint-disable-next-line no-console
  console.log(arr.join(''));
}

export function bytesToHex(bytes) {
  const hex = bytes || [];
  const arr = [];
  for (let i = 0; i < hex.length; i += 1) {
    arr.push((hex[i] < 16 ? '0' : '') + (hex[i] || 0).toString(16));
  }
  return arr.join('');
}

export function bytesFromHex(hexString) {
  const len = hexString.length;
  let i;
  let start = 0;
  const bytes = [];

  if (hexString.length % 2) {
    bytes.push(parseInt(hexString.charAt(0), 16));
    start += 1;
  }

  for (i = start; i < len; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16));
  }

  return bytes;
}

function uint6ToBase64(nUint6) {
  /* eslint-disable no-nested-ternary */
  return nUint6 < 26
    ? nUint6 + 65
    : nUint6 < 52
    ? nUint6 + 71
    : nUint6 < 62
    ? nUint6 - 4
    : nUint6 === 62
    ? 43
    : nUint6 === 63
    ? 47
    : 65;
  /* eslint-disable no-nested-ternary */
}

export function bytesToBase64(bytes) {
  let mod3;
  let result = '';

  for (let nLen = bytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx += 1) {
    mod3 = nIdx % 3;
    // eslint-disable-next-line no-bitwise
    nUint24 |= bytes[nIdx] << ((16 >>> mod3) & 24);
    if (mod3 === 2 || nLen - nIdx === 1) {
      result += String.fromCharCode(
        /* eslint-disable no-bitwise */
        uint6ToBase64((nUint24 >>> 18) & 63),
        uint6ToBase64((nUint24 >>> 12) & 63),
        uint6ToBase64((nUint24 >>> 6) & 63),
        uint6ToBase64(nUint24 & 63),
        /* eslint-disable no-bitwise */
      );
      nUint24 = 0;
    }
  }

  return result.replace(/A(?=A$|$)/g, '=');
}

export function blobSafeMimeType(mimeType) {
  if (
    [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'audio/ogg',
      'audio/mpeg',
      'audio/mp4',
    ].indexOf(mimeType) === -1
  ) {
    return 'application/octet-stream';
  }
  return mimeType;
}

export function blobConstruct(blobParts, mimeType) {
  let blob;
  const safeMimeType = blobSafeMimeType(mimeType);
  try {
    blob = new Blob(blobParts, { type: safeMimeType });
  } catch (e) {
    // eslint-disable-next-line no-undef
    const bb = new BlobBuilder();
    for (let i = 0; i < blobParts.length; i += 1) {
      bb.append(blobParts[i]);
    }
    blob = bb.getBlob(safeMimeType);
  }
  return blob;
}

export function base64ToBlob(base64str, mimeType) {
  const sliceSize = 1024;
  const byteCharacters = atob(base64str);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; sliceIndex += 1) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; i += 1, offset += 1) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }

  return blobConstruct(byteArrays, mimeType);
}

export function dataUrlToBlob(url) {
  // var name = 'b64blob ' + url.length
  // console.time(name)
  const urlParts = url.split(',');
  const base64str = urlParts[1];
  const mimeType = urlParts[0].split(':')[1].split(';')[0];
  const blob = base64ToBlob(base64str, mimeType);
  // console.timeEnd(name)
  return blob;
}

export function bytesCmp(bytes1, bytes2) {
  const len = bytes1.length;
  if (len !== bytes2.length) {
    return false;
  }

  for (let i = 0; i < len; i += 1) {
    if (bytes1[i] !== bytes2[i]) {
      return false;
    }
  }
  return true;
}

export function bytesXor(bytes1, bytes2) {
  const len = bytes1.length;
  const bytes = [];

  for (let i = 0; i < len; i += 1) {
    bytes[i] = bytes1[i] ^ bytes2[i];
  }

  return bytes;
}

function bytesToWords(bytes) {
  if (bytes instanceof ArrayBuffer) {
    // eslint-disable-next-line no-param-reassign
    bytes = new Uint8Array(bytes);
  }
  const len = bytes.length;
  const words = [];
  let i;
  for (i = 0; i < len; i += 1) {
    words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
  }

  return CryptoJS.lib.WordArray.create(words, len);
}

function bytesFromWords(wordArray) {
  const { words } = wordArray;
  const { sigBytes } = wordArray;
  const bytes = [];

  for (let i = 0; i < sigBytes; i += 1) {
    bytes.push((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
  }

  return bytes;
}

export function bufferConcat(buffer1, buffer2) {
  const l1 = buffer1.byteLength || buffer1.length;
  const l2 = buffer2.byteLength || buffer2.length;
  const tmp = new Uint8Array(l1 + l2);
  tmp.set(buffer1 instanceof ArrayBuffer ? new Uint8Array(buffer1) : buffer1, 0);
  tmp.set(buffer2 instanceof ArrayBuffer ? new Uint8Array(buffer2) : buffer2, l1);

  return tmp.buffer;
}

function bytesFromBigInt(bigInt, len) {
  let bytes = bigInt.toByteArray();

  if (len && bytes.length < len) {
    const padding = [];
    for (let i = 0, needPadding = len - bytes.length; i < needPadding; i += 1) {
      padding[i] = 0;
    }
    if (bytes instanceof ArrayBuffer) {
      bytes = bufferConcat(padding, bytes);
    } else {
      bytes = padding.concat(bytes);
    }
  } else {
    while (!bytes[0] && (!len || bytes.length > len)) {
      bytes = bytes.slice(1);
    }
  }

  return bytes;
}

function bytesFromLeemonBigInt(bigInt) {
  const str = bigInt2str(bigInt, 16);
  return bytesFromHex(str);
}

export function bytesToArrayBuffer(b) {
  return new Uint8Array(b).buffer;
}

export function convertToArrayBuffer(bytes) {
  // Be careful with converting subarrays!!
  if (bytes instanceof ArrayBuffer) {
    return bytes;
  }
  if (
    bytes.buffer !== undefined &&
    bytes.buffer.byteLength === bytes.length * bytes.BYTES_PER_ELEMENT
  ) {
    return bytes.buffer;
  }
  return bytesToArrayBuffer(bytes);
}

export function convertToUint8Array(bytes) {
  if (bytes.buffer !== undefined) {
    return bytes;
  }
  return new Uint8Array(bytes);
}

export function convertToByteArray(bytes) {
  if (Array.isArray(bytes) || bytes instanceof Array) {
    return bytes;
  }
  const byteArray = convertToUint8Array(bytes);
  const newBytes = [];
  for (let i = 0, len = byteArray.length; i < len; i += 1) {
    newBytes.push(byteArray[i]);
  }
  return newBytes;
}

export function bytesFromArrayBuffer(buffer) {
  const len = buffer.byteLength;
  const byteView = new Uint8Array(buffer);
  const bytes = [];

  for (let i = 0; i < len; i += 1) {
    bytes[i] = byteView[i];
  }

  return bytes;
}

function longToInts(sLong) {
  const divRem = bigStringInt(sLong).divideAndRemainder(bigint(0x100000000));

  return [divRem[0].intValue(), divRem[1].intValue()];
}

export function longToBytes(sLong) {
  return bytesFromWords({ words: longToInts(sLong), sigBytes: 8 }).reverse();
}

export function longFromInts(high, low) {
  return bigint(high)
    .shiftLeft(32)
    .add(bigint(low))
    .toString(10);
}

export function intToUint(val) {
  let result = parseInt(val, 10);
  if (result < 0) {
    result += 4294967296;
  }
  return result;
}

export function uintToInt(val) {
  if (val > 2147483647) {
    return val - 4294967296;
  }
  return val;
}

let rushaInstance;
export function sha1HashSync(bytes) {
  rushaInstance = rushaInstance || new Rusha(1024 * 1024);

  // console.log(dT(), 'SHA-1 hash start', bytes.byteLength || bytes.length)
  const hashBytes = rushaInstance.rawDigest(bytes).buffer;
  // console.log(dT(), 'SHA-1 hash finish')

  return hashBytes;
}

export function sha1BytesSync(bytes) {
  return bytesFromArrayBuffer(sha1HashSync(bytes));
}

export function sha256HashSync(bytes) {
  // console.log(dT(), 'SHA-2 hash start', bytes.byteLength || bytes.length)
  const hashWords = CryptoJS.SHA256(bytesToWords(bytes));
  // console.log(dT(), 'SHA-2 hash finish')

  const hashBytes = bytesFromWords(hashWords);

  return hashBytes;
}

export function addPadding(bytes, blockSize, zeroes) {
  /* eslint-disable no-param-reassign */
  blockSize = blockSize || 16;
  const len = bytes.byteLength || bytes.length;
  const needPadding = blockSize - (len % blockSize);
  if (needPadding > 0 && needPadding < blockSize) {
    const padding = new Array(needPadding);
    if (zeroes) {
      for (let i = 0; i < needPadding; i += 1) {
        padding[i] = 0;
      }
    } else {
      new SecureRandom().nextBytes(padding);
    }

    if (bytes instanceof ArrayBuffer) {
      bytes = bufferConcat(bytes, padding);
    } else {
      bytes = bytes.concat(padding);
    }
  }
  /* eslint-disable no-param-reassign */

  return bytes;
}

export function rsaEncrypt(publicKey, bytes) {
  // eslint-disable-next-line no-param-reassign
  bytes = addPadding(bytes, 255);

  // console.log('RSA encrypt start')
  const N = new BigInteger(publicKey.modulus, 16);
  const E = new BigInteger(publicKey.exponent, 16);
  const X = new BigInteger(bytes);
  const encryptedBigInt = X.modPowInt(E, N);
  const encryptedBytes = bytesFromBigInt(encryptedBigInt, 256);
  // console.log('RSA encrypt finish')

  return encryptedBytes;
}

export function aesEncryptSync(bytes, keyBytes, ivBytes) {
  // console.log(dT(), 'AES encrypt start', len/*, bytesToHex(keyBytes), bytesToHex(ivBytes)*/)
  bytes = addPadding(bytes);

  const encryptedWords = CryptoJS.AES.encrypt(bytesToWords(bytes), bytesToWords(keyBytes), {
    iv: bytesToWords(ivBytes),
    padding: CryptoJS.pad.NoPadding,
    mode: CryptoJS.mode.IGE,
  }).ciphertext;

  const encryptedBytes = bytesFromWords(encryptedWords);
  // console.log(dT(), 'AES encrypt finish')

  return encryptedBytes;
}

export function aesDecryptSync(encryptedBytes, keyBytes, ivBytes) {
  // console.log(dT(), 'AES decrypt start', encryptedBytes.length)
  const decryptedWords = CryptoJS.AES.decrypt(
    { ciphertext: bytesToWords(encryptedBytes) },
    bytesToWords(keyBytes),
    {
      iv: bytesToWords(ivBytes),
      padding: CryptoJS.pad.NoPadding,
      mode: CryptoJS.mode.IGE,
    },
  );

  const bytes = bytesFromWords(decryptedWords);
  // console.log(dT(), 'AES decrypt finish')

  return bytes;
}

export function gzipUncompress(bytes) {
  // console.log('Gzip uncompress start')
  const result = new Zlib.Gunzip(bytes).decompress();
  // console.log('Gzip uncompress finish')
  return result;
}

export function nextRandomInt(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

export function pqPrimeBigInteger(what) {
  let it = 0;
  let g;
  for (let i = 0; i < 3; i += 1) {
    const q = (nextRandomInt(128) & 15) + 17;
    let x = bigint(nextRandomInt(1000000000) + 1);
    let y = x.clone();
    const lim = 1 << (i + 18);

    for (let j = 1; j < lim; j += 1) {
      it += 1;
      let a = x.clone();
      let b = x.clone();
      let c = bigint(q);

      while (!b.equals(BigInteger.ZERO)) {
        if (!b.and(BigInteger.ONE).equals(BigInteger.ZERO)) {
          c = c.add(a);
          if (c.compareTo(what) > 0) {
            c = c.subtract(what);
          }
        }
        a = a.add(a);
        if (a.compareTo(what) > 0) {
          a = a.subtract(what);
        }
        b = b.shiftRight(1);
      }

      x = c.clone();
      const z = x.compareTo(y) < 0 ? y.subtract(x) : x.subtract(y);
      g = z.gcd(what);
      if (!g.equals(BigInteger.ONE)) {
        break;
      }
      if ((j & (j - 1)) === 0) {
        y = x.clone();
      }
    }
    if (g.compareTo(BigInteger.ONE) > 0) {
      break;
    }
  }

  const f = what.divide(g);
  let P;
  let Q;

  if (g.compareTo(f) > 0) {
    P = f;
    Q = g;
  } else {
    P = g;
    Q = f;
  }

  return [bytesFromBigInt(P), bytesFromBigInt(Q), it];
}

export function gcdLong(a, b) {
  while (a.notEquals(Long.ZERO) && b.notEquals(Long.ZERO)) {
    while (b.and(Long.ONE).equals(Long.ZERO)) {
      b = b.shiftRight(1);
    }
    while (a.and(Long.ONE).equals(Long.ZERO)) {
      a = a.shiftRight(1);
    }
    if (a.compare(b) > 0) {
      a = a.subtract(b);
    } else {
      b = b.subtract(a);
    }
  }
  return b.equals(Long.ZERO) ? a : b;
}

export function pqPrimeLeemon(what) {
  const minBits = 64;
  const minLen = Math.ceil(minBits / bpe) + 1;
  let it = 0;
  let i;
  let q;
  let j;
  let lim;
  let P;
  let Q;
  const a = new Array(minLen);
  const b = new Array(minLen);
  const c = new Array(minLen);
  const g = new Array(minLen);
  const z = new Array(minLen);
  const x = new Array(minLen);
  const y = new Array(minLen);

  for (i = 0; i < 3; i += 1) {
    q = (nextRandomInt(128) & 15) + 17;
    copyInt_(x, nextRandomInt(1000000000) + 1);
    copy_(y, x);
    lim = 1 << (i + 18);

    for (j = 1; j < lim; j += 1) {
      it += 1;
      copy_(a, x);
      copy_(b, x);
      copyInt_(c, q);

      while (!isZero(b)) {
        if (b[0] & 1) {
          add_(c, a);
          if (greater(c, what)) {
            sub_(c, what);
          }
        }
        add_(a, a);
        if (greater(a, what)) {
          sub_(a, what);
        }
        rightShift_(b, 1);
      }

      copy_(x, c);
      if (greater(x, y)) {
        copy_(z, x);
        sub_(z, y);
      } else {
        copy_(z, y);
        sub_(z, x);
      }
      eGCD_(z, what, g, a, b);
      if (!equalsInt(g, 1)) {
        break;
      }
      if ((j & (j - 1)) === 0) {
        copy_(y, x);
      }
    }
    if (greater(g, one)) {
      break;
    }
  }

  divide_(what, g, x, y);

  if (greater(g, x)) {
    P = x;
    Q = g;
  } else {
    P = g;
    Q = x;
  }

  // console.log(dT(), 'done', bigInt2str(what, 10), bigInt2str(P, 10), bigInt2str(Q, 10))

  return [bytesFromLeemonBigInt(P), bytesFromLeemonBigInt(Q), it];
}

export function pqPrimeLong(what) {
  let it = 0;
  let g;
  for (let i = 0; i < 3; i += 1) {
    const q = Long.fromInt((nextRandomInt(128) & 15) + 17);
    let x = Long.fromInt(nextRandomInt(1000000000) + 1);
    let y = x;
    const lim = 1 << (i + 18);

    for (let j = 1; j < lim; j += 1) {
      it += 1;
      let a = x;
      let b = x;
      let c = q;

      while (b.notEquals(Long.ZERO)) {
        if (b.and(Long.ONE).notEquals(Long.ZERO)) {
          c = c.add(a);
          if (c.compare(what) > 0) {
            c = c.subtract(what);
          }
        }
        a = a.add(a);
        if (a.compare(what) > 0) {
          a = a.subtract(what);
        }
        b = b.shiftRight(1);
      }

      x = c;
      const z = x.compare(y) < 0 ? y.subtract(x) : x.subtract(y);
      g = gcdLong(z, what);
      if (g.notEquals(Long.ONE)) {
        break;
      }
      if ((j & (j - 1)) === 0) {
        y = x;
      }
    }
    if (g.compare(Long.ONE) > 0) {
      break;
    }
  }

  const f = what.div(g);
  let P;
  let Q;

  if (g.compare(f) > 0) {
    P = f;
    Q = g;
  } else {
    P = g;
    Q = f;
  }

  return [bytesFromHex(P.toString(16)), bytesFromHex(Q.toString(16)), it];
}

export function pqPrimeFactorization(pqBytes) {
  const what = new BigInteger(pqBytes);
  let result = false;

  // console.log(dT(), 'PQ start', pqBytes, what.toString(16), what.bitLength())

  try {
    result = pqPrimeLeemon(str2bigInt(what.toString(16), 16, Math.ceil(64 / bpe) + 1));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Pq leemon Exception', e);
  }

  if (result === false && what.bitLength() <= 64) {
    // console.time('PQ long')
    try {
      result = pqPrimeLong(Long.fromString(what.toString(16), 16));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Pq long Exception', e);
    }
    // console.timeEnd('PQ long')
  }
  // console.log(result)

  if (result === false) {
    // console.time('pq BigInt')
    result = pqPrimeBigInteger(what);
    // console.timeEnd('pq BigInt')
  }

  // console.log(dT(), 'PQ finish')

  return result;
}

export function bytesModPow(x, y, m) {
  try {
    const xBigInt = str2bigInt(bytesToHex(x), 16);
    const yBigInt = str2bigInt(bytesToHex(y), 16);
    const mBigInt = str2bigInt(bytesToHex(m), 16);
    const resBigInt = powMod(xBigInt, yBigInt, mBigInt);

    return bytesFromHex(bigInt2str(resBigInt, 16));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('mod pow error', e);
  }

  return bytesFromBigInt(new BigInteger(x).modPow(new BigInteger(y), new BigInteger(m)), 256);
}
