/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import layoutController from './Layout.controller';
import Config from '../../../../js/app/config';
import MobileView from './Layout.mobile';
import DesktopView from './Layout.desktop';

const MainLayout = () => {
  const { data } = layoutController();
  let View;
  if (data.get('view') === 'login') {
    View = Config.Mobile ? MobileView : DesktopView;
  } else {
    View = () => <div>next</div>;
  }

  return <View />;
};

export default MainLayout;
