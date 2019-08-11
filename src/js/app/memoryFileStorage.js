/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-return-assign */
import FileManager from './fileManager';

class MemoryFileStorage {
  constructor() {
    this.storage = {};
  }

  // eslint-disable-next-line class-methods-use-this
  isAvailable() {
    return true;
  }

  getFile(fileName) {
    if (this.storage[fileName]) {
      return Promise.resolve(this.storage[fileName]);
    }
    return Promise.reject(new Error('FILE_NOT_FOUND'));
  }

  saveFile(fileName, blob) {
    return Promise.resolve((this.storage[fileName] = blob));
  }

  getFileWriter(fileName, mimeType) {
    const fakeWriter = FileManager.getFakeFileWriter(mimeType, blob => {
      this.saveFile(fileName, blob);
    });
    return Promise.resolve(fakeWriter);
  }
}

export default MemoryFileStorage;
