/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-bitwise */
import { nextRandomInt, longFromInts } from './bin';
import Storage from './storage';
import { tsNow, dT } from './helper';

class TimeManager {
  constructor() {
    this.lastMessageID = [0, 0];
    this.timeOffset = 0;
    Storage.get('server_time_offset').then(to => {
      if (to) {
        this.timeOffset = to;
      }
    });
  }

  // generateMessageID
  generateID() {
    const timeTicks = tsNow();
    const timeSec = Math.floor(timeTicks / 1000) + this.timeOffset;
    const timeMSec = timeTicks % 1000;
    const random = nextRandomInt(0xffff);

    let messageID = [timeSec, (timeMSec << 21) | (random << 3) | 4];
    if (
      this.lastMessageID[0] > messageID[0] ||
      (this.lastMessageID[0] === messageID[0] && this.lastMessageID[1] >= messageID[1])
    ) {
      messageID = [this.lastMessageID[0], this.lastMessageID[1] + 4];
    }

    this.lastMessageID = messageID;

    // console.log('generated msg id', messageID, timeOffset)

    return longFromInts(messageID[0], messageID[1]);
  }

  applyServerTime(serverTime, localTime) {
    const newTimeOffset = serverTime - Math.floor((localTime || tsNow()) / 1000);
    const changed = Math.abs(this.timeOffset - newTimeOffset) > 10;
    Storage.set({ server_time_offset: newTimeOffset });

    this.lastMessageID = [0, 0];
    this.timeOffset = newTimeOffset;
    console.log(dT(), 'Apply server time', serverTime, localTime, newTimeOffset, changed);

    return changed;
  }
}

const MtpTimeManager = new TimeManager();
export default MtpTimeManager;
