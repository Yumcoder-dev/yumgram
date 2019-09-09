/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
import styles from './Header.module.less';

const { Title, Text } = Typography;

const Header = props => {
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
Header.propTypes = {
  head: PropTypes.string.isRequired,
  lead: PropTypes.string.isRequired,
};

export default React.memo(Header);
