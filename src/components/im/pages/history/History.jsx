/* eslint-disable no-unused-vars */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
// eslint-disable
import React from 'react';
import {
  Layout,
  Row,
  Col,
  Typography,
  PageHeader,
  Icon,
  Card,
  Avatar,
  Dropdown,
  Menu,
  Button,
  Tooltip,
} from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const History = () => {
  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          3rd menu item
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Header>
        <Col style={{ float: 'right', marginLeft: 'auto' }}>
          <Dropdown overlay={menu}>
            {/* <Button size="large">
              <Text style={{ margin: '8px' }}>Button</Text>
              <Avatar icon="right" size="small" style={{ background: 'white', color: 'red' }} />
            </Button> */}
            <Avatar icon="more" size="large" style={{ background: 'transparent' }} />
          </Dropdown>
        </Col>
      </Header>
      <Content>content</Content>
    </Layout>
  );
};

export default React.memo(History);
