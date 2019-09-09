/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Spin } from 'antd';
import { Redirect } from 'react-router-dom';
import welcomeController from './Welcome.controller';
import { PAGES } from '@components-shared';
// import Badbrowser from './badbrowser';

export default () => {
  // if (!window.HTMLCanvasElement) {
  //   return <Badbrowser />;
  // }

  const { data } = welcomeController();
  const v = data.get('view');

  if (v === PAGES.NONE) {
    return <Spin size="large" />;
  }
  return <Redirect to={v} />;
};
