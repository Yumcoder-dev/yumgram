/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { config } from '@appjs';
import MobileView from './Layout.mobile';
import DesktopView from './Layout.desktop';

const MainLayout = () => {
  const View = config.Mobile ? MobileView : DesktopView;
  return <View />;
};

export default MainLayout;
