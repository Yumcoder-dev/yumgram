/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Modal } from 'antd';
import Storage from '../../js/app/storage';
import Config from '../../js/app/config';
import Emitter from '../../js/core/emitter';
import i18n from '../../locales/i18n';

const { confirm } = Modal;

const setMobileLayout = mobile => {
  Storage.setNoPrefix();
  Storage.set({
    layout_selected: mobile ? 'mobile' : 'desktop',
    layout_width: window.innerWidth,
  }).then(() => {
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
    if (this.started || Config.Navigator.mobile) {
      return;
    }
    this.started = true;
    this.layoutCheck();
    Emitter.addListener('onWindowResize', size => this.layoutCheck(size));
  }

  layoutCheck(e) {
    if (this.confirmShown) {
      return;
    }
    const width = window.innerWidth;
    const newMobile = width < 600;
    if (!width || (!e && (Config.Navigator.mobile ? width <= 800 : newMobile))) {
      return;
    }
    if (newMobile !== Config.Mobile) {
      Storage.setNoPrefix();
      Storage.get('layout_width').then(confirmedWidth => {
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
            Storage.setNoPrefix();
            Storage.set({ layout_width: width });
            self.confirmShown = false;
          },
        });
      });
    }
  }
}

export default SwitchLayout;
