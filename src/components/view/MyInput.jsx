/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Input as AntdInput } from 'antd';
import styles from './MyInput.module.less';

const Input = (props, ref) => {
  const { error, className, ...p } = props;
  const e = error ? styles.ant_input_err : '';
  const c = `${className} ${e}`;
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current);
  return <AntdInput {...p} className={c} ref={inputRef} />;
};
export default forwardRef(Input);
