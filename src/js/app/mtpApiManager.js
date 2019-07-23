/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-cond-assign */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import Storage from './storage';
import emitter from '../core/emitter';
import { bytesFromHex, bytesToHex } from './bin';
import Defer from './defer';
import { isObject } from './type';
import MtpNetworker from './mtpNetworkerManager';
import MtpAuthorizer from './mtpAuthorizer';
import { tsNow, dT } from './helper';
import WebPushApiManager from './webPushApiManager';
import Config from './config';

class ApiManager {
  constructor() {
    this.cachedNetworkers = {};
    this.cachedUploadNetworkers = {};
    this.cachedExportPromise = {};
    this.baseDcID = false;
    // this.telegramMeNotified
    // MtpSingleInstanceService.start()
    Storage.get('dc').then(dcID => {
      if (dcID) {
        this.baseDcID = dcID;
      }
    });
  }

  telegramMeNotify(newValue) {
    if (this.telegramMeNotified !== newValue) {
      this.telegramMeNotified = newValue;
      // #todo
      // TelegramMeWebService.setAuthorized(this.telegramMeNotified);
    }
  }

  mtpSetUserAuth(dcID, userAuth) {
    const fullUserAuth = Object.assign({ dcID }, userAuth);
    Storage.set({
      dc: dcID,
      user_auth: fullUserAuth,
    });
    this.telegramMeNotify(true);
    emitter.emit('user_auth', fullUserAuth);

    this.baseDcID = dcID;
  }

  mtpLogOut() {
    const storageKeys = [];
    for (let dcID = 1; dcID <= 5; dcID += 1) {
      storageKeys.push(`dc${dcID}_auth_key`);
    }
    WebPushApiManager.forceUnsubscribe();
    return Storage.get(storageKeys).then(storageResult => {
      const logoutPromises = [];
      for (let i = 0; i < storageResult.length; i += 1) {
        if (storageResult[i]) {
          logoutPromises.push(
            this.invokeApi('auth.logOut', {}, { dcID: i + 1, ignoreErrors: true }),
          );
        }
      }
      return Promise.all(logoutPromises).then(
        () => {
          Storage.remove('dc', 'user_auth');
          this.baseDcID = false;
          this.telegramMeNotify(false);
          return this.mtpClearStorage();
        },
        error => {
          storageKeys.push('dc', 'user_auth');
          Storage.remove(storageKeys);
          this.baseDcID = false;
          // eslint-disable-next-line no-param-reassign
          error.handled = true;
          this.telegramMeNotify(false);
          return this.mtpClearStorage();
        },
      );
    });
  }

  static mtpClearStorage() {
    const saveKeys = ['user_auth', 't_user_auth', 'dc', 't_dc'];
    for (let dcID = 1; dcID <= 5; dcID += 1) {
      saveKeys.push(`dc${dcID}_auth_key`);
      saveKeys.push(`t_dc${dcID}_auth_key`);
    }
    Storage.noPrefix();
    Storage.get(saveKeys).then(values => {
      Storage.clear().then(() => {
        const restoreObj = {};
        saveKeys.forEach((key, i) => {
          const value = values[i];
          if (value !== false && value !== undefined) {
            restoreObj[key] = value;
          }
        });
        Storage.noPrefix();
        return Storage.set(restoreObj);
      });
    });
  }

  mtpGetNetworker(dcID, options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};

    const cache =
      options.fileUpload || options.fileDownload
        ? this.cachedUploadNetworkers
        : this.cachedNetworkers;
    if (!dcID) {
      throw new Error('get Networker without dcID');
    }

    if (cache[dcID] !== undefined) {
      return Promise.resolve(cache[dcID]);
    }

    const akk = `dc${dcID}_auth_key`;
    const ssk = `dc${dcID}_server_salt`;

    return Storage.get(akk, ssk).then(result => {
      if (cache[dcID] !== undefined) {
        return cache[dcID];
      }

      const authKeyHex = result[0];
      let serverSaltHex = result[1];
      // console.log('ass', dcID, authKeyHex, serverSaltHex)
      if (authKeyHex && authKeyHex.length === 512) {
        if (!serverSaltHex || serverSaltHex.length !== 16) {
          serverSaltHex = 'AAAAAAAAAAAAAAAA';
        }
        const authKey = bytesFromHex(authKeyHex);
        const serverSalt = bytesFromHex(serverSaltHex);

        return (cache[dcID] = new MtpNetworker(dcID, authKey, serverSalt, options));
      }

      if (!options.createNetworker) {
        return Promise.reject(new Error({ type: 'AUTH_KEY_EMPTY', code: 401 }));
      }

      return MtpAuthorizer.auth(dcID).then(
        auth => {
          const storeObj = {};
          storeObj[akk] = bytesToHex(auth.authKey);
          storeObj[ssk] = bytesToHex(auth.serverSalt);
          Storage.set(storeObj);
          // eslint-disable-next-line no-return-assign
          return (cache[dcID] = new MtpNetworker(dcID, auth.authKey, auth.serverSalt, options));
        },
        error => {
          console.log('Get networker error', error, error.stack);
          return Promise.reject(error);
        },
      );
    });
  }

  invokeApi(method, params, options) {
    options = options || {};

    const deferred = new Defer();
    const rejectPromise = error => {
      if (!error) {
        error = { type: 'ERROR_EMPTY' };
      } else if (!isObject(error)) {
        error = { message: error };
      }
      deferred.reject(error);
      if (options.ignoreErrors) {
        return;
      }

      if (error.code === 406) {
        error.handled = true;
      }

      if (!options.noErrorBox) {
        error.input = method;
        error.stack =
          this.stack || // todo
          (error.originalError && error.originalError.stack) ||
          error.stack ||
          new Error().stack;
        setTimeout(() => {
          if (!error.handled) {
            if (error.code === 401) {
              this.mtpLogOut().finally(() => {
                if (
                  location.protocol === 'http:' &&
                  !Config.Modes.http &&
                  Config.App.domains.indexOf(location.hostname) !== -1
                ) {
                  location.href = location.href.replace(/^http:/, 'https:');
                } else {
                  location.hash = '/login';
                  // todo reload
                  // AppRuntimeManager.reload();
                }
              });
            } else {
              // todo show err!
              // ErrorService.show({ error });
              console.log(error);
            }
            error.handled = true;
          }
        }, 100);
      }
    };
    let dcID;
    //   networkerPromise

    // let cachedNetworker;
    this.stack = new Error().stack || 'empty stack';
    const performRequest = networker => {
      console.log('dddddd', method, params, options);
      return networker.wrapApiCall(method, params, options).then(
        result => {
          deferred.resolve(result);
        },
        // eslint-disable-next-line consistent-return
        error => {
          console.error(dT(), 'Error', error.code, error.type, this.baseDcID, dcID);
          if (error.code === 401 && this.baseDcID === dcID) {
            Storage.remove('dc', 'user_auth');
            this.telegramMeNotify(false);
            rejectPromise(error);
          } else if (error.code === 401 && this.baseDcID && dcID !== this.baseDcID) {
            if (this.cachedExportPromise[dcID] === undefined) {
              const exportDeferred = new Defer();

              this.invokeApi(
                'auth.exportAuthorization',
                { dc_id: dcID },
                { noErrorBox: true },
              ).then(
                exportedAuth => {
                  this.invokeApi(
                    'auth.importAuthorization',
                    {
                      id: exportedAuth.id,
                      bytes: exportedAuth.bytes,
                    },
                    { dcID, noErrorBox: true },
                  ).then(
                    () => {
                      exportDeferred.resolve();
                    },
                    e => {
                      exportDeferred.reject(e);
                    },
                  );
                },
                e => {
                  exportDeferred.reject(e);
                },
              );

              this.cachedExportPromise[dcID] = exportDeferred.promise;
            }

            this.cachedExportPromise[dcID].then(() => {
              networker
                .wrapApiCall(method, params, options)
                .then(result => deferred.resolve(result), rejectPromise);
            }, rejectPromise);
          } else if (error.code === 303) {
            const newDcID = error.type.match(
              /^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/,
            )[2];
            if (newDcID !== dcID) {
              if (options.dcID) {
                options.dcID = newDcID;
              } else {
                Storage.set({ dc: (this.baseDcID = newDcID) });
              }

              this.mtpGetNetworker(newDcID, options).then(migrateNetworker => {
                migrateNetworker
                  .wrapApiCall(method, params, options)
                  .then(result => deferred.resolve(result), rejectPromise);
              }, rejectPromise);
            }
          } else if (!options.rawError && error.code === 420) {
            const waitTime = error.type.match(/^FLOOD_WAIT_(\d+)/)[1] || 10;
            if (waitTime > (options.timeout || 60)) {
              return rejectPromise(error);
            }
            setTimeout(() => performRequest(networker), waitTime * 1000);
          } else if (
            !options.rawError &&
            (error.code === 500 || error.type === 'MSG_WAIT_FAILED')
          ) {
            const now = tsNow();
            if (options.stopTime) {
              if (now >= options.stopTime) {
                return rejectPromise(error);
              }
            } else {
              options.stopTime =
                now + (options.timeout !== undefined ? options.timeout : 10) * 1000;
            }
            options.waitTime = options.waitTime ? Math.min(60, options.waitTime * 1.5) : 1;
            setTimeout(() => performRequest(networker), options.waitTime * 1000);
          } else {
            rejectPromise(error);
          }
        },
      );
    };

    if ((dcID = options.dcID || this.baseDcID)) {
      this.mtpGetNetworker(dcID, options).then(performRequest, rejectPromise);
    } else {
      Storage.get('dc').then(baseDcID => {
        this.mtpGetNetworker((dcID = baseDcID || 2), options).then(performRequest, rejectPromise);
      });
    }

    return deferred.promise;
  }

  mtpGetUserID() {
    return Storage.get('user_auth').then(auth => {
      this.telegramMeNotify((auth && auth.id > 0) || false);
      return auth.id || 0;
    });
  }

  getBaseDcID() {
    return this.baseDcID || false;
  }

  // return {
  //   getBaseDcID: getBaseDcID,
  //   getUserID: mtpGetUserID,
  //   invokeApi: mtpInvokeApi,
  //   getNetworker: mtpGetNetworker,
  //   setUserAuth: mtpSetUserAuth,
  //   logOut: mtpLogOut
  // }
}
const MtpApiManager = new ApiManager();
export default MtpApiManager;
