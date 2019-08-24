/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Crypto from '../src/wsam/crypto';
import { Button } from '@storybook/react/demo';

const cryptoStories = storiesOf('wasm/crypto', module);
////////////////////////////////////////////////////////////////////////////////////////////////////
const aesEncrypt = () => {
  //Tutorial.callJsFuncFromC().then(res => console.log('callJsFuncFromC 10+30=', res));
  console.log('todo');
};
cryptoStories.add(
  'aesEncrypt',
  () => <Button onClick={aesEncrypt}>call native aesEncrypt</Button>,
  { notes: 'native aes encrypt' },
);
////////////////////////////////////////////////////////////////////////////////////////////////////
const aesDecrypt = () => {
  //Tutorial.callJsFuncFromC().then(res => console.log('callJsFuncFromC 10+30=', res));
  console.log('todo');
};
cryptoStories.add(
  'aesDecrypt',
  () => <Button onClick={aesDecrypt}>call native aesDecrypt</Button>,
  { notes: 'native aes decrypt' },
);
////////////////////////////////////////////////////////////////////////////////////////////////////
const factorize = () => {
  Crypto.factorize([0x17, 0xed, 0x48, 0x94, 0x1a, 0x08, 0xf9, 0x81]).then(res =>
    console.log('0X494C553B = 1229739323 or [73, 76, 85, 59]'),
    console.log('0X53911073 = 1402015859 or [83, 145, 16, 115]'),
    console.log('factorize 17ED48941A08F981=0X494C553B x 0X53911073', res),
  );
};
cryptoStories.add('factorize', () => <Button onClick={factorize}>call native factorize</Button>, {
  notes: 'native factorize',
});
