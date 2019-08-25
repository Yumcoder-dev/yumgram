/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Row, Col, Icon } from 'antd';
import i18n from 'i18next';
import toolbarController from './Toolbar.controller';
import AppIcon from '../../../../assets/img/icons/icon.svg';
import styles from './Toolbar.module.less';

const Toolbar = props => {
  const { onNextClick } = toolbarController();
  // eslint-disable-next-line
  const { className } = props;
  return (
    <Row type="flex" justify="space-between" align="middle" className={className}>
      <Col offset={0} className={styles.cursor_pointer}>
        <img src={AppIcon} alt={i18n.t('app_name')} className={styles.login_toolbar_app_icon} />
        <span className={styles.login_toolbar_button}>{i18n.t('app_name')}</span>
      </Col>
      <Col offset={1} className={styles.cursor_pointer} onClick={onNextClick}>
        <span className={styles.login_toolbar_button}>{i18n.t('login_toolbar_next')}</span>
        <Icon type="right" className={styles.login_toolbar_next_icon} />
      </Col>
    </Row>
  );
};

export default Toolbar;
