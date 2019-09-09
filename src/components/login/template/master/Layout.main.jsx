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
import { config } from '@appjs';
import Mobile from './Layout.mobile';
import Desktop from './Layout.desktop';
import { PAGE_LOGIN, PAGE_PASSWORD, PAGE_FULLNAME } from '@login-shared';
import { Fullname, Password, Login, SendCode } from '@login-components';
import './Layout.module.less';

const MainLayout = () => {
  const { data } = layoutController();
  if (data.get('RedirectToIm') === true) {
    return <Redirect to="/im" />;
  }

  const View = config.Mobile ? Mobile : Desktop;
  let Child;
  switch (data.get('view')) {
    case PAGE_LOGIN:
      Child = Login;
      break;
    case PAGE_PASSWORD:
      Child = Password;
      break;
    case PAGE_FULLNAME:
      Child = Fullname;
      break;
    default:
      Child = SendCode;
      break;
  }
  return (
    <View>
      <Child {...data.get('props')} />
    </View>
  );
};

export default React.memo(MainLayout);
