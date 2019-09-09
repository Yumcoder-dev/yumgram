/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Input as AntdInput } from 'antd';
import styles from './Input.module.less';

const Input = (props, ref) => {
  const { error, className, ...p } = props;

  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current);

  return (
    <AntdInput
      className={`${className} ${error ? styles.ant_input_err : ''}`}
      ref={inputRef}
      {...p}
    />
  );
};

export default forwardRef(Input);
