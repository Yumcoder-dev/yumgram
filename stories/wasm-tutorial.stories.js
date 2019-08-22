/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Tutorial from '../src/wsam/tutorial';
import { Button } from '@storybook/react/demo';

const tutorialStories = storiesOf('wasm/tutorial', module);

const callJsFuncFromC = () => {
  Tutorial.callJsFuncFromC().then(res => console.log('callJsFuncFromC 10+30=', res));
};
const callMemory = () => {
  Tutorial.getInstance().then(instance => {
    const get = instance._get;
    const put = instance._put;
    let memory = new Uint32Array(Tutorial.memory.buffer);
    console.log('init (js-memory, c-get)', memory[16], ',', get(16));
    memory[16] = 10;
    console.log('after set(10) in js (js-memory, c-get)', memory[16], ',', get(16));
    put(32, 20);
    console.log('after set(20) in c (js-memory, c-get)', memory[32], ',', get(32));
  });
};
const callArrayFunc = () => {
  Tutorial.arrFunc([1, 2, 3, 4, 5]).then(res => {
    console.log('([1,2,3,4,5]).call(i=>2*i)', res);
  });
};
const longFunc = () => {
  Tutorial.getLong().then(res => {
    console.log('res =', res);
  });
};

tutorialStories.add(
  'callJsFuncFromC',
  () => <Button onClick={callJsFuncFromC}>call javascript function from wsam</Button>,
  { notes: 'declare exported js javascript function in env and call from wsam code' },
);
tutorialStories.add(
  'memory',
  () => <Button onClick={callMemory}>share memory between js and c</Button>,
  {
    notes: 'linear memory set and get in js and c',
  },
);
tutorialStories.add(
  'array',
  () => <Button onClick={callArrayFunc}>pass array to c function and get array response</Button>,
  {
    notes: 'using shared linear heap memory',
  },
);
tutorialStories.add(
  'getLong',
  () => <Button onClick={longFunc}>long data type</Button>,
  {
    notes: 'long data type',
  },
);