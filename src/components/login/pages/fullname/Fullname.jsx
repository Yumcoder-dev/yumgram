/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-bitwise */
import React from 'react';
import i18n from 'i18next';
import { Alert, Typography, Row } from 'antd';
import fullnameController from './Fullname.controller';
import Header from '../header/Header';
import styles from './Fullname.module.less';
import MyInput from '../../../view/MyInput';

const { Text } = Typography;

export default () => {
  const { data, onDataValueChanged } = fullnameController();
  return (
    <>
      <Header head={i18n.t('login_your_info')} lead={i18n.t('login_fulll_name_label')} />

      <Text type="secondary">{i18n.t('login_first_name')}</Text>
      <Row className={styles.login_fname_row}>
        <MyInput
          error={data.get('incorrect_fname')}
          onChange={e => onDataValueChanged('fname', e.target.value)}
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
      <MyInput
        className={styles.login_lname_input}
        error={data.get('incorrect_lname')}
        onChange={e => onDataValueChanged('lname', e.target.value)}
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
