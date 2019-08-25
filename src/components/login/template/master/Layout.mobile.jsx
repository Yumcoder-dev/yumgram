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
import styles from './Layout.mobile.module.less';

const MobileView = () => {
  return (
    <Row>
      <Toolbar className={styles.login_mobile_toolbar} />
      <Row className={styles.login_mobile_content}>
        <Login />
        <Footer />
      </Row>
    </Row>
  );
};

export default MobileView;
