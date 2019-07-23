/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

const messageName = 'zero-timeout-message';
const originalSetTimeout = window.setTimeout;
const originalClearTimeout = window.clearTimeout;

const originalMinId = originalSetTimeout(() => {}, 0);
const zeroTimeouts = [];
let zeroMinId = originalMinId + 100000000;

export function setZeroTimeout(fn) {
  // eslint-disable-next-line no-plusplus
  const timeoutId = ++zeroMinId;
  zeroTimeouts.push([timeoutId, fn]);
  window.postMessage(messageName, '*');
  return timeoutId;
}

export function clearZeroTimeout(timeoutId) {
  if (timeoutId && timeoutId >= zeroMinId) {
    for (let i = 0, len = zeroTimeouts.length; i < len; i += 1) {
      if (zeroTimeouts[i][0] === timeoutId) {
        console.warn('spliced timeout', timeoutId, i);
        zeroTimeouts.splice(i, 1);
        break;
      }
    }
  }
}

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
