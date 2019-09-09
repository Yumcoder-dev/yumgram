/*
import default from '../app/windowResizeEmitter';
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 * 
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

const onInputOnChanged = ({ setData }) => (key, newVal) => {
  setData(s => s.set(key, newVal || ''));
};

export default onInputOnChanged;
