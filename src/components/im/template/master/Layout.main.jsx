/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Layout } from 'antd';
import { config } from '@appjs';
import { Dialogs, History } from '@im-components';
import './Layout.module.less';

const { Sider } = Layout;

const MainLayout = () => {
  return (
    <>
      {config.Mobile ? (
        <Dialogs />
      ) : (
        <Layout style={{ height: '100vh' }}>
          <Sider width={256}>
            <Dialogs />
          </Sider>
          <History />
        </Layout>
      )}
    </>
  );
};

export default MainLayout;
