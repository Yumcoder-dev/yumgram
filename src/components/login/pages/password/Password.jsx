/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Button, Typography, Alert } from 'antd';
import i18n from '@locale';
import passwordController from './Password.controller';
import styles from './Password.module.less';
import { Input } from '@components';
import { LoginHeader } from '@login-widgets';

const { Text } = Typography;

export default ({ accountPassword }) => {
  const { data, onInputChanged } = passwordController({
    accountPassword,
  });
  return (
    <>
      <LoginHeader head={i18n.t('login_password_title')} lead={i18n.t('login_password_label')} />

      <Text type="secondary">{i18n.t('login_password')}</Text>
      <Input
        ref={input => input && input.focus()}
        className={styles.login_password_input}
        error={data.get('incorrectPassword')}
        onChange={e => onInputChanged('password', e.target.value)}
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
