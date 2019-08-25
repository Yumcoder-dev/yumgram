/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import parseMd from '../md';

it('helper - ul', () => {
  expect(parseMd('yum')).toEqual('yum');
  expect(parseMd('<p>yum</p>')).toEqual('<p>yum</p>');
  expect(parseMd('<t>yum</t>')).toEqual('<t>yum</t>');
  expect(parseMd('1.yum\n2.coder\n')).toEqual('<li>yum</li>\n<li>coder</li>\n');
});
