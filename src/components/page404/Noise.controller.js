/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

// #todo webgl
/* eslint-disable no-plusplus */
import { Map } from 'immutable';
import React from 'react';
import { pipe, withLifecycle, withState } from '../../js/core/index';

const init = () =>
  Map({
    elm: React.createRef(),
  });

const onCreate = ({ data }) => {
  if (data.get('elm')) {
    // Create a pattern, offscreen
    const patternCanvas = document.createElement('canvas');
    const patternContext = patternCanvas.getContext('2d');

    // Give the pattern a width and height of 50
    patternCanvas.width = 50;
    patternCanvas.height = 50;
    const dt = patternContext.createImageData(patternCanvas.width, patternCanvas.height);
    const dd = dt.data;
    const dl = dt.width * dt.height;

    const canvas = data.get('elm').current;
    const ctx = canvas.getContext('2d');

    const generateNoise = () => {
      for (let p = 0, i = 0; i < dl; i += 1) {
        const c = Math.floor(Math.random() * 256);
        dd[p++] = c;
        dd[p++] = c;
        dd[p++] = c;
        dd[p++] = 255;
      }
      patternContext.putImageData(dt, 0, 0);
      ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setTimeout(generateNoise, 20);
    };

    generateNoise();
    // Create our primary canvas and fill it with the pattern
  }
};

export default pipe(
  withState(init),
  withLifecycle({ onCreate }),
);
