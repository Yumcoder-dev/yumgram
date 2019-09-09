/* eslint-disable no-param-reassign */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import {
  convertToUint8Array,
  sha1BytesSync,
  bufferConcat,
  nextRandomInt,
  bytesToHex,
  bytesCmp,
  bytesFromArrayBuffer,
  longToBytes,
  bytesToArrayBuffer,
  uintToInt,
  bigStringInt,
} from './bin';
import MtpSecureRandom from './mtpSecureRandom';
import { TLSerialization, TLDeserialization } from './tl';
import { emitter } from '@yumjs';
import { tsNow, dT } from './helper';
import MtpTimeManager from './mtpTimeManager';
import Config from './config';
import Storage from './storage';
import Defer from './defer';
import { isObject } from './type';
import CryptoWorker from './crypto';
import Timeout from './timeout';
import MtpDcConfigurator from './mtpDcConfigurator';
import { setZeroTimeout } from './polyfill';
import httpRequest from './http';
import getBadResponseError from './mtpNetErr';

class MtpNetworker {
  constructor(dcID, authKey, serverSalt, options) {
    this.updatesProcessor = false;
    this.offlineInited = false;
    this.akStopped = false;
    this.chromeMatches = navigator.userAgent.match(/Chrome\/(\d+(\.\d+)?)/);
    this.chromeVersion = (this.chromeMatches && parseFloat(this.chromeMatches[1])) || false;
    this.xhrSendBuffer =
      !('ArrayBufferView' in window) && (this.chromeVersion > 0 && this.chromeVersion < 30);

    // eslint-disable-next-line no-param-reassign
    options = options || {};

    this.dcID = dcID;

    this.authKey = authKey;
    this.authKeyUint8 = convertToUint8Array(authKey);
    this.authKeyID = sha1BytesSync(authKey).slice(-8);

    this.serverSalt = serverSalt;

    this.upload = options.fileUpload || options.fileDownload || false;

    this.updateSession();

    this.lastServerMessages = [];

    this.checkConnectionPeriod = 0;

    this.sentMessages = {};

    this.pendingMessages = {};
    this.pendingAcks = [];
    this.pendingResends = [];
    this.connectionInited = false;

    this.longPollInt = setInterval(() => this.checkLongPoll(), 10000);
    this.checkLongPoll();

    if (!this.offlineInited) {
      this.offlineInited = true;
      // this.offline = true;
      // this.offlineConnecting = true;
    }

    if (Config.Navigator.mobile) {
      this.setupMobileSleep();
    }
  }

  updateSession() {
    this.seqNo = 0;
    this.prevSessionID = this.sessionID;
    this.sessionID = new Array(8);
    MtpSecureRandom.nextBytes(this.sessionID);
  }

  setupMobileSleep() {
    // #todo chnage string with constant
    emitter.addListener('idle.isIDLE', isIDLE => {
      if (isIDLE) {
        this.sleepAfter = tsNow() + 30000;
      } else {
        delete this.sleepAfter;
        this.checkLongPoll();
      }
    });
    emitter.addListener('push_received', () => {
      // console.log(dT(), 'push recieved', this.sleepAfter)
      if (this.sleepAfter) {
        this.sleepAfter = tsNow() + 30000;
        this.checkLongPoll();
      }
    });
  }

  updateSentMessage(sentMessageID) {
    const sentMessage = this.sentMessages[sentMessageID];
    if (!sentMessage) {
      return false;
    }
    if (sentMessage.container) {
      const newInner = [];
      if (sentMessage.inner) {
        sentMessage.inner.forEach(innerSentMessageID => {
          const innerSentMessage = this.updateSentMessage(innerSentMessageID);
          if (innerSentMessage) {
            newInner.push(innerSentMessage.msg_id);
          }
        });
      }

      sentMessage.inner = newInner;
    }
    sentMessage.msg_id = MtpTimeManager.generateID();
    sentMessage.seq_no = this.generateSeqNo(sentMessage.notContentRelated || sentMessage.container);
    this.sentMessages[sentMessage.msg_id] = sentMessage;
    delete this.sentMessages[sentMessageID];
    return sentMessage;
  }

  generateSeqNo(notContentRelated) {
    let seqNo = this.seqNo * 2;
    if (!notContentRelated) {
      seqNo += 1;
      this.seqNo += 1;
    }
    return seqNo;
  }

  wrapMtpCall(method, params, options) {
    const serializer = new TLSerialization({ mtproto: true });
    serializer.storeMethod(method, params);
    const messageID = MtpTimeManager.generateID();
    const seqNo = this.generateSeqNo();
    const message = {
      msg_id: messageID,
      seq_no: seqNo,
      body: serializer.getBytes(),
    };
    if (Config.Modes.debug) {
      console.log(dT(), 'MT call', method, params, messageID, seqNo);
    }
    return this.pushMessage(message, options);
  }

  wrapMtpMessage(object, options) {
    options = options || {};
    const serializer = new TLSerialization({ mtproto: true });
    serializer.storeObject(object, 'Object');
    const messageID = MtpTimeManager.generateID();
    const seqNo = this.generateSeqNo(options.notContentRelated);
    const message = {
      msg_id: messageID,
      seq_no: seqNo,
      body: serializer.getBytes(),
    };
    if (Config.Modes.debug) {
      console.log(dT(), 'MT message', object, messageID, seqNo);
    }
    return this.pushMessage(message, options);
  }

  wrapApiCall(method, params, options) {
    const serializer = new TLSerialization(options);
    if (!this.connectionInited) {
      serializer.storeInt(0xda9b0d0d, 'invokeWithLayer');
      serializer.storeInt(Config.Schema.API.layer, 'layer');
      serializer.storeInt(0xc7481da6, 'initConnection');
      serializer.storeInt(Config.App.id, 'api_id');
      serializer.storeString(navigator.userAgent || 'Unknown UserAgent', 'device_model');
      serializer.storeString(navigator.platform || 'Unknown Platform', 'system_version');
      serializer.storeString(Config.App.version, 'app_version');
      serializer.storeString(navigator.language || 'en', 'system_lang_code');
      serializer.storeString('', 'lang_pack');
      serializer.storeString(navigator.language || 'en', 'lang_code');
    }
    if (options.afterMessageID) {
      serializer.storeInt(0xcb9f372d, 'invokeAfterMsg');
      serializer.storeLong(options.afterMessageID, 'msg_id');
    }
    options.resultType = serializer.storeMethod(method, params);
    const messageID = MtpTimeManager.generateID();
    const seqNo = this.generateSeqNo();
    const message = {
      msg_id: messageID,
      seq_no: seqNo,
      body: serializer.getBytes(true),
      isAPI: true,
    };
    if (Config.Modes.debug) {
      console.log(dT(), 'Api call', method, params, messageID, seqNo, options);
    } else {
      console.log(dT(), 'Api call', method);
    }

    return this.pushMessage(message, options);
  }

  checkLongPoll() {
    const isClean = this.cleanupSent();
    // console.log('Check lp', this.longPollPending, tsNow(), this.dcID, isClean)
    if (
      (this.longPollPending && tsNow() < this.longPollPending) ||
      this.offline ||
      this.akStopped
    ) {
      return;
    }
    Storage.get('dc').then(baseDcID => {
      if (
        isClean &&
        (baseDcID !== this.dcID || this.upload || (this.sleepAfter && tsNow() > this.sleepAfter))
      ) {
        // console.warn(dT(), 'Send long-poll for DC is delayed', this.dcID, this.sleepAfter)
        return;
      }
      this.sendLongPoll();
    });
  }

  sendLongPoll() {
    const maxWait = 25000;
    this.longPollPending = tsNow() + maxWait;
    // console.log('Set lp', this.longPollPending, tsNow());
    this.wrapMtpCall(
      'http_wait',
      {
        max_delay: 500,
        wait_after: 150,
        max_wait: maxWait,
      },
      {
        noResponse: true,
        longPoll: true,
      },
    ).then(
      () => {
        delete this.longPollPending;
        setZeroTimeout(() => this.checkLongPoll());
      },
      error => {
        console.log('Long-poll failed', error);
      },
    );
  }

  pushMessage(message, options) {
    const deferred = new Defer();
    this.sentMessages[message.msg_id] = Object.assign(message, options || {}, {
      deferred,
    });
    this.pendingMessages[message.msg_id] = 0;
    if (!options || !options.noShedule) {
      this.sheduleRequest();
    }
    if (isObject(options)) {
      options.messageID = message.msg_id;
    }
    return deferred.promise;
  }

  pushResend(messageID, delay) {
    const value = delay ? tsNow() + delay : 0;
    const sentMessage = this.sentMessages[messageID];
    if (sentMessage.container) {
      for (let i = 0; i < sentMessage.inner.length; i += 1) {
        this.pendingMessages[sentMessage.inner[i]] = value;
      }
    } else {
      this.pendingMessages[messageID] = value;
    }
    // console.log('Resend due', messageID, this.pendingMessages)
    this.sheduleRequest(delay);
  }

  getMsgKey(dataWithPadding, isOut) {
    const authKey = this.authKeyUint8;
    const x = isOut ? 0 : 8;
    const msgKeyLargePlain = bufferConcat(authKey.subarray(88 + x, 88 + x + 32), dataWithPadding);
    return CryptoWorker.sha256Hash(msgKeyLargePlain).then(msgKeyLarge => {
      const msgKey = new Uint8Array(msgKeyLarge).subarray(8, 24);
      return msgKey;
    });
  }

  getAesKeyIv(msgKey, isOut) {
    const authKey = this.authKeyUint8;
    const x = isOut ? 0 : 8;
    const sha2aText = new Uint8Array(52);
    const sha2bText = new Uint8Array(52);
    // const promises = {};
    sha2aText.set(msgKey, 0);
    sha2aText.set(authKey.subarray(x, x + 36), 16);
    const promisesSha2a = CryptoWorker.sha256Hash(sha2aText);
    sha2bText.set(authKey.subarray(40 + x, 40 + x + 36), 0);
    sha2bText.set(msgKey, 36);
    const promisesSha2b = CryptoWorker.sha256Hash(sha2bText);
    return Promise.all([promisesSha2a, promisesSha2b]).then(result => {
      const aesKey = new Uint8Array(32);
      const aesIv = new Uint8Array(32);
      const sha2a = new Uint8Array(result[0]); // sha2a
      const sha2b = new Uint8Array(result[1]); // sha2b
      aesKey.set(sha2a.subarray(0, 8));
      aesKey.set(sha2b.subarray(8, 24), 8);
      aesKey.set(sha2a.subarray(24, 32), 24);
      aesIv.set(sha2b.subarray(0, 8));
      aesIv.set(sha2a.subarray(8, 24), 8);
      aesIv.set(sha2b.subarray(24, 32), 24);
      return [aesKey, aesIv];
    });
  }

  checkConnection(event) {
    this.offlineConnecting = true;
    console.log(dT(), 'Check connection', event);
    emitter.emit('Check connection', event);
    // $timeout.cancel(this.checkConnectionPromise);
    if (this.checkConnectionPromise) {
      this.checkConnectionPromise.cancel();
    }
    const serializer = new TLSerialization({ mtproto: true });
    const pingID = [nextRandomInt(0xffffffff), nextRandomInt(0xffffffff)];
    serializer.storeMethod('ping', { ping_id: pingID });
    const pingMessage = {
      msg_id: MtpTimeManager.generateID(),
      seq_no: this.generateSeqNo(true),
      body: serializer.getBytes(),
    };
    this.sendEncryptedRequest(pingMessage, { timeout: 15000 }).then(
      () => {
        // delete $rootScope.offlineConnecting;
        emitter.emit('offlineConnecting', false);
        this.toggleOffline(false);
      },
      () => {
        console.log(dT(), 'Delay ', this.checkConnectionPeriod * 1000);
        this.checkConnectionPromise = new Timeout(
          () => this.checkConnection(),
          this.checkConnectionPeriod * 1000,
        );
        this.checkConnectionPeriod = Math.min(60, this.checkConnectionPeriod * 1.5);
        // eslint-disable-next-line no-new
        new Timeout(() => {
          // delete $rootScope.offlineConnecting;
          emitter.emit('offlineConnecting', false);
        }, 1000);
      },
    );
  }

  toggleOffline(enabled) {
    if (this.offline !== undefined && this.offline === enabled) {
      return;
    }
    this.offline = enabled;
    this.offlineConnecting = false;
    if (this.offline) {
      // $timeout.cancel(this.nextReqPromise);
      if (this.nextReqPromise) {
        this.nextReqPromise.cancel();
      }
      delete this.nextReq;
      if (this.checkConnectionPeriod < 1.5) {
        this.checkConnectionPeriod = 0;
      }
      this.checkConnectionPromise = new Timeout(
        () => this.checkConnection(),
        this.checkConnectionPeriod * 1000,
      );
      this.checkConnectionPeriod = Math.min(30, (1 + this.checkConnectionPeriod) * 1.5);
      // this.onOnlineCb = this.checkConnection.bind(this);
      // $(document.body).on('online focus', this.onOnlineCb);
      this.onlineFocusEventListener = emitter.addListener('online focus', () =>
        this.checkConnection(),
      );
    } else {
      delete this.longPollPending;
      this.checkLongPoll();
      this.sheduleRequest();
      if (this.onlineFocusEventListener) {
        this.onlineFocusEventListener.remove();
      }
      // if (this.onOnlineCb) {
      //   $(document.body).off('online focus', this.onOnlineCb);
      // }
      // $timeout.cancel(this.checkConnectionPromise);
      if (this.checkConnectionPromise) {
        this.checkConnectionPromise.cancel();
      }
    }
  }

  performSheduledRequest() {
    // console.log(dT(), 'sheduled', this.dcID, this.iii)
    // if (this.offline || this.akStopped) {
    //   console.log(dT(), 'Cancel sheduled');
    //   return;
    // }
    delete this.nextReq;
    if (this.pendingAcks.length) {
      const ackMsgIDs = [];
      for (let i = 0; i < this.pendingAcks.length; i += 1) {
        ackMsgIDs.push(this.pendingAcks[i]);
      }
      // console.log('acking messages', ackMsgIDs)
      this.wrapMtpMessage(
        { _: 'msgs_ack', msg_ids: ackMsgIDs },
        { notContentRelated: true, noShedule: true },
      );
    }
    if (this.pendingResends.length) {
      const resendMsgIDs = [];
      const resendOpts = { noShedule: true, notContentRelated: true };
      for (let i = 0; i < this.pendingResends.length; i += 1) {
        resendMsgIDs.push(this.pendingResends[i]);
      }
      // console.log('resendReq messages', resendMsgIDs)
      this.wrapMtpMessage({ _: 'msg_resend_req', msg_ids: resendMsgIDs }, resendOpts);
      this.lastResendReq = { req_msg_id: resendOpts.messageID, resend_msg_ids: resendMsgIDs };
    }
    const messages = [];
    let message;
    let messagesByteLen = 0;
    const currentTime = tsNow();
    let hasApiCall = false;
    let hasHttpWait = false;
    let lengthOverflow = false;
    let singlesCount = 0;
    Object.entries(this.pendingMessages).forEach(([messageID, value]) => {
      if (!value || value >= currentTime) {
        message = this.sentMessages[messageID];
        if (message) {
          const messageByteLength = (message.body.byteLength || message.body.length) + 32;
          if (!message.notContentRelated && lengthOverflow) {
            return;
          }
          if (
            !message.notContentRelated &&
            messagesByteLen &&
            messagesByteLen + messageByteLength > 655360
          ) {
            // 640 Kb
            lengthOverflow = true;
            return;
          }
          if (message.singleInRequest) {
            singlesCount += 1;
            if (singlesCount > 1) {
              return;
            }
          }
          messages.push(message);
          messagesByteLen += messageByteLength;
          if (message.isAPI) {
            hasApiCall = true;
          } else if (message.longPoll) {
            hasHttpWait = true;
          }
        } else {
          // console.log(message, messageID)
        }
        delete this.pendingMessages[messageID];
      }
    });

    if (hasApiCall && !hasHttpWait) {
      const serializer = new TLSerialization({ mtproto: true });
      serializer.storeMethod('http_wait', {
        max_delay: 500,
        wait_after: 150,
        max_wait: 3000,
      });
      messages.push({
        msg_id: MtpTimeManager.generateID(),
        seq_no: this.generateSeqNo(),
        body: serializer.getBytes(),
      });
    }

    if (!messages.length) {
      // console.log('no sheduled messages')
      return;
    }
    const noResponseMsgs = [];

    if (messages.length > 1) {
      const container = new TLSerialization({
        mtproto: true,
        startMaxLength: messagesByteLen + 64,
      });
      container.storeInt(0x73f1f8dc, 'CONTAINER[id]');
      container.storeInt(messages.length, 'CONTAINER[count]');
      // const onloads = [];
      const innerMessages = [];
      for (let i = 0; i < messages.length; i += 1) {
        container.storeLong(messages[i].msg_id, `CONTAINER[${i}][msg_id]`);
        innerMessages.push(messages[i].msg_id);
        container.storeInt(messages[i].seq_no, `CONTAINER[${i}][seq_no]`);
        container.storeInt(messages[i].body.length, `CONTAINER[${i}][bytes]`);
        container.storeRawBytes(messages[i].body, `CONTAINER[${i}][body]`);
        if (messages[i].noResponse) {
          noResponseMsgs.push(messages[i].msg_id);
        }
      }
      const containerSentMessage = {
        msg_id: MtpTimeManager.generateID(),
        seq_no: this.generateSeqNo(true),
        container: true,
        inner: innerMessages,
      };
      message = { body: container.getBytes(true), ...containerSentMessage };
      this.sentMessages[message.msg_id] = containerSentMessage;
      if (Config.Modes.debug) {
        console.log(dT(), 'Container', innerMessages, message.msg_id, message.seq_no);
      }
    } else {
      if (message.noResponse) {
        noResponseMsgs.push(message.msg_id);
      }
      this.sentMessages[message.msg_id] = message;
    }
    this.pendingAcks = [];
    this.sendEncryptedRequest(message).then(
      result => {
        this.toggleOffline(false);
        console.log('parse for', message);
        this.parseResponse(result).then(response => {
          if (Config.Modes.debug) {
            console.log(dT(), 'Server response', this.dcID, response);
          }
          this.processMessage(response.response, response.messageID, response.sessionID);
          noResponseMsgs.forEach(msgID => {
            if (this.sentMessages[msgID]) {
              const { deferred } = this.sentMessages[msgID];
              delete this.sentMessages[msgID];
              deferred.resolve();
            }
          });
          this.checkLongPoll();
          this.checkConnectionPeriod = Math.max(1.1, Math.sqrt(this.checkConnectionPeriod));
        });
      },
      error => {
        console.error('Encrypted request failed', error);
        if (message.container) {
          message.inner.forEach(msgID => {
            this.pendingMessages[msgID] = 0;
          });
          delete this.sentMessages[message.msg_id];
        } else {
          this.pendingMessages[message.msg_id] = 0;
        }
        noResponseMsgs.forEach(msgID => {
          if (this.sentMessages[msgID]) {
            const { deferred } = this.sentMessages[msgID];
            delete this.sentMessages[msgID];
            delete this.pendingMessages[msgID];
            deferred.reject();
          }
        });
        this.toggleOffline(true);
      },
    );
    if (lengthOverflow || singlesCount > 1) {
      this.sheduleRequest();
    }
  }

  getEncryptedMessage(dataWithPadding) {
    return this.getMsgKey(dataWithPadding, true).then(msgKey => {
      return this.getAesKeyIv(msgKey, true).then(keyIv => {
        // console.log(dT(), 'after msg key iv')
        return CryptoWorker.aesEncrypt(dataWithPadding, keyIv[0], keyIv[1]).then(encryptedBytes => {
          // console.log(dT(), 'Finish encrypt', encryptedBytes);
          return {
            bytes: encryptedBytes,
            msgKey,
          };
        });
      });
    });
  }

  getDecryptedMessage(msgKey, encryptedData) {
    // console.log(dT(), 'get decrypted start')
    return this.getAesKeyIv(msgKey, false).then(keyIv => {
      // console.log(dT(), 'after msg key iv')
      return CryptoWorker.aesDecrypt(encryptedData, keyIv[0], keyIv[1]);
    });
  }

  // eslint-disable-next-line no-unused-vars
  sendEncryptedRequest(message, options) {
    options = options || {};
    // console.log(dT(), 'Send encrypted'/*, message*/)
    // console.trace()
    const data = new TLSerialization({ startMaxLength: message.body.length + 2048 });

    data.storeIntBytes(this.serverSalt, 64, 'salt');
    data.storeIntBytes(this.sessionID, 64, 'session_id');

    data.storeLong(message.msg_id, 'message_id');
    data.storeInt(message.seq_no, 'seq_no');

    data.storeInt(message.body.length, 'message_data_length');
    data.storeRawBytes(message.body, 'message_data');

    const dataBuffer = data.getBuffer();
    const paddingLength = 16 - (data.offset % 16) + 16 * (1 + nextRandomInt(5));
    const padding = new Array(paddingLength);
    MtpSecureRandom.nextBytes(padding);

    const dataWithPadding = bufferConcat(dataBuffer, padding);
    return this.getEncryptedMessage(dataWithPadding).then(encryptedResult => {
      // console.log(dT(), 'Got encrypted out message', encryptedResult);
      const request = new TLSerialization({
        startMaxLength: encryptedResult.bytes.byteLength + 256,
      });
      request.storeIntBytes(this.authKeyID, 64, 'auth_key_id');
      request.storeIntBytes(encryptedResult.msgKey, 128, 'msg_key');
      request.storeRawBytes(encryptedResult.bytes, 'encrypted_data');
      const requestData = this.xhrSendBuffer ? request.getBuffer() : request.getArray();
      // let requestPromise;
      const url = MtpDcConfigurator.chooseServer(this.dcID, this.upload);
      return httpRequest(url, {
        method: 'POST',
        body: requestData,
        /* responseType: 'arraybuffer' */
      })
        .then(result => {
          if (!result || !result.byteLength) {
            return Promise.reject(getBadResponseError(url));
          }
          return result;
        })
        .catch(error => {
          // if (!error.message && !error.type) {
          //   error = Object.assign(baseError, {
          //     type: 'NETWORK_BAD_REQUEST',
          //     originalError: error,
          //   });
          // }
          return Promise.reject(getBadResponseError(url, error));
        });
      // try {
      //   // options = Object.assign(options || {}, {
      //   //   responseType: 'arraybuffer',
      //   //   transformRequest: null,
      //   // });
      //   requestPromise = fetch(
      //     url,
      //     {
      //       method: 'POST',
      //       body: requestData,
      //     } /* , options */,
      //   ).then(response => {
      //     if (response.ok) {
      //       return response.arrayBuffer();
      //     }
      //     return Promise.reject(response.text());
      //   });
      // } catch (e) {
      //   requestPromise = Promise.reject(e);
      // }
      // return requestPromise.then(
      //   result => {
      //     if (!result || !result.byteLength) {
      //       return Promise.reject(baseError);
      //     }
      //     return result;
      //   },
      //   error => {
      //     if (!error.message && !error.type) {
      //       error = Object.assign(baseError, {
      //         type: 'NETWORK_BAD_REQUEST',
      //         originalError: error,
      //       });
      //     }
      //     return Promise.reject(error);
      //   },
      // );
    });
  }

  parseResponse(responseBuffer) {
    console.log(dT(), 'Start parsing response', responseBuffer);
    let deserializer = new TLDeserialization(responseBuffer);

    const authKeyID = deserializer.fetchIntBytes(64, false, 'auth_key_id');
    if (!bytesCmp(authKeyID, this.authKeyID)) {
      throw new Error(`[MT] Invalid server auth_key_id: ${bytesToHex(authKeyID)}`);
    }
    const msgKey = deserializer.fetchIntBytes(128, true, 'msg_key');

    const encryptedData = deserializer.fetchRawBytes(
      responseBuffer.byteLength - deserializer.getOffset(),
      true,
      'encrypted_data',
    );
    return this.getDecryptedMessage(msgKey, encryptedData).then(dataWithPadding => {
      console.log(dT(), 'after decrypt');
      return this.getMsgKey(dataWithPadding, false).then(calcMsgKey => {
        if (!bytesCmp(msgKey, calcMsgKey)) {
          console.warn('[MT] msg_keys', msgKey, bytesFromArrayBuffer(calcMsgKey));
          throw new Error('[MT] server msgKey mismatch');
        }
        console.log(dT(), 'after msgKey check');
        deserializer = new TLDeserialization(dataWithPadding, { mtproto: true });
        /* const salt = */ deserializer.fetchIntBytes(64, false, 'salt');
        const sessionID = deserializer.fetchIntBytes(64, false, 'session_id');
        const messageID = deserializer.fetchLong('message_id');
        if (
          !bytesCmp(sessionID, this.sessionID) &&
          (!this.prevSessionID || !bytesCmp(sessionID, this.prevSessionID))
        ) {
          console.warn('Sessions', sessionID, this.sessionID, this.prevSessionID);
          throw new Error(`[MT] Invalid server session_id: ${bytesToHex(sessionID)}`);
        }
        const seqNo = deserializer.fetchInt('seq_no');
        const totalLength = dataWithPadding.byteLength;
        const messageBodyLength = deserializer.fetchInt('message_data[length]');
        let offset = deserializer.getOffset();
        if (messageBodyLength % 4 || messageBodyLength > totalLength - offset) {
          throw new Error(`[MT] Invalid body length: ${messageBodyLength}`);
        }
        const messageBody = deserializer.fetchRawBytes(messageBodyLength, true, 'message_data');
        offset = deserializer.getOffset();
        const paddingLength = totalLength - offset;
        if (paddingLength < 12 || paddingLength > 1024) {
          throw new Error(`[MT] Invalid padding length: ${paddingLength}`);
        }
        const buffer = bytesToArrayBuffer(messageBody);
        const self = this;
        const deserializerOptions = {
          mtproto: true,
          override: {
            mt_message(result, field) {
              result.msg_id = this.fetchLong(`${field}[msg_id]`);
              result.seqno = this.fetchInt(`${field}[seqno]`);
              result.bytes = this.fetchInt(`${field}[bytes]`);
              offset = this.getOffset();
              try {
                result.body = this.fetchObject('Object', `${field}[body]`);
              } catch (e) {
                console.error(dT(), 'parse error', e.message, e.stack);
                result.body = { _: 'parse_error', error: e };
              }
              if (this.offset !== offset + result.bytes) {
                // console.warn(dT(), 'set offset', this.offset, offset, result.bytes)
                // console.log(dT(), result)
                this.offset = offset + result.bytes;
              }
              // console.log(dT(), 'override message', result)
            },
            mt_rpc_result(result, field) {
              result.req_msg_id = this.fetchLong(`${field}[req_msg_id]`);
              const sentMessage = self.sentMessages[result.req_msg_id];
              const type = (sentMessage && sentMessage.resultType) || 'Object';
              if (result.req_msg_id && !sentMessage) {
                // console.warn(dT(), 'Result for unknown message', result)
                return;
              }
              result.result = this.fetchObject(type, `${field}[result]`);
              // console.log(dT(), 'override rpc_result', sentMessage, type, result)
            },
          },
        };
        deserializer = new TLDeserialization(buffer, deserializerOptions);
        const response = deserializer.fetchObject('', 'INPUT');
        return {
          response,
          messageID,
          sessionID,
          seqNo,
        };
      });
    });
  }

  applyServerSalt(newServerSalt) {
    const serverSalt = longToBytes(newServerSalt);
    const storeObj = {};
    storeObj[`dc${this.dcID}_server_salt`] = bytesToHex(serverSalt);
    Storage.set(storeObj);
    this.serverSalt = serverSalt;
    return true;
  }

  sheduleRequest(delay) {
    if (this.offline) {
      this.checkConnection('forced shedule');
    }
    const nextReq = tsNow() + delay;
    if (delay && this.nextReq && this.nextReq <= nextReq) {
      return;
    }
    // console.log(dT(), 'shedule req', delay)
    // console.trace()
    // $timeout.cancel(this.nextReqPromise);
    if (this.nextReqPromise) {
      this.nextReqPromise.cancel();
    }
    if (delay > 0) {
      this.nextReqPromise = new Timeout(() => this.performSheduledRequest(), delay || 0);
    } else {
      setZeroTimeout(() => this.performSheduledRequest());
    }
    this.nextReq = nextReq;
  }

  ackMessage(msgID) {
    // console.log('ack message', msgID)
    this.pendingAcks.push(msgID);
    this.sheduleRequest(30000);
  }

  reqResendMessage(msgID) {
    console.log(dT(), 'Req resend', msgID);
    this.pendingResends.push(msgID);
    this.sheduleRequest(100);
  }

  cleanupSent() {
    let notEmpty = false;
    // console.log('clean start', this.dcID/*, this.sentMessages*/)
    Object.entries(this.sentMessages).forEach(([msgID, message]) => {
      // console.log('clean iter', msgID, message)
      if (message.notContentRelated && this.pendingMessages[msgID] === undefined) {
        // console.log('clean notContentRelated', msgID)
        delete this.sentMessages[msgID];
      } else if (message.container) {
        for (let i = 0; i < message.inner.length; i += 1) {
          if (this.sentMessages[message.inner[i]] !== undefined) {
            // console.log('clean failed, found', msgID, message.inner[i], this.sentMessages[message.inner[i]].seq_no)
            notEmpty = true;
            return;
          }
        }
        // console.log('clean container', msgID)
        delete this.sentMessages[msgID];
      } else {
        notEmpty = true;
      }
    });

    return !notEmpty;
  }

  processMessageAck(messageID) {
    const sentMessage = this.sentMessages[messageID];
    if (sentMessage && !sentMessage.acked) {
      delete sentMessage.body;
      sentMessage.acked = true;
      return true;
    }
    return false;
  }

  static processError(rawError) {
    const matches = (rawError.error_message || '').match(/^([A-Z_0-9]+\b)(: (.+))?/) || [];
    rawError.error_code = uintToInt(rawError.error_code);
    return {
      code: !rawError.error_code || rawError.error_code <= 0 ? 500 : rawError.error_code,
      type: matches[1] || 'UNKNOWN',
      description: matches[3] || `CODE#${rawError.error_code} ${rawError.error_message}`,
      originalError: rawError,
    };
  }

  processMessage(message, messageID, sessionID) {
    const msgidInt = parseInt(messageID.toString(10).substr(0, -10), 10);
    if (msgidInt % 2) {
      console.warn('[MT] Server even message id: ', messageID, message);
      return;
    }
    console.log('process message', message, messageID, sessionID);
    switch (message._) {
      case 'msg_container':
        // const len = message.messages.length;
        for (let i = 0; i < message.messages.length; i += 1) {
          this.processMessage(message.messages[i], message.messages[i].msg_id, sessionID);
        }
        break;
      case 'bad_server_salt': {
        console.log(dT(), 'Bad server salt', message);
        const sentMessage = this.sentMessages[message.bad_msg_id];
        if (!sentMessage || sentMessage.seq_no !== message.bad_msg_seqno) {
          console.log(message.bad_msg_id, message.bad_msg_seqno);
          throw new Error('[MT] Bad server salt for invalid message');
        }
        this.applyServerSalt(message.new_server_salt);
        this.pushResend(message.bad_msg_id);
        this.ackMessage(messageID);
        break;
      }
      case 'bad_msg_notification': {
        console.log(dT(), 'Bad msg notification', message);
        const sentMessage = this.sentMessages[message.bad_msg_id];
        if (!sentMessage || sentMessage.seq_no !== message.bad_msg_seqno) {
          console.log(message.bad_msg_id, message.bad_msg_seqno);
          throw new Error('[MT] Bad msg notification for invalid message');
        }
        if (message.error_code === 16 || message.error_code === 17) {
          if (
            MtpTimeManager.applyServerTime(
              bigStringInt(messageID)
                .shiftRight(32)
                .toString(10),
            )
          ) {
            console.log(dT(), 'Update session');
            this.updateSession();
          }
          const badMessage = this.updateSentMessage(message.bad_msg_id);
          this.pushResend(badMessage.msg_id);
          this.ackMessage(messageID);
        }
        break;
      }

      case 'message':
        if (this.lastServerMessages.indexOf(messageID) !== -1) {
          // console.warn('[MT] Server same messageID: ', messageID)
          this.ackMessage(messageID);
          return;
        }
        this.lastServerMessages.push(messageID);
        if (this.lastServerMessages.length > 100) {
          this.lastServerMessages.shift();
        }
        this.processMessage(message.body, message.msg_id, sessionID);
        break;
      case 'new_session_created':
        this.ackMessage(messageID);
        this.processMessageAck(message.first_msg_id);
        this.applyServerSalt(message.server_salt);
        Storage.get('dc').then(baseDcID => {
          if (baseDcID === this.dcID && !this.upload && this.updatesProcessor) {
            this.updatesProcessor(message, true);
          }
        });
        break;
      case 'msgs_ack':
        for (let i = 0; i < message.msg_ids.length; i += 1) {
          this.processMessageAck(message.msg_ids[i]);
        }
        break;
      case 'msg_detailed_info':
        if (!this.sentMessages[message.msg_id]) {
          this.ackMessage(message.answer_msg_id);
          break;
        }
        break;
      case 'msg_new_detailed_info':
        if (this.pendingAcks.indexOf(message.answer_msg_id)) {
          break;
        }
        this.reqResendMessage(message.answer_msg_id);
        break;
      case 'msgs_state_info':
        this.ackMessage(message.answer_msg_id);
        if (
          this.lastResendReq &&
          this.lastResendReq.req_msg_id === message.req_msg_id &&
          this.pendingResends.length
        ) {
          let badMsgID;
          let pos;
          for (let i = 0; i < this.lastResendReq.resend_msg_ids.length; i += 1) {
            badMsgID = this.lastResendReq.resend_msg_ids[i];
            pos = this.pendingResends.indexOf(badMsgID);
            if (pos !== -1) {
              this.pendingResends.splice(pos, 1);
            }
          }
        }
        break;
      case 'rpc_result': {
        this.ackMessage(messageID);
        const sentMessageID = message.req_msg_id;
        const sentMessage = this.sentMessages[sentMessageID];
        this.processMessageAck(sentMessageID);
        if (sentMessage) {
          const { deferred } = sentMessage;
          if (message.result._ === 'rpc_error') {
            const error = MtpNetworker.processError(message.result);
            console.log(dT(), 'Rpc error', error);
            if (deferred) {
              deferred.reject(error);
            }
          } else {
            if (deferred) {
              if (Config.Modes.debug) {
                console.log(dT(), 'Rpc response', message.result);
              } else {
                let dRes = message.result._;
                if (!dRes) {
                  if (message.result.length > 5) {
                    dRes = `[..${message.result.length}..]`;
                  } else {
                    dRes = message.result;
                  }
                }
                console.log(dT(), 'Rpc response', dRes);
              }
              sentMessage.deferred.resolve(message.result);
            }
            if (sentMessage.isAPI) {
              this.connectionInited = true;
            }
          }
          delete this.sentMessages[sentMessageID];
        }
        break;
      }
      default:
        this.ackMessage(messageID);
        // console.log('Update', message)
        if (this.updatesProcessor) {
          this.updatesProcessor(message, true);
        }
        break;
    }
  }

  // static getNetworker(dcID, authKey, serverSalt, options) {
  //   return new MtpNetworker(dcID, authKey, serverSalt, options);
  // }

  setUpdatesProcessor(callback) {
    this.updatesProcessor = callback;
  }

  startAll() {
    if (this.akStopped) {
      this.akStopped = false;
      this.updatesProcessor({ _: 'new_session_created' }, true);
    }
  }

  stopAll() {
    this.akStopped = true;
  }
}

export default MtpNetworker;
