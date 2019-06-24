/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

function Login() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>login</h1>
      <p>
        <Link to="/im">GOTO IM</Link>
        {` ss ${t('app.welcome')}`}
      </p>
      <Button>syn</Button>
      <Button>asyn</Button>
    </div>
  );
}

export default Login;
