/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Row } from 'antd';
import { Footer, Toolbar } from '@login-components';
import styles from './Layout.desktop.module.less';

const Desktop = props => {
  return (
    <>
      <Row className={styles.login_desktop_head_bg} />
      <Row className={styles.login_desktop_content}>
        <Toolbar className={styles.login_desktop_toolbar} />
        <Row className={styles.login_page_wrap}>{props.children}</Row>
        <Footer />
      </Row>
    </>
  );
};

export default React.memo(Desktop);
