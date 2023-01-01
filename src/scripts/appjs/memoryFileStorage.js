/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-return-assign */
import FileManager from './fileManager';

export default class MemoryFileStorage {
  storage = {};

  isAvailable() {
    return true;
  }

  async getFile(fileName) {
    if (this.storage[fileName]) {
      return this.storage[fileName];
    }
    throw new Error('FILE_NOT_FOUND');
  }

  async saveFile(fileName, blob) {
    return (this.storage[fileName] = blob);
  }

  async getFileWriter(fileName, mimeType) {
    const save = blob => {
      this.saveFile(fileName, blob);
    };
    const fakeWriter = FileManager.getFakeFileWriter(mimeType, save);
    return fakeWriter;
  }
}



