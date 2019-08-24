/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import i18n from '../../locales/i18n';
import { dT } from './helper';
import emitter from '../core/emitter';
import Config from './config';

class WebPushApiManager {
  constructor() {
    this.isAvailable = true;
    this.isPushEnabled = false;
    this.localNotificationsAvailable = true;
    this.started = false;
    this.settings = {};
    this.isAliveTO = false;
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    this.userVisibleOnly = !this.isFirefox /*  ? false : true */;

    if (
      !('PushManager' in window) ||
      !('Notification' in window) ||
      !('serviceWorker' in navigator)
    ) {
      console.warn('Push messaging is not supported.');
      this.isAvailable = false;
      this.localNotificationsAvailable = false;
    }

    if (this.isAvailable && Notification.permission === 'denied') {
      console.warn('The user has blocked notifications.');
    }
  }

  start() {
    if (!this.started) {
      this.started = true;
      this.getSubscription();
      this.setUpServiceWorkerChannel();
    }
  }

  setLocalNotificationsDisabled() {
    this.localNotificationsAvailable = false;
  }

  getSubscription() {
    if (!this.isAvailable) {
      return;
    }
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager
        .getSubscription()
        .then(subscription => {
          this.isPushEnabled = !!subscription;
          this.pushSubscriptionNotify('init', subscription);
        })
        .catch(err => {
          console.log('Error during getSubscription()', err);
        });
    });
  }

  subscribe() {
    if (!this.isAvailable) {
      return;
    }
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager
        .subscribe({ userVisibleOnly: this.userVisibleOnly })
        .then(subscription => {
          // The subscription was successful
          this.isPushEnabled = true;
          this.pushSubscriptionNotify('subscribe', subscription);
        })
        .catch(e => {
          if (Notification.permission === 'denied') {
            console.log('Permission for Notifications was denied');
          } else {
            console.log('Unable to subscribe to push.', e);
            if (!this.userVisibleOnly) {
              this.userVisibleOnly = true;
              setTimeout(() => this.subscribe(), 0);
            }
          }
        });
    });
  }

  unsubscribe() {
    if (!this.isAvailable) {
      return;
    }
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager
        .getSubscription()
        .then(subscription => {
          this.isPushEnabled = false;

          if (subscription) {
            this.pushSubscriptionNotify('unsubscribe', subscription);

            setTimeout(() => {
              subscription
                .unsubscribe()
                .then(() => {
                  this.isPushEnabled = false;
                })
                .catch(e => {
                  console.error('Unsubscription error: ', e);
                });
            }, 3000);
          }
        })
        .catch(e => {
          console.error('Error thrown while unsubscribing from push messaging.', e);
        });
    });
  }

  forceUnsubscribe() {
    if (!this.isAvailable) {
      return;
    }
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager
        .getSubscription()
        .then(subscription => {
          console.warn('force unsubscribe', subscription);
          if (subscription) {
            subscription
              .unsubscribe()
              .then(successful => {
                console.warn('force unsubscribe successful', successful);
                this.isPushEnabled = false;
              })
              .catch(e => {
                console.error('Unsubscription error: ', e);
              });
          }
        })
        .catch(e => {
          console.error('Error thrown while unsubscribing from push messaging.', e);
        });
    });
  }

  isAliveNotify() {
    // todo
    if (!this.isAvailable /* || ($rootScope.idle && $rootScope.idle.deactivated) */) {
      return;
    }
    this.settings.baseUrl = `${(location.href || '').replace(/#.*$/, '')}#/im`;

    const eventData = {
      type: 'ping',
      localNotifications: this.localNotificationsAvailable,
      lang: {
        push_action_mute1d: i18n.t(
          Config.Mobile ? 'push_action_mute1d_mobile_raw' : 'push_action_mute1d_raw',
        ),
        push_action_settings: i18n.t(
          Config.Mobile ? 'push_action_settings_mobile_raw' : 'push_action_settings_raw',
        ),
        push_message_nopreview: i18n.t('push_message_nopreview_raw'),
      },
      settings: this.settings,
    };
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(eventData);
    }
    this.isAliveTO = setTimeout(() => this.isAliveNotify(), 10000);
  }

  setSettings(newSettings) {
    this.settings = { ...newSettings };
    clearTimeout(this.isAliveTO);
    this.isAliveNotify();
  }

  hidePushNotifications() {
    if (!this.isAvailable) {
      return;
    }
    if (navigator.serviceWorker.controller) {
      const eventData = { type: 'notifications_clear' };
      navigator.serviceWorker.controller.postMessage(eventData);
    }
  }

  setUpServiceWorkerChannel() {
    if (!this.isAvailable) {
      return;
    }
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.type === 'push_click') {
        // todo
        // if ($rootScope.idle && $rootScope.idle.deactivated) {
        //   AppRuntimeManager.reload();
        //   return;
        // }
        emitter.emit('push_notification_click', event.data.data);
      }
    });
    navigator.serviceWorker.ready.then(this.isAliveNotify);
  }

  // eslint-disable-next-line consistent-return
  pushSubscriptionNotify(event, subscription) {
    if (subscription) {
      const subscriptionObj = subscription.toJSON();
      if (
        !subscriptionObj ||
        !subscriptionObj.endpoint ||
        !subscriptionObj.keys ||
        !subscriptionObj.keys.p256dh ||
        !subscriptionObj.keys.auth
      ) {
        console.warn(dT(), 'Invalid push subscription', subscriptionObj);
        this.unsubscribe();
        this.isAvailable = false;
        return this.pushSubscriptionNotify(event, false);
      }
      console.warn(dT(), 'Push', event, subscriptionObj);
      emitter.emit(`push_${event}`, {
        tokenType: 10,
        tokenValue: JSON.stringify(subscriptionObj),
      });
    } else {
      console.warn(dT(), 'Push', event, false);
      emitter.emit(`push_${event}`, false);
    }
  }
}

const webPushApiManager = new WebPushApiManager();
export default webPushApiManager;
