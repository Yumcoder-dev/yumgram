/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import Rusha from 'rusha';
import { Zlib } from 'zlibjs/bin/gunzip.min';
import * as binUtils from '../bin';

it('Rusha', () => {
  const sha1 = new Rusha();
  expect(sha1.digest('')).toEqual('da39a3ee5e6b4b0d3255bfef95601890afd80709');
  // Test one-block message.
  expect(sha1.digest([0x61, 0x62, 0x63])).toEqual('a9993e364706816aba3e25717850c26c9cd0d89d');
  // Test multi-block message.
  expect(sha1.digest('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq')).toEqual(
    '84983e441c3bd26ebaae4aa1f95129e5e54670f1',
  );

  // Test standard message.
  expect(sha1.digest('The quick brown fox jumps over the lazy dog')).toEqual(
    '2fd4e1c67a2d28fced849ee1bb76e7391b93eb12',
  );
});

it('Zlib', () => {
  const testData = 'H4sIAAAAAAAAA0tMTEwEAEXlmK0EAAAA';
  const plain = new Uint8Array('aaaa'.split('').map(c => c.charCodeAt(0)));
  const decodedData = Uint8Array.from(atob(testData), c => c.charCodeAt(0)); // base64
  expect(new Zlib.Gunzip(decodedData).decompress()).toEqual(plain);
});

it('binary utils - bigint', () => {
  const x = binUtils.bigint('abcd1234');
  const y = binUtils.bigint('beef');
  const z = x.mod(y);
  expect(z.toString(16)).toEqual('b60c');
});

it('binary utils - bigStringInt', () => {
  const x = binUtils.bigStringInt('100');
  const y = binUtils.bigStringInt('3');
  const z = x.mod(y);
  expect(z.toString(10)).toEqual('1');
});

// it('binary utils - dHexDump', () => {
//   binUtils.dHexDump(
//     '1ba15a378544b2f39fcfd7f669cc455c01783a78094278b76170cdaa2bb37e9d926ce24554ab4539f5117e322dc5' +
//       'ee03ca7e637533d206671b190bfccf628012ac65b4e05582cf4f64ea7e46b14eb7b4f85e83d7b7477e66c808ff' +
//       '647248b3f9a0082f5da7f2a2f4a2d0ab6b113c9e585a3c81aa632c8f62223b5f227b4a80ff4ba64450586d7418' +
//       'b9e23974aa26d6c8ccd36d2e2c740dd64117e4f9c6370142f57b6f46be2aaa3163da80e125407060b1b5e722f7',
//   );
// });

it('binary utils - bytesToHex', () => {
  const x = binUtils.bytesToHex([10, 2, 3]);
  expect(x).toEqual('0a0203');
});

it('binary utils - bytesFromHex', () => {
  const x = binUtils.bytesFromHex('0a0203');
  expect(x).toEqual([10, 2, 3]);
});

it('binary utils - bytesToBase64', () => {
  const x = binUtils.bytesToBase64('☸☹☺☻☼☾☿');
  expect(x).toEqual('AAAAAAAAAA==');
});

// #todo blobbuilder is not deined
// it('binary utils - blobConstruct', () => {
//   const x = binUtils.blobConstruct('☸☹☺☻☼☾☿', 'image/jpeg');
//   expect(x).toEqual('AAAAAAAAAA==');
// });

it('binary utils - bytesCmp', () => {
  const x1 = binUtils.bytesCmp([], []);
  expect(x1).toEqual(true);

  const x2 = binUtils.bytesCmp([1], [1]);
  expect(x2).toEqual(true);

  const x3 = binUtils.bytesCmp([1], [1, 2]);
  expect(x3).toEqual(false);

  const x4 = binUtils.bytesCmp('abc', 'abc');
  expect(x4).toEqual(true);
});

it('binary utils - bytesXor', () => {
  const x1 = binUtils.bytesXor([], []);
  expect(x1).toEqual([]);

  const x2 = binUtils.bytesXor([1], [1]);
  expect(x2).toEqual([0]);

  const x3 = binUtils.bytesXor([1], [2]);
  expect(x3).toEqual([3]);
});

it('binary utils - bufferConcat', () => {
  const buffer = new ArrayBuffer(8);
  const uint8 = new Uint8Array(buffer);
  // Copy the values into the array starting at index 3
  uint8.set([1, 2, 3], 3); // Uint8Array [0, 0, 0, 1, 2, 3, 0, 0]
  const x2 = binUtils.bufferConcat(new Uint8Array(buffer, 1, 2), new Uint8Array(buffer, 4, 2));
  expect(new Uint8Array(x2)).toEqual(new Uint8Array([0, 0, 2, 3]));
});

it('binary utils - bytesToArrayBuffer', () => {
  const x = binUtils.bytesToArrayBuffer([1, 2, 3]);
  expect(new Uint8Array(x)).toEqual(new Uint8Array([1, 2, 3]));
});

it('binary utils - longToBytes', () => {
  expect(binUtils.longToBytes('257')).toEqual([1, 1, 0, 0, 0, 0, 0, 0]);
});

it('binary utils - longFromInts', () => {
  expect(binUtils.longFromInts(10, 100)).toEqual('42949673060');
});

it('binary utils - intToUint', () => {
  expect(binUtils.intToUint(-10)).toEqual(4294967286);
  expect(binUtils.intToUint(2 ** 31)).toEqual(2147483648);
});

it('binary utils - uintToInt', () => {
  expect(binUtils.uintToInt(-10)).toEqual(-10);
  expect(binUtils.uintToInt(2 ** 32)).toEqual(0);
});

it('binary utils - sha1HashSync', () => {
  const sha1 = binUtils.sha1HashSync('abc');
  expect(binUtils.bytesToHex(new Uint8Array(sha1))).toEqual(
    'a9993e364706816aba3e25717850c26c9cd0d89d',
  );
  const sha1Yum = binUtils.sha1HashSync('yumcoder');
  expect(binUtils.bytesToHex(new Uint8Array(sha1Yum))).toEqual(
    'fd6727fa5cc9a76f949a2fa030195c0c7f637c0b',
  );
});

it('binary utils - sha1BytesSync', () => {
  const sha1 = binUtils.sha1BytesSync([1, 2, 3]);
  expect(binUtils.bytesToHex(new Uint8Array(sha1))).toEqual(
    '7037807198c22a7d2b0807371d763779a84fdfcf',
  );
});

it('binary utils - bytesModPow', () => {
  const x = binUtils.bytesModPow([2, 2, 2], [1, 2, 3], [1, 2, 3]);
  expect(x).toEqual([55, 158]);
});

it('binary utils - sha256HashSync', () => {
  const sha256 = binUtils.sha256HashSync([1, 2, 3]);
  expect(binUtils.bytesToHex(sha256)).toEqual(
    '039058c6f2c0cb492c533b0a4d14ef77cc0f78abccced5287d84a1a2011cfb81',
  );
});

it('binary utils - aesEncryptSync', () => {
  const got =
    'af507156ad37da662091d4be60785e9e9cda022acc4a345d05000000100000009f359992f401000096000000a861000024e8c118bd50a595877bd2c57d4813c752102b3c824b76989473e80edba80b71fac3300c869b247b9bfd5fe8ca4c1244e342f40e768610d18c7e1662b79311ea';
  const wanted =
    '07dbd1c8db96ef556ca0b4800130bcc4a7f0c9095b9db5a6b7ff0257192b2593d5d9fa532273f6656ad3ba6532fd4a833762e3ecd1358d8e2054c35f2daa9e63e1eaffbb6442bda010b11ce7ab8dd970c7499a67992218ad7bfae11b02f859188f75dcc81c7d74390e7e9a161d6e5218';

  const k1 = [
    255,
    8,
    154,
    197,
    222,
    10,
    112,
    222,
    63,
    231,
    64,
    173,
    76,
    204,
    83,
    229,
    77,
    177,
    149,
    107,
    180,
    135,
    1,
    23,
    78,
    230,
    26,
    71,
    253,
    150,
    175,
    24,
  ];
  const k2 = [
    53,
    71,
    224,
    228,
    216,
    56,
    167,
    236,
    21,
    241,
    164,
    107,
    180,
    185,
    108,
    151,
    55,
    133,
    5,
    255,
    195,
    228,
    210,
    64,
    80,
    137,
    223,
    195,
    45,
    23,
    53,
    188,
  ];

  const aes = binUtils.aesEncryptSync(binUtils.bytesFromHex(got), k1, k2);
  expect(binUtils.bytesToHex(aes)).toEqual(wanted);
});
