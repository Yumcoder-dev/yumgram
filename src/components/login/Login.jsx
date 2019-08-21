/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Button, Row, Col, Icon, Input, Modal } from 'antd';
import i18n from 'i18next';
import styles from './Login.module.less';
import loginController from './Login.controller';
import CountryList from '../country/Country';
import AppIcon from '../../assets/img/icons/icon.svg';
import Config from '../../js/app/config';

const { Search } = Input;
const InputGroup = Input.Group;

const ToolBar = props => {
  // eslint-disable-next-line
  const { className } = props;
  return (
    <Row type="flex" justify="space-between" align="middle" className={className}>
      <Col offset={0} className={styles.cursor_pointer}>
        <img src={AppIcon} alt={i18n.t('appName')} className={styles.app_icon} />
        <span className={styles.borderless_button}>{i18n.t('appName')}</span>
      </Col>
      <Col offset={1} className={styles.cursor_pointer}>
        <span className={styles.borderless_button}>{i18n.t('next')}</span>
        <Icon type="right" className={styles.next_icon} />
      </Col>
    </Row>
  );
};

const LoginFragment = () => {
  const { data, openSearchContry, closeSearchCountry, onChooseCountry } = loginController();
  return (
    <div className={styles.yum_fragment}>
      <h3 className={styles.sigin_row}>{i18n.t('singin')}</h3>
      <p className={styles.sigin_msg_row}>{i18n.t('singinMsg')}</p>
      <p className={styles.country_row}>{i18n.t('country')}</p>
      <Search
        className={styles.input_select_country}
        onClick={openSearchContry}
        readOnly="readonly"
        placeholder={i18n.t('selectCountry')}
        onSearch={openSearchContry}
        enterButton
        value={data.get('selectedCountry').name}
      />
      <Modal
        width={392}
        title={i18n.t('country')}
        visible={data.get('showSearchCountry')}
        bodyStyle={{ padding: '0px' }}
        footer={null}
        onCancel={closeSearchCountry}
        keyboard
      >
        <CountryList onItemSelected={onChooseCountry} />
      </Modal>
      <p className={styles.phone_number_row}>{i18n.t('phoneNumber')}</p>
      <InputGroup compact>
        <Input
          style={{ width: '30%' }}
          value={data.get('selectedCountry').code}
          placeholder={i18n.t('code')}
        />
        <Input style={{ width: '70%' }} placeholder={i18n.t('phone')} />
      </InputGroup>
    </div>
  );
};

const Footer = () => {
  return (
    <Row type="flex" justify="center">
      <Col>
        <p className={styles.welcome_row}>{i18n.t('welcomeMsg')}</p>
        <Button type="link" className={styles.learn_more_row}>
          {i18n.t('learnMore')}
        </Button>
      </Col>
    </Row>
  );
};

const DesktopView = () => {
  return (
    <Row>
      <Row className={styles.head_bg} />
      <Row className={styles.yum_content}>
        <ToolBar className={styles.yum_toolbar} />
        <LoginFragment />
        <Footer />
      </Row>
    </Row>
  );
};

const MobileView = () => {
  return (
    <Row>
      <ToolBar className={styles.m_yum_toolbar} />
      <Row className={styles.m_yum_content}>
        <LoginFragment />
        <Footer />
      </Row>
    </Row>
  );
};

const Login = () => {
  const View = Config.Mobile ? MobileView : DesktopView;

  return <View />;
};

export default Login;
