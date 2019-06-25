/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { escape, unescape } from '../stringEscaping';

it('test stringEscaping escape func', () => {
  expect(escape('yumcoder')).toEqual('yumcoder');
  // eslint-disable-next-line no-useless-escape
  expect(escape('<&yumcoder/js\'"1">')).toEqual('&lt;&amp;yumcoder&#x2F;js&#x27;&quot;1&quot;&gt;');
});

it('test stringEscaping unescape func', () => {
  expect(unescape('yumcoder')).toEqual('yumcoder');
  // eslint-disable-next-line no-useless-escape
  expect(unescape('&lt;&amp;yumcoder&#x2F;js&#x27;&quot;1&quot;&gt;')).toEqual(
    '<&yumcoder/js\'"1">',
  );
});
