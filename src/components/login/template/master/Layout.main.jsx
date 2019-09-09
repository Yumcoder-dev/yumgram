/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Redirect } from 'react-router-dom';
import layoutController from './Layout.controller';
import Config from '../../../../js/app/config';
import MobileView from './Layout.mobile';
import DesktopView from './Layout.desktop';
import { FullnameView, PasswordView, LoginView, SendCodeView } from '../../pages/index';
import { LOGIN, PASSWORD, FULLNAME } from '../../constant';
import './Layout.module.less';

const MainLayout = () => {
  const { data } = layoutController();
  if (data.get('RedirectToIm') === true) {
    return <Redirect to="/im" />;
  }

  const View = Config.Mobile ? MobileView : DesktopView;
  let ChildView;
  switch (data.get('view')) {
    case LOGIN:
      ChildView = LoginView;
      break;
    case PASSWORD:
      ChildView = PasswordView;
      break;
    case FULLNAME:
      ChildView = FullnameView;
      break;
    default:
      ChildView = SendCodeView;
      break;
  }
  return (
    <View>
      <ChildView {...data.get('props')} />
    </View>
  );
};

export default React.memo(MainLayout);
