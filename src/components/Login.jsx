/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Button, Row, Col } from 'antd';
import styles from './Login.module.less';

function Login() {
  return (
    <div className={styles.login_head_bg}>
      <Row>
        <Col span={12}>
          <Button>syn</Button>
        </Col>
        <Col span={12}>
          <Button>asyn</Button>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
