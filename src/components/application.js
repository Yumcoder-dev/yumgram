/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-param-reassign */
import SwitchLayout from './switchLayout/switchLayout';
import { polyfills, Idle, config, storage } from '@appjs';

// see https://github.com/zloirock/core-js
// https://reactjs.org/docs/javascript-environment-requirements.html
export default () => {
  // Prevent click-jacking
  try {
    // eslint-disable-next-line no-undef
    if (window === window.top || (window.chrome && chrome.app && chrome.app.window)) {
      document.documentElement.style.display = 'block';
    } else {
      window.top.location = window.location;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('CJ protection', e);
  }

  polyfills();
  new SwitchLayout().start();
  new Idle().start();

  // #todo
  //  var classes = [
  //   config.Navigator.osX ? 'osx' : 'non_osx',
  //   config.Navigator.msie ? 'msie' : 'non_msie',
  //   config.Navigator.retina ? 'is_2x' : 'is_1x'
  // ]
  // if (config.Modes.ios_standalone) {
  //   classes.push('ios_standalone')
  // }
  // $(document.body).addClass(classes.join(' '))

  // #todo ChangelogNotifyService.checkUpdate()
  // #todo MtpSingleInstanceService
  // #todo push_worker.js

  let layout = storage.syncGet('layout_selected');
  if (config.Modes.force_mobile) {
    layout = 'mobile';
  } else if (config.Modes.force_desktop) {
    layout = 'desktop';
  }

  switch (layout) {
    case '"mobile"':
      config.Mobile = true;
      break;
    case 'desktop':
      config.Mobile = false;
      break;
    default:
      config.Mobile = config.Navigator.mobile || (window.width > 10 && window.width < 480);
      break;
  }
};
