/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-bitwise */
import React from 'react';
import { Alert, Typography, Row } from 'antd';
import i18n from '@locale';
import fullnameController from './Fullname.controller';
import styles from './Fullname.module.less';
import { Input } from '@components';
import { LoginHeader } from '@login-widgets';

const { Text } = Typography;

export default () => {
  const { data, onInputChanged } = fullnameController();
  return (
    <>
      <LoginHeader head={i18n.t('login_your_info')} lead={i18n.t('login_fulll_name_label')} />

      <Text type="secondary">{i18n.t('login_first_name')}</Text>
      <Row className={styles.login_fname_row}>
        <Input
          error={data.get('incorrect_fname')}
          onChange={e => onInputChanged('fname', e.target.value)}
        />
        {data.get('incorrect_fname') && (
          <Alert
            className={styles.login_err}
            message={i18n.t('login_incorrect_first_name')}
            type="error"
            banner
            showIcon={false}
          />
        )}
      </Row>

      <Text type="secondary">{i18n.t('login_last_name')}</Text>
      <Input
        className={styles.login_lname_input}
        error={data.get('incorrect_lname')}
        onChange={e => onInputChanged('lname', e.target.value)}
      />
      {data.get('incorrect_lname') && (
        <Alert
          className={styles.login_err}
          message={i18n.t('login_incorrect_last_name')}
          type="error"
          banner
          showIcon={false}
        />
      )}
    </>
  );
};
