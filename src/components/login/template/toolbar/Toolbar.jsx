/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Row, Icon, Button, Typography, Avatar } from 'antd';
import i18n from '@locale';
import toolbarController from './Toolbar.controller';
// import AppIcon from '../../../../assets/img/icons/icon.svg';
import { AppIcon, ThreeDots } from '@components';
import styles from './Toolbar.module.less';

const { Text } = Typography;

// *************************************************************************************************
const SubmitProgress = ({ status }) => {
  return (
    <>
      <Text className={styles.login_toolbar_txt}>{status}</Text>
      <Icon component={ThreeDots} height={30} width={30} />
    </>
  );
};
const Statusbar = React.memo(SubmitProgress);
// *************************************************************************************************
const SubmitButton = () => {
  return (
    <>
      <Text className={styles.login_toolbar_txt}>{i18n.t('login_toolbar_next')}</Text>
      <Avatar size="small" icon="right" style={{ background: 'transparent' }} />
    </>
  );
};

const Submit = React.memo(SubmitButton);
// *************************************************************************************************
const Stripe = () => {
  const { data, onNextClick } = toolbarController();
  const status = data.get('status_msg');

  return (
    <Button
      style={{ height: '100%' }}
      size="large"
      onClick={onNextClick}
      className={styles.login_toolbar_btn_next}
    >
      {status !== '' ? <Statusbar status={status} /> : <Submit />}
    </Button>
  );
};
const Bar = React.memo(Stripe);
// *************************************************************************************************
const Toolbar = props => {
  const { className } = props;
  return (
    <Row type="flex" align="middle" className={className}>
      <Button style={{ height: '100%' }} size="large" className={styles.login_toolbar_btn_app}>
        <AppIcon width={30} height={30} className={styles.login_toolbar_icon} />
        <Text className={styles.login_toolbar_txt}>{i18n.t('app_name')}</Text>
      </Button>
      <Bar />
    </Row>
  );
};
export default React.memo(Toolbar);
