/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-param-reassign */
class Storage {
  constructor() {
    // #todo check creation lifecycle
    this.keyPrefix = '';
    this.noPrefix = false;
    this.cache = {};
    this.useCs = !!(window.chrome && window.chrome.storage && window.chrome.storage.local);
    this.useLs = !this.useCs && !!window.localStorage;
  }

  prefix(newPrefix) {
    this.keyPrefix = newPrefix;
  }

  setNoPrefix() {
    this.noPrefix = true;
  }

  // private
  storageGetPrefix() {
    if (this.noPrefix) {
      this.noPrefix = false;
      return '';
    }
    return this.keyPrefix;
  }

  // eslint-disable-next-line class-methods-use-this
  syncGet(key) {
    return localStorage.getItem(key);
  }

  get(keys) {
    return new Promise(resolve => {
      let single = false;
      if (!Array.isArray(keys)) {
        // eslint-disable-next-line prefer-rest-params
        keys = Array.prototype.slice.call(arguments); // convert to array
        single = keys.length === 1;
      }
      let result = [];
      let value;
      let allFound = true;
      const prefix = this.storageGetPrefix();
      let i;
      let key;

      for (i = 0; i < keys.length; i += 1) {
        // eslint-disable-next-line
        key = keys[i] = prefix + keys[i];
        if (key.substr(0, 3) !== 'xt_' && this.cache[key] !== undefined) {
          result.push(this.cache[key]);
        } else if (this.useLs) {
          try {
            value = localStorage.getItem(key);
          } catch (e) {
            this.useLs = false;
          }
          try {
            value = value === undefined || value === null ? false : JSON.parse(value);
          } catch (e) {
            value = false;
          }
          result.push((this.cache[key] = value));
        } else if (!this.useCs) {
          result.push((this.cache[key] = false));
        } else {
          allFound = false;
        }
      }

      if (allFound) {
        resolve(single ? result[0] : result);
        return;
      }

      window.chrome.storage.local.get(keys, resultObj => {
        let val;
        result = [];
        for (i = 0; i < keys.length; i += 1) {
          key = keys[i];
          val = resultObj[key];
          val = val === undefined || val === null ? false : JSON.parse(val);
          result.push((this.cache[key] = val));
        }

        resolve(single ? result[0] : result);
      });
    });
  }

  set(obj) {
    return new Promise(resolve => {
      const keyValues = {};
      const prefix = this.storageGetPrefix();
      let key;
      let value;

      // eslint-disable-next-line no-restricted-syntax
      for (key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
          value = obj[key];
          key = prefix + key;
          this.cache[key] = value;
          value = JSON.stringify(value);
          if (this.useLs) {
            try {
              localStorage.setItem(key, value);
            } catch (e) {
              this.useLs = false;
            }
          } else {
            keyValues[key] = value;
          }
        }
      }

      if (this.useLs || !this.useCs) {
        resolve();
        return;
      }

      window.chrome.storage.local.set(keyValues, () => resolve());
    });
  }

  remove(keys) {
    return new Promise(resolve => {
      if (!Array.isArray(keys)) {
        // eslint-disable-next-line prefer-rest-params
        keys = Array.prototype.slice.call(arguments);
      }
      const prefix = this.storageGetPrefix();
      let i;
      let key;

      for (i = 0; i < keys.length; i += 1) {
        // eslint-disable-next-line no-multi-assign
        key = keys[i] = prefix + keys[i];
        delete this.cache[key];
        if (this.useLs) {
          try {
            localStorage.removeItem(key);
          } catch (e) {
            this.useLs = false;
          }
        }
      }
      if (this.useCs) {
        window.chrome.storage.local.remove(keys, () => resolve());
      } else {
        resolve();
      }
    });
  }

  clear() {
    return new Promise(resolve => {
      if (this.useLs) {
        try {
          localStorage.clear();
        } catch (e) {
          this.useLs = false;
        }
      }

      if (this.useCs) {
        window.chrome.storage.local.clear(() => {
          this.cache = {};
          resolve();
        });
      } else {
        this.cache = {};
        resolve();
      }
    });
  }
}

export default new Storage();
