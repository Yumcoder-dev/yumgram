/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from 'react';
import { Button, Row, Col, Typography } from 'antd';
import i18n from 'i18next';
import Markdown from 'markdown-to-jsx';
import styles from './Footer.module.less';
import FooterController, { LEAR_MORE } from './Footer.controller';
import scrollToOn from '../../../behaviors/scrollToOn';

const { Title, Paragraph } = Typography;

// *************************************************************************************************
const LearnMore = props => {
  const { data } = scrollToOn();
  const { onClick } = props;
  const options = {
    forceBlock: true,
    overrides: {
      p: {
        component: Paragraph,
      },
    },
  };
  return (
    <div className={styles.login_footer_about_wrap} ref={data.get('elm')}>
      <Row gutter={8}>
        <Col span={12}>
          <Title level={4}>{i18n.t('login_about_title')}</Title>
        </Col>
        <Col span={12}>
          <Button
            type="link"
            onClick={onClick}
            style={{ float: 'right', paddingLeft: '0px', paddingRight: '0px' }}
          >
            {i18n.t('login_about_hide')}
          </Button>
        </Col>
      </Row>
      <Markdown options={options}>{i18n.t('login_about_desc1_md')}</Markdown>
      <Markdown options={options}>{i18n.t('login_about_desc2_md')}</Markdown>
      <Markdown options={options}>{i18n.t('login_about_desc3_md')}</Markdown>
    </div>
  );
};
// *************************************************************************************************
const Intro = props => {
  const { onClick } = props;
  return (
    <>
      <Paragraph style={{ marginBottom: '0px' }} className={styles.login_footer_intro}>
        {i18n.t('login_about_intro')}
      </Paragraph>
      <Button type="link" className={styles.login_footer_learn_more} onClick={onClick}>
        {i18n.t('login_about_learn')}
      </Button>
    </>
  );
};
// *************************************************************************************************
const Footer = () => {
  const { data, onClick } = FooterController();
  const View = data.get('view') === LEAR_MORE ? LearnMore : Intro;

  return (
    <Row type="flex" justify="center">
      <Col>
        <View onClick={onClick} />
      </Col>
    </Row>
  );
};

export default React.memo(Footer);
