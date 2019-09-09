/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-console */
const messageName = 'zero-timeout-message';
const originalSetTimeout = window.setTimeout;
const originalClearTimeout = window.clearTimeout;

const originalMinId = originalSetTimeout(() => {}, 0);
const zeroTimeouts = [];
let zeroMinId = originalMinId + 100000000;

export const setZeroTimeout = fn => {
  // eslint-disable-next-line no-plusplus
  const timeoutId = ++zeroMinId;
  zeroTimeouts.push([timeoutId, fn]);
  window.postMessage(messageName, '*');
  return timeoutId;
};

export const clearZeroTimeout = timeoutId => {
  if (timeoutId && timeoutId >= zeroMinId) {
    for (let i = 0, len = zeroTimeouts.length; i < len; i += 1) {
      if (zeroTimeouts[i][0] === timeoutId) {
        console.warn('spliced timeout', timeoutId, i);
        zeroTimeouts.splice(i, 1); // clear an item in index i.
        break;
      }
    }
  }
};

function handleMessage(event) {
  if (event.source === window && event.data === messageName) {
    event.stopPropagation();
    if (zeroTimeouts.length > 0) {
      const fn = zeroTimeouts.shift()[1];
      fn();
    }
  }
}

window.addEventListener('message', handleMessage, true);

window.setTimeout = (callback, delay) => {
  if (!delay || delay <= 5) {
    return setZeroTimeout(callback);
  }
  return originalSetTimeout(callback, delay);
};

window.clearTimeout = timeoutId => {
  if (timeoutId >= zeroMinId) {
    clearZeroTimeout(timeoutId);
  }
  return originalClearTimeout(timeoutId);
};

// window.performance.now
if (!window.performance.now) {
  window.performance.now =
    window.performance.now ||
    window.performance.mozNow ||
    window.performance.msNow ||
    window.performance.oNow ||
    window.performance.webkitNow ||
    Date.now ||
    (() => +new Date());
}

// requestAnimationFrame
let lastRafTime = 0;
const checkRaf = () => {
  const vendors = ['ms', 'moz', 'webkit', 'o'];
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
    window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
    window.cancelAnimationFrame =
      window[`${vendors[x]}CancelAnimationFrame`] ||
      window[`${vendors[x]}CancelRequestAnimationFrame`];
  }
};

checkRaf();

if (!window.requestAnimationFrame)
  window.requestAnimationFrame = callback => {
    const currTime = performance.now();
    const frameDuration = 1000 / 60;
    const timeToCall = Math.max(0, frameDuration - (currTime - lastRafTime));
    lastRafTime = currTime + timeToCall;
    const id = window.setTimeout(() => callback(lastRafTime), Math.round(timeToCall));
    return id;
  };

if (!window.cancelAnimationFrame)
  window.cancelAnimationFrame = id => {
    clearTimeout(id);
  };

// #todo  Object.assign() Date.now() Object.keys forEach

export const polyfills = () => {
  console.log('polyfills...');
};
