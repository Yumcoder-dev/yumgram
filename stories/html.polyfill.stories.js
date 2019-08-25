/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable */

import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {polyfills} from '../src/js/app/polyfill';
import RequestAnimationFrame from '../src/js/app/animate';

const htmlStories = storiesOf ('html/polyfil', module);
////////////////////////////////////////////////////////////////////////////////////////////////////
const callSetZeroTimeout = () => {
  for (let i = 0; i < 5; i++) {
    setTimeout (() => {
      console.log ('setZeroTimeout i', i);
    });
    clearTimeout();
  }
};

htmlStories.add (
  'setZeroTimeout',
  () => (
    <button type="button" onClick={callSetZeroTimeout}>setZeroTimeout</button>
  ),
  {
    notes: "A simple utility allowing you to use near-instantaneous(in most cases asynchronous) setTimeout analogue. This is performed using the browser's messaging system.",
  }
);
////////////////////////////////////////////////////////////////////////////////////////////////////
const callAnimate = () => {
  (new RequestAnimationFrame()).animate((progress)=>{
    console.log ('Animate progress=', progress);
  }, 1000)
};
htmlStories.add (
  'animate',
  () => (
    <button type="button" onClick={callAnimate}>animate</button>
  ),
  {
    notes: "requestAnimationFrame",
  }
);