/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Button, Row, Col, Icon, Card, Input, Modal } from 'antd';
import styles from './Login.module.less';
import loginController from './Login.controller';
import CountryList from '../country/Country';

const { Search } = Input;
const InputGroup = Input.Group;

function Login() {
  // eslint-disable-next-line no-unused-vars
  const { data, openSearchContry, closeSearchCountry, onChooseCountry } = loginController();
  return (
    <Row>
      <Row className={styles.login_head_bg} />
      <Row className={styles.login_page}>
        <Row type="flex" justify="space-between" align="top" style={{ marginBottom: '22px' }}>
          <Col offset={0}>
            <Button type="link" className={styles.borderless}>
              <Icon type="fire" theme="filled" />
              Dadrah
            </Button>
          </Col>
          <Col offset={10}>
            <Button type="link" className={styles.borderless}>
              Next
              <Icon type="right" />
            </Button>
          </Col>
        </Row>
        <Row type="flex" justify="center" className={styles.login_form_wrap}>
          <Card>
            <h3 style={{ fontWeight: 'bold' }}>Sign in</h3>
            <p>Please choose your country and enter your full phone number.</p>
            <p style={{ marginTop: '22px' }}>Country</p>
            <Search
              className={styles.input_slect}
              onClick={openSearchContry}
              readOnly="readonly"
              placeholder="select a country"
              onSearch={openSearchContry}
              enterButton
              value={data.get('selectedCountry').name}
            />
            <Modal
              width={392}
              title="Country"
              visible={data.get('showSearchCountry')}
              bodyStyle={{ padding: '0px' }}
              footer={null}
              onCancel={closeSearchCountry}
              keyboard
            >
              <CountryList onItemSelected={onChooseCountry} />
            </Modal>

            <p style={{ marginTop: '22px' }}>Phone number</p>
            <InputGroup compact>
              <Input style={{ width: '30%' }} value={data.get('selectedCountry').code} />
              <Input style={{ width: '70%' }} />
            </InputGroup>
          </Card>
        </Row>
        <Row type="flex" justify="center" style={{ marginTop: '22px' }}>
          <Col>
            <p>Welcome to the official Dadrah web-client.</p>
            <Button type="link">Learn more</Button>
          </Col>
        </Row>
      </Row>
    </Row>
  );
}

export default Login;
