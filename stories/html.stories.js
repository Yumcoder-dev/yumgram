/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable */

import React from 'react';
import { storiesOf } from '@storybook/react';
import markdownDoc from './docs/markdown.md';
import { action } from '@storybook/addon-actions';

const htmlStories = storiesOf('html/tutorial', module);
////////////////////////////////////////////////////////////////////////////////////////////////////
htmlStories.add(
  'span with markdown notes',
  () => (
    <span onClick={action('clicked on span')}>see Notes panel, for test action click here</span>
  ),
  {
    notes: {
      markdown: markdownDoc,
    },
  },
);
