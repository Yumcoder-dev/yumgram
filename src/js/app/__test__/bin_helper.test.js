/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import Rusha from 'rusha';
import { Zlib } from 'zlibjs/bin/gunzip.min';
import {
  bigint,
  bigStringInt,
  dHexDump,
  bytesToHex,
  bytesFromHex,
  bytesToBase64,
} from '../bin_helper';

it('binary bigint', () => {
  const x = bigint('abcd1234');
  const y = bigint('beef');
  const z = x.mod(y);
  expect(z.toString(16)).toEqual('b60c');
});

it('binary bigStringInt', () => {
  const x = bigStringInt('100');
  const y = bigStringInt('3');
  const z = x.mod(y);
  expect(z.toString(10)).toEqual('1');
});

it('binary dHexDump', () => {
  dHexDump(
    '1ba15a378544b2f39fcfd7f669cc455c01783a78094278b76170cdaa2bb37e9d926ce24554ab4539f5117e322dc5' +
      'ee03ca7e637533d206671b190bfccf628012ac65b4e05582cf4f64ea7e46b14eb7b4f85e83d7b7477e66c808ff' +
      '647248b3f9a0082f5da7f2a2f4a2d0ab6b113c9e585a3c81aa632c8f62223b5f227b4a80ff4ba64450586d7418' +
      'b9e23974aa26d6c8ccd36d2e2c740dd64117e4f9c6370142f57b6f46be2aaa3163da80e125407060b1b5e722f7',
  );
});

it('binary bytesToHex', () => {
  const x = bytesToHex([10, 2, 3]);
  expect(x).toEqual('0a0203');
});

it('binary bytesFromHex', () => {
  const x = bytesFromHex('0a0203');
  expect(x).toEqual([10, 2, 3]);
});

it('binary bytesToBase64', () => {
  const x = bytesToBase64('☸☹☺☻☼☾☿');
  expect(x).toEqual('AAAAAAAAAA==');
});

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
