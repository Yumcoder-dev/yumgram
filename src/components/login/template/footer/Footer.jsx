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
import { Button, Row, Col } from 'antd';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import styles from './Footer.module.less';
import FooterController, { VIEW } from './Footer.controller';
import scrollToOn from '../../../behaviors/scrollToOn';
import parseMd from '../../../../js/app/md';

const LearnMore = props => {
  const { data } = scrollToOn();
  const { onClick } = props;
  return (
    <div className={styles.login_footer_about_wrap} ref={data.get('elm')}>
      <h3>
        <span>{i18n.t('login_about_title')}</span>
        <a role="link" onClick={onClick} className={styles.login_footer_about_hide}>
          {i18n.t('login_about_hide')}
        </a>
      </h3>
      <p dangerouslySetInnerHTML={{ __html: parseMd(i18n.t('login_about_desc1_md')) }} />
      <p dangerouslySetInnerHTML={{ __html: parseMd(i18n.t('login_about_desc2_md')) }} />
      <p dangerouslySetInnerHTML={{ __html: parseMd(i18n.t('login_about_desc3_md')) }} />
    </div>
  );
};
LearnMore.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const Intro = props => {
  const { onClick } = props;
  return (
    <>
      <p className={styles.login_footer_welcome}>{i18n.t('login_about_intro')}</p>
      <Button type="link" className={styles.login_footer_learn_more} onClick={onClick}>
        {i18n.t('login_about_learn')}
      </Button>
    </>
  );
};
Intro.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const Footer = () => {
  const { data, onClick } = FooterController();
  const View = data.get('view') === VIEW.learMore ? LearnMore : Intro;

  return (
    <Row type="flex" justify="center">
      <Col>
        <View onClick={onClick} />
      </Col>
    </Row>
  );
};

export default Footer;
