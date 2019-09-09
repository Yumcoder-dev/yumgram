/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Typography } from 'antd';
import styles from './LoginHeader.module.less';

const { Title, Text } = Typography;

const PageHeader = props => {
  const { head, lead } = props;
  return (
    <>
      <Title level={4}>{head}</Title>
      <p className={styles.login_form_lead}>
        <Text type="secondary">{lead}</Text>
      </p>
    </>
  );
};

export default React.memo(PageHeader);
