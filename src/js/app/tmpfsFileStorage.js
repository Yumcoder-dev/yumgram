/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable no-return-assign */
import Config from './config';
import Defer from './defer';
import { dT } from './helper';
import FileManager from './fileManager';

class TmpfsFileStorage {
  constructor() {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    // let reqFsPromise;
    // let fileSystem;
    this.storageIsAvailable = window.requestFileSystem !== undefined;
    this.requestFS();
  }

  requestFS() {
    if (this.reqFsPromise) {
      return this.reqFsPromise;
    }

    if (!window.requestFileSystem) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return (this.reqFsPromise = Promise.reject({
        type: 'FS_BROWSER_UNSUPPORTED',
        description: 'requestFileSystem not present',
      }));
    }

    const deferred = new Defer();

    window.requestFileSystem(
      window.TEMPORARY,
      500 * 1024 * 1024,
      fs => {
        this.cachedFs = fs;
        deferred.resolve();
      },
      e => {
        this.storageIsAvailable = false;
        deferred.reject(e);
      },
    );

    return (this.reqFsPromise = deferred.promise);
  }

  isAvailable() {
    return Config.Modes.allow_tmpfs && this.storageIsAvailable;
  }

  getFile(fileName, size) {
    // eslint-disable-next-line no-param-reassign
    size = size || 1;
    return this.requestFS().then(() => {
      // console.log(dT(), 'get file', fileName)
      const deferred = new Defer();
      this.cachedFs.root.getFile(
        fileName,
        { create: false },
        fileEntry => {
          fileEntry.file(
            file => {
              // console.log(dT(), 'aa', file)
              if (file.size >= size) {
                deferred.resolve(fileEntry);
              } else {
                deferred.reject(new Error('FILE_NOT_FOUND'));
              }
            },
            error => {
              console.log(dT(), 'error', error);
              deferred.reject(error);
            },
          );
        },
        () => {
          deferred.reject(new Error('FILE_NOT_FOUND'));
        },
      );
      return deferred.promise;
    });
  }

  saveFile(fileName, blob) {
    return this.getFileWriter(fileName).then(fileWriter => {
      return FileManager.fileWriteData(fileWriter, blob).then(() => {
        return fileWriter.finalize();
      });
    });
  }

  getFileWriter(fileName) {
    // console.log(dT(), 'get file writer', fileName)
    return this.requestFS().then(() => {
      const deferred = new Defer();
      this.cachedFs.root.getFile(
        fileName,
        { create: true },
        fileEntry => {
          FileManager.getFileWriter(fileEntry).then(
            fileWriter => {
              // eslint-disable-next-line no-param-reassign
              fileWriter.finalize = () => {
                return fileEntry;
              };
              deferred.resolve(fileWriter);
            },
            error => {
              this.storageIsAvailable = false;
              deferred.reject(error);
            },
          );
        },
        error => {
          this.storageIsAvailable = false;
          deferred.reject(error);
        },
      );

      return deferred.promise;
    });
  }
}

export default TmpfsFileStorage;
