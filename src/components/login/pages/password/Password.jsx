/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import i18n from 'i18next';
import { Button, Typography, Alert } from 'antd';
import passwordController from './Password.controller';
import styles from './Password.module.less';
import Header from '../header/Header';
import MyInput from '../../../view/MyInput';

const { Text } = Typography;

export default ({ accountPassword }) => {
  const { data, onDataValueChanged } = passwordController({
    accountPassword,
  });
  return (
    <>
      <Header head={i18n.t('login_password_title')} lead={i18n.t('login_password_label')} />

      <Text type="secondary">{i18n.t('login_password')}</Text>
      <MyInput
        ref={input => input && input.focus()}
        className={styles.login_password_input}
        error={data.get('incorrectPassword')}
        onChange={e => onDataValueChanged('password', e.target.value)}
      />
      <Text type="secondary">hint</Text>
      {data.get('incorrectPassword') && (
        <Alert
          className={styles.login_err}
          message={i18n.t('login_incorrect_password')}
          type="error"
          banner
          showIcon={false}
        />
      )}
      <Button type="link" className={styles.btn}>
        {i18n.t('login_password_forgot_link')}
      </Button>
    </>
  );
};
