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
import { verticalPosition } from '@components';
import { Footer, Toolbar } from '@login-components';
import styles from './Layout.mobile.module.less';

const Mobile = props => {
  const { data: verticalData } = verticalPosition({ percentage: 0.2, padding: 'true' });

  return (
    <>
      <Toolbar className={styles.login_mobile_toolbar} />
      <Row className={styles.login_mobile_content}>
        <Row
          className={styles.login_page_wrap}
          ref={verticalData.get('elm')}
          style={{ ...verticalData.get('styles') }}
        >
          {props.children}
        </Row>
        <Footer />
      </Row>
    </>
  );
};

export default React.memo(Mobile);
