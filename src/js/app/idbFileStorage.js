/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-return-assign */
import Defer from './defer';
import { blobConstruct, dataUrlToBlob, blobSafeMimeType, bytesToBase64 } from './bin';
import FileManager from './fileManager';

export default class IdbFileStorage {
  constructor() {
    window.indexedDB =
      window.indexedDB ||
      window.webkitIndexedDB ||
      window.mozIndexedDB ||
      window.OIndexedDB ||
      window.msIndexedDB;

    window.IDBTransaction =
      window.IDBTransaction ||
      window.webkitIDBTransaction ||
      window.OIDBTransaction ||
      window.msIDBTransaction;

    this.dbName = 'cachedFiles';
    this.dbStoreName = 'files';
    this.dbVersion = 1;
    // this.openDbPromise
    this.storageIsAvailable = window.indexedDB !== undefined && window.IDBTransaction !== undefined;

    // IndexedDB is REALLY slow without blob support in Safari 8, no point in it
    if (
      this.storageIsAvailable &&
      navigator.userAgent.indexOf('Safari') !== -1 &&
      navigator.userAgent.indexOf('Chrome') === -1 &&
      navigator.userAgent.match(/Version\/[678]/)
    ) {
      this.storageIsAvailable = false;
    }

    this.storeBlobsAvailable = this.storageIsAvailable || false;
    this.openDatabase();
  }

  isAvailable() {
    return this.storageIsAvailable;
  }

  openDatabase() {
    if (this.openDbPromise) {
      return this.openDbPromise;
    }

    const deferred = new Defer();
    const createObjectStore = db => {
      db.createObjectStore(this.dbStoreName);
    };
    let request;
    try {
      request = indexedDB.open(this.dbName, this.dbVersion);
      if (!request) {
        throw new Error();
      }
    } catch (error) {
      console.error('error opening db', error.message);
      this.storageIsAvailable = false;
      return Promise.reject(error);
    }

    let finished = false;
    setTimeout(() => {
      if (!finished) {
        request.onerror({ type: 'IDB_CREATE_TIMEOUT' });
      }
    }, 3000);

    request.onsuccess = () => {
      finished = true;
      const db = request.result;

      db.onerror = error => {
        this.storageIsAvailable = false;
        console.error('Error creating/accessing IndexedDB database', error);
        deferred.reject(error);
      };

      deferred.resolve(db);
    };

    request.onerror = event => {
      finished = true;
      this.storageIsAvailable = false;
      console.error('Error creating/accessing IndexedDB database', event);
      deferred.reject(event);
    };

    request.onupgradeneeded = event => {
      finished = true;
      console.warn('performing idb upgrade from', event.oldVersion, 'to', event.newVersion);
      const db = event.target.result;
      if (event.oldVersion === 1) {
        db.deleteObjectStore(this.dbStoreName);
      }
      createObjectStore(db);
    };

    return (this.openDbPromise = deferred.promise);
  }

  saveFile(fileName, blob) {
    return this.openDatabase().then(db => {
      if (!this.storeBlobsAvailable) {
        return this.saveFileBase64(db, fileName, blob);
      }

      if (!(blob instanceof Blob)) {
        // eslint-disable-next-line no-param-reassign
        blob = blobConstruct([blob]);
      }

      let request;
      try {
        const objectStore = db
          .transaction([this.dbStoreName], IDBTransaction.READ_WRITE || 'readwrite')
          .objectStore(this.dbStoreName);
        request = objectStore.put(blob, fileName);
      } catch (error) {
        if (this.storeBlobsAvailable) {
          this.storeBlobsAvailable = false;
          return this.saveFileBase64(db, fileName, blob);
        }
        this.storageIsAvailable = false;
        return Promise.reject(error);
      }

      const deferred = new Defer();

      request.onsuccess = () => {
        deferred.resolve(blob);
      };

      request.onerror = error => {
        deferred.reject(error);
      };

      return deferred.promise;
    });
  }

  saveFileBase64(db, fileName, blob) {
    if (IdbFileStorage.getBlobSize(blob) > 10 * 1024 * 1024) {
      return Promise.reject();
    }
    if (!(blob instanceof Blob)) {
      const safeMimeType = blobSafeMimeType(blob.type || 'image/jpeg');
      const address = `data:${safeMimeType};base64,${bytesToBase64(blob)}`;
      return this.storagePutB64String(db, fileName, address).then(() => {
        return blob;
      });
    }

    let reader;
    try {
      reader = new FileReader();
    } catch (e) {
      this.storageIsAvailable = false;
      return Promise.reject();
    }

    const deferred = new Defer();

    reader.onloadend = () => {
      this.storagePutB64String(db, fileName, reader.result).then(
        () => {
          deferred.resolve(blob);
        },
        error => {
          deferred.reject(error);
        },
      );
    };

    reader.onerror = error => {
      deferred.reject(error);
    };

    try {
      reader.readAsDataURL(blob);
    } catch (e) {
      this.storageIsAvailable = false;
      return Promise.reject();
    }

    return deferred.promise;
  }

  storagePutB64String(db, fileName, b64string) {
    let request;

    try {
      const objectStore = db
        .transaction([this.dbStoreName], IDBTransaction.READ_WRITE || 'readwrite')
        .objectStore(this.dbStoreName);
      request = objectStore.put(b64string, fileName);
    } catch (error) {
      this.storageIsAvailable = false;
      return Promise.reject(error);
    }

    const deferred = new Defer();

    request.onsuccess = () => {
      deferred.resolve();
    };

    request.onerror = error => {
      deferred.reject(error);
    };

    return deferred.promise;
  }

  static getBlobSize(blob) {
    return blob.size || blob.byteLength || blob.length;
  }

  getFile(fileName) {
    return openDatabase().then(db => {
      const deferred = new Defer();
      const objectStore = db
        .transaction([this.dbStoreName], IDBTransaction.READ || 'readonly')
        .objectStore(this.dbStoreName);
      const request = objectStore.get(fileName);

      request.onsuccess = event => {
        const { result } = event.target;
        if (result === undefined) {
          deferred.reject();
        } else if (typeof result === 'string' && result.substr(0, 5) === 'data:') {
          deferred.resolve(dataUrlToBlob(result));
        } else {
          deferred.resolve(result);
        }
      };

      request.onerror = error => {
        deferred.reject(error);
      };

      return deferred.promise;
    });
  }

  getFileWriter(fileName, mimeType) {
    const fakeWriter = FileManager.getFakeFileWriter(mimeType, blob => {
      this.saveFile(fileName, blob);
    });
    return Promise.resolve(fakeWriter);
  }
}
