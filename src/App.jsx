/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React, { useEffect } from 'react';
import './App.module.less';
import { windowResizeEmitter } from '@appjs';
import { Rotues } from '@components';

function App() {
  useEffect(windowResizeEmitter, []);

  return <Rotues />;
}

export default App;
