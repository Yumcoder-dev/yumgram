/* eslint-disable no-return-assign */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Input, Modal, Alert, Typography } from 'antd';
import i18n from 'i18next';
import MyInput from '../../../view/MyInput';
import loginController from './Sendcode.controller';
import CountryList from '../country/CountryList';
import styles from './Sendcode.module.less';
import Header from '../header/Header';

const { Search } = Input;
const InputGroup = Input.Group;
const { Text, Paragraph } = Typography;

// *************************************************************************************************
const InputCountryView = ({
  name,
  showSearchCountry,
  openContryList,
  closeContryList,
  onChooseCountry,
}) => {
  return (
    <>
      <Text type="secondary">{i18n.t('login_country_input_label')}</Text>
      <Search
        className={styles.login_country_input}
        onClick={openContryList}
        readOnly="readonly"
        placeholder={i18n.t('login_country_input_placeholder')}
        onSearch={openContryList}
        enterButton
        value={name}
      />
      <Modal
        width={392}
        title={i18n.t('login_country')}
        visible={showSearchCountry}
        bodyStyle={{ padding: '0px' }}
        footer={null}
        onCancel={closeContryList}
        keyboard
      >
        <CountryList onItemSelected={onChooseCountry} />
      </Modal>
    </>
  );
};
const InputCountry = React.memo(InputCountryView);
// *************************************************************************************************
const InputTelView = ({ code, phone, onCodeChanged, onTelChanged, Err, focusIndex }) => {
  const hasErr = Err.length > 0;

  return (
    <>
      <Text type="secondary">{i18n.t('login_tel_input_label')}</Text>
      <InputGroup compact className={styles.login_input_tel}>
        <MyInput
          ref={input => input && focusIndex === 0 && input.focus()}
          style={{ width: '30%' }}
          error={hasErr}
          value={code}
          placeholder={i18n.t('login_code_input_placeholder')}
          onChange={e => onCodeChanged(e.target.value)}
        />
        <MyInput
          ref={input => input && focusIndex === 1 && input.focus()}
          style={{ width: '70%' }}
          value={phone}
          error={hasErr}
          placeholder={i18n.t('login_tel_input_placeholder')}
          onChange={e => onTelChanged(e.target.value)}
        />
      </InputGroup>
      {hasErr && (
        <Alert className={styles.login_err} message={Err} type="error" banner showIcon={false} />
      )}
    </>
  );
};
const InputTel = React.memo(InputTelView);
// *************************************************************************************************
const Sendcode = ({ phoneCountry, phoneNumber, phoneCountryName }) => {
  const {
    data,
    openContryList,
    closeContryList,
    onChooseCountry,
    onCodeChanged,
    onTelChanged,
  } = loginController({ phoneCountry, phoneNumber, phoneCountryName });
  // Performance tuning -- avoid rendering :
  // - decompose main view to fine-grained view base on changes scenario
  return (
    <>
      <Header head={i18n.t('login_sign_in')} lead={i18n.t('login_enter_number_description')} />
      <InputCountry
        name={data.get('phoneCountryName')}
        showSearchCountry={data.get('showSearchCountry')}
        openContryList={openContryList}
        closeContryList={closeContryList}
        onChooseCountry={onChooseCountry}
      />
      <InputTel
        code={data.get('phoneCountry')}
        phone={data.get('phoneNumber')}
        focusIndex={data.get('focusIndex')}
        onCodeChanged={onCodeChanged}
        onTelChanged={onTelChanged}
        Err={data.get('err')}
      />
      {data.get('progressEnabled') && (
        <Paragraph type="secondary" className={styles.login_generating_keys_info}>
          {i18n.t('login_generating_keys_info')}
        </Paragraph>
      )}
    </>
  );
};

export default React.memo(Sendcode);
