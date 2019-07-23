/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { emitter } from '../core';
import Config from './config';
import Storage from './storage';
import IdleManager from './idle';
import { tsNow, dT } from './helper';
import { nextRandomInt } from './bin';
import Timeout from './timeout';

class MtpService {
  constructor() {
    this.instanceID = nextRandomInt(0xffffffff);
    this.started = false;
    this.masterInstance = false;
    this.deactivatePromise = false;
    this.deactivated = false;
    this.initial = false;
  }

  start() {
    console.log('start...');
    if (!this.started && !Config.mobile && !Config.Modes.packed) {
      this.started = true;

      this.idleManager = new IdleManager();
      this.idleManager.start();

      emitter.addListener('idle.isIDLE', isIDLE => {
        this.idle = isIDLE;
        this.checkInstance();
      });
      setInterval(() => this.checkInstance(), 5000);
      this.checkInstance();

      try {
        window.addEventListener('beforeunload', event => {
          event.preventDefault();
          // Chrome requires returnValue to be set.
          // eslint-disable-next-line no-param-reassign
          event.returnValue = '';
          this.clearInstance();
        });
      } catch (e) {
        // eslint-disable-next-line no-empty
      }
    }
  }

  checkInstance() {
    if (this.deactivated) {
      return;
    }
    const time = tsNow();
    // const idle = $rootScope.idle && $rootScope.idle.isIDLE;
    const newInstance = { id: this.instanceID, idle: this.idle, time };

    Storage.get('xt_instance').then(curInstance => {
      // console.log(dT(), 'check instance', newInstance, curInstance);
      if (
        !this.idle ||
        !curInstance ||
        curInstance.id === this.instanceID ||
        curInstance.time < time - 20000
      ) {
        Storage.set({ xt_instance: newInstance });
        if (!this.masterInstance) {
          // MtpNetworkerFactory.startAll();
          if (!this.initial) {
            this.initial = true;
          } else {
            console.warn(dT(), 'now master instance', newInstance);
          }
          this.masterInstance = true;
        }
        if (this.deactivatePromise) {
          this.deactivatePromise.cancel();
          delete this.deactivatePromise;
        }
      } else if (this.masterInstance) {
        // MtpNetworkerFactory.stopAll();
        console.warn(dT(), 'now idle instance', newInstance);
        if (!this.deactivatePromise) {
          this.deactivatePromise = new Timeout(() => this.deactivateInstance(), 30000);
        }
        this.masterInstance = false;
      }
    });
  }

  clearInstance() {
    if (this.masterInstance && !this.deactivated) {
      console.warn('clear master instance');
      Storage.remove('xt_instance');
    }
  }

  deactivateInstance() {
    if (this.masterInstance || this.deactivated) {
      return;
    }
    console.log(dT(), 'deactivate');
    this.deactivatePromise = false;
    this.deactivated = true;
    this.clearInstance();
    // $modalStack.dismissAll();

    // document.title = _('inactive_tab_title_raw');

    // const inactivePageCompiled = $compile(
    //   '<ng-include src="\'partials/desktop/inactive.html\'"></ng-include>',
    // );

    // const scope = $rootScope.$new(true);
    // scope.close = function() {
    //   AppRuntimeManager.close();
    // };
    // scope.reload = function() {
    //   AppRuntimeManager.reload();
    // };
    // inactivePageCompiled(scope, function(clonedElement) {
    //   $('.page_wrap').hide();
    //   $(clonedElement).appendTo($('body'));
    // });
    // $rootScope.idle.deactivated = true;
  }
}

export default new MtpService();
