/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

// #todo depricated see es5 unescape
const UNESCAPE_MAP = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&#x2F;': '/',
  '&#x27;': "'",
  '&quot;': '"',
};
const ESCAPE_MAP = {};

// eslint-disable-next-line guard-for-in, no-restricted-syntax
for (const key in UNESCAPE_MAP) {
  ESCAPE_MAP[UNESCAPE_MAP[key]] = key;
}

const escapeMatcher = RegExp(`(?:${Object.keys(ESCAPE_MAP).join('|')})`, 'g');
const unescapeMatcher = RegExp(`(?:${Object.keys(UNESCAPE_MAP).join('|')})`, 'g');

export function escape(str) {
  return str.replace(escapeMatcher, ch => ESCAPE_MAP[ch]);
}

export function unescape(str) {
  return str.replace(unescapeMatcher, ch => UNESCAPE_MAP[ch]);
}
