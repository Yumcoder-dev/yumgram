/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import encodeFormData from '../encodeFormData';

it('test encodeFormData', () => {
  expect(encodeFormData('key', 'value')).toEqual('key=value');
  expect(encodeFormData('key', '&value')).toEqual('key=%26value');
  expect(encodeFormData('key', { val: 'data' })).toEqual('key%5Bval%5D=data'); // key[val]=data
  expect(
    encodeFormData('key', {
      val1: 'data1',
      val2: 'data2',
    }),
  ).toEqual('key%5Bval1%5D=data1&key%5Bval2%5D=data2');
  expect(encodeFormData('key', ['data1', 'data2'])).toEqual(
    'key%5B%5D=data1&key%5B%5D=data2',
  ); // key[]=data1&key[]=data2
});
