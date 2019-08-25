/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Input, Modal } from 'antd';
import i18n from 'i18next';
import loginController from './Login.controller';
import CountryList from '../country/Country';
import vpBehavior from '../../../behaviors/verticalPosition';
import styles from './Login.module.less';

const { Search } = Input;
const InputGroup = Input.Group;

export default () => {
  const { data, openSearchContry, closeSearchCountry, onChooseCountry } = loginController();
  const { data: verticalData } = vpBehavior({ percentage: 0.2, padding: 'true' });

  return (
    <div
      className={styles.login_page_wrap}
      ref={verticalData.get('elm')}
      style={{ ...verticalData.get('styles') }}
    >
      <h3 className={styles.sigin_row}>{i18n.t('login_sign_in')}</h3>
      <p className={styles.login_enter_number_description}>
        {i18n.t('login_enter_number_description')}
      </p>
      <p className={styles.login_country_input_label}>{i18n.t('login_country_input_label')}</p>
      <Search
        className={styles.login_country_input}
        onClick={openSearchContry}
        readOnly="readonly"
        placeholder={i18n.t('login_country_input_placeholder')}
        onSearch={openSearchContry}
        enterButton
        value={data.get('selectedCountry').name}
      />
      <Modal
        width={392}
        title={i18n.t('login_country')}
        visible={data.get('showSearchCountry')}
        bodyStyle={{ padding: '0px' }}
        footer={null}
        onCancel={closeSearchCountry}
        keyboard
      >
        <CountryList onItemSelected={onChooseCountry} />
      </Modal>
      <p className={styles.login_tel_input_label}>{i18n.t('login_tel_input_label')}</p>
      <InputGroup compact>
        <Input
          style={{ width: '30%' }}
          value={data.get('selectedCountry').code}
          placeholder={i18n.t('login_code_input_placeholder')}
        />
        <Input style={{ width: '70%' }} placeholder={i18n.t('login_tel_input_placeholder')} />
      </InputGroup>
    </div>
  );
};
