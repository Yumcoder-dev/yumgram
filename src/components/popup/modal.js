/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Modal, Typography } from 'antd';
import i18n from 'i18next';

const { confirm } = Modal;
const { Text } = Typography;

export const destroyAll = () => {
  Modal.destroyAll();
};

export const showConfirm = (title, content, onOk, onCancel) => {
  const obj = {};
  if (title !== undefined || title !== '') {
    obj.title = i18n.t(title);
  }
  if (content !== undefined || content !== '') {
    obj.content = i18n.t(content);
  }
  obj.okText = i18n.t('modal_ok');
  obj.cancelText = i18n.t('modal_cancel');
  obj.onOk = onOk;
  if (onCancel !== undefined) {
    obj.onCancel = onCancel;
  }
  confirm(obj);
};

export const confirmPhone = (code, phone, onOk) => {
  const obj = {};
  obj.width = 392;
  obj.title = i18n.t('confirm_modal_login_phone_correct');
  obj.content = <Text strong>{`${code}  ${phone}`}</Text>;
  obj.okText = i18n.t('modal_ok');
  obj.cancelText = i18n.t('modal_cancel');
  obj.onOk = onOk;
  obj.centered = true;
  confirm(obj);
};

export const showError = (code, phone, onOk) => {
  const obj = {};
  obj.width = 392;
  obj.title = i18n.t('confirm_modal_login_phone_correct');
  obj.content = <Text strong>{`${code}  ${phone}`}</Text>;
  obj.okText = i18n.t('modal_ok');
  obj.cancelText = i18n.t('modal_cancel');
  obj.onOk = onOk;
  obj.centered = true;
  confirm(obj);
};
