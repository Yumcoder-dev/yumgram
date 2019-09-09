/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Input as AntdInput } from 'antd';
import styles from './Input.module.less';

const Input = props => {
  const { label } = props;
  return (
    <>
      <p className={styles.login_tel_input_label}>{label}</p>
      <AntdInput {...props} />
    </>
  );
};

export default Input;
