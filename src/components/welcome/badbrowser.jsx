/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Typography } from 'antd';
import Markdown from 'markdown-to-jsx';
import i18n from 'i18next';

const { Title, Paragraph } = Typography;
const options = {
  forceBlock: true,
  overrides: {
    p: {
      component: Paragraph,
    },
  },
};
export default () => {
  return (
    <>
      <Title>Your browser is outdated!</Title>

      <Markdown options={options}>{i18n.t('badbrowser_desc1_md')}</Markdown>
      <Markdown options={options}>{i18n.t('badbrowser_desc2_md')}</Markdown>
      <Markdown options={options}>{i18n.t('badbrowser_desc3_md')}</Markdown>
    </>
  );
};
