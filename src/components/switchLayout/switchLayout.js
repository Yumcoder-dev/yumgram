/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Modal } from 'antd';
import { storage, config } from '@appjs';
import { emitter } from '@yumjs';
import i18n from '@locale';

const { confirm } = Modal;

const setMobileLayout = mobile => {
  storage.setNoPrefix();
  storage
    .set({
      layout_selected: mobile ? 'mobile' : 'desktop',
      layout_width: window.innerWidth,
    })
    .then(() => {
      window.location.reload(false);
    });
};

class SwitchLayout {
  constructor() {
    this.confirmShown = false;
    this.started = false;
    this.resizeDesktopMsg = i18n.t('confirm_modal_resize_desktop');
    this.resizeMobileMsg = i18n.t('confirm_modal_resize_mobile');
  }

  start() {
    if (this.started || config.Navigator.mobile) {
      return;
    }
    this.started = true;
    this.layoutCheck();
    emitter.addListener('onWindowResize', size => this.layoutCheck(size));
  }

  layoutCheck(e) {
    if (this.confirmShown) {
      return;
    }
    const width = window.innerWidth;
    const newMobile = width < 600;
    if (!width || (!e && (config.Navigator.mobile ? width <= 800 : newMobile))) {
      return;
    }
    if (newMobile !== config.Mobile) {
      storage.setNoPrefix();
      storage.get('layout_width').then(confirmedWidth => {
        if (width === confirmedWidth) {
          return;
        }
        this.confirmShown = true;
        const self = this;
        confirm({
          title: newMobile ? self.resizeMobileMsg : self.resizeDesktopMsg,
          okText: i18n.t('modal_ok'),
          cancelText: i18n.t('modal_cancel'),
          onOk() {
            setMobileLayout(newMobile);
          },
          onCancel() {
            storage.setNoPrefix();
            storage.set({ layout_width: width });
            self.confirmShown = false;
          },
        });
      });
    }
  }
}

export default SwitchLayout;
