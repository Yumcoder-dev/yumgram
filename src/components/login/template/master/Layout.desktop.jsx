/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Row } from 'antd';
import Footer from '../footer/Footer';
import Toolbar from '../toolbar/Toolbar';
import Login from '../../pages/login/login';
import styles from './Layout.desktop.module.less';

const DesktopView = () => {
  return (
    <Row>
      <Row className={styles.login_desktop_head_bg} />
      <Row className={styles.login_desktop_content}>
        <Toolbar className={styles.login_desktop_toolbar} />
        <Login />
        <Footer />
      </Row>
    </Row>
  );
};

export default DesktopView;
