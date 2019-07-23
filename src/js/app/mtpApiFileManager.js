/* eslint-disable no-return-assign */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import Defer from './defer';
import setZeroTimeout from './polyfill';
import Config from './config';

class MtpApiFileManager {
  constructor() {
    this.cachedFs = false;
    this.cachedFsPromise = false;
    this.cachedSavePromises = {};
    this.cachedDownloadPromises = {};
    this.cachedDownloads = {};

    this.downloadPulls = {};
    this.downloadActives = {};
    // this.index = 0;
  }

  downloadRequest(dcID, cb, activeDelta) {
    if (this.downloadPulls[dcID] === undefined) {
      downloadPulls[dcID] = [];
      downloadActives[dcID] = 0;
    }
    const downloadPull = this.downloadPulls[dcID];
    const deferred = new Defer();
    downloadPull.push({ cb, deferred, activeDelta });
    setZeroTimeout(() => this.downloadCheck(dcID));

    return deferred.promise;
  }

  downloadCheck(dcID) {
    const downloadPull = this.downloadPulls[dcID];
    const downloadLimit = dcID === 'upload' ? 11 : 5;

    if (this.downloadActives[dcID] >= downloadLimit || !downloadPull || !this.downloadPull.length) {
      return;
    }

    const data = this.downloadPull.shift();
    const activeDelta = data.activeDelta || 1;

    this.downloadActives[dcID] += activeDelta;
    data.cb().then(
      result => {
        this.downloadActives[dcID] -= activeDelta;
        this.downloadCheck(dcID);

        data.deferred.resolve(result);
      },
      error => {
        this.downloadActives[dcID] -= activeDelta;
        this.downloadCheck(dcID);

        data.deferred.reject(error);
      },
    );
  }

  static getFileName(location) {
    switch (location._) {
      case 'inputDocumentFileLocation':
        var fileName = (location.file_name || '').split('.', 2);
        var ext = fileName[1] || '';
        if (location.sticker && !WebpManager.isWebpSupported()) {
          ext += '.png';
        }
        var versionPart = location.version ? `v${location.version}` : '';
        return `${fileName[0]}_${location.id}${versionPart}.${ext}`;

      default:
        if (!location.volume_id) {
          console.trace('Empty location', location);
        }
        var ext = 'jpg';
        if (location.sticker) {
          ext = WebpManager.isWebpSupported() ? 'webp' : 'png';
        }
        return `${location.volume_id}_${location.local_id}_${location.secret}.${ext}`;
    }
  }

  //   getTempFileName(file) {
  //     const size = file.size || -1;
  //     const random = nextRandomInt(0xffffffff);
  //     return `_temp${random}_${size}`;
  //   }

  getCachedFile(location) {
    if (!location) {
      return false;
    }
    const fileName = this.getFileName(location);

    return this.cachedDownloads[fileName] || false;
  }

  static getFileStorage() {
    if (!Config.Modes.memory_only) {
      if (TmpfsFileStorage.isAvailable()) {
        return TmpfsFileStorage;
      }
      if (IdbFileStorage.isAvailable()) {
        return IdbFileStorage;
      }
    }
    return MemoryFileStorage;
  }

  saveSmallFile(location, bytes) {
    const fileName = this.getFileName(location);
    // const mimeType = 'image/jpeg';

    if (!this.cachedSavePromises[fileName]) {
      this.cachedSavePromises[fileName] = this.getFileStorage()
        .saveFile(fileName, bytes)
        .then(
          blob => {
            this.cachedDownloads[fileName] = blob;
            return this.cachedDownloads[fileName];
          },
          (/* error */) => {
            delete this.cachedSavePromises[fileName];
          },
        );
    }
    return this.cachedSavePromises[fileName];
  }

  downloadSmallFile(location) {
    if (!FileManager.isAvailable()) {
      return Promise.reject({ type: 'BROWSER_BLOB_NOT_SUPPORTED' });
    }
    const fileName = MtpApiFileManager.getFileName(location);
    const mimeType = location.sticker ? 'image/webp' : 'image/jpeg';
    const cachedPromise =
      this.cachedSavePromises[fileName] || this.cachedDownloadPromises[fileName];

    if (cachedPromise) {
      return cachedPromise;
    }

    const fileStorage = MtpApiFileManager.getFileStorage();

    return (this.cachedDownloadPromises[fileName] = fileStorage.getFile(fileName).then(
      blob => {
        return (this.cachedDownloads[fileName] = blob);
      },
      () => {
        const downloadPromise = this.downloadRequest(location.dc_id, () => {
          let inputLocation = location;
          if (!inputLocation._ || inputLocation._ == 'fileLocation') {
            inputLocation = Object.assign({}, location, { _: 'inputFileLocation' });
          }
          // console.log('next small promise')
          return MtpApiManager.invokeApi(
            'upload.getFile',
            {
              location: inputLocation,
              offset: 0,
              limit: 1024 * 1024,
            },
            {
              dcID: location.dc_id,
              fileDownload: true,
              createNetworker: true,
              noErrorBox: true,
            },
          );
        });

        const processDownloaded = bytes => {
          if (!location.sticker || WebpManager.isWebpSupported()) {
            return qSync.when(bytes);
          }
          return WebpManager.getPngBlobFromWebp(bytes);
        };

        return fileStorage.getFileWriter(fileName, mimeType).then(fileWriter => {
          return downloadPromise.then(result => {
            return processDownloaded(result.bytes).then(proccessedResult => {
              return FileManager.write(fileWriter, proccessedResult).then(() => {
                return (this.cachedDownloads[fileName] = fileWriter.finalize());
              });
            });
          });
        });
      },
    ));
  }

  static getDownloadedFile(location, size) {
    const fileStorage = MtpApiFileManager.getFileStorage();
    const fileName = MtpApiFileManager.getFileName(location);

    return fileStorage.getFile(fileName, size);
  }

  downloadFile(dcID, location, size, options) {
    if (!FileManager.isAvailable()) {
      return Promise.reject({ type: 'BROWSER_BLOB_NOT_SUPPORTED' });
    }

    options = options || {};

    let processSticker = false;
    if (location.sticker && !WebpManager.isWebpSupported()) {
      if (options.toFileEntry || size > 524288) {
        delete location.sticker;
      } else {
        processSticker = true;
        options.mime = 'image/png';
      }
    }

    // console.log(dT(), 'Dload file', dcID, location, size)
    const fileName = MtpApiFileManager.getFileName(location);
    const toFileEntry = options.toFileEntry || null;
    const cachedPromise =
      this.cachedSavePromises[fileName] || this.cachedDownloadPromises[fileName];

    const fileStorage = MtpApiFileManager.getFileStorage();

    // console.log(dT(), 'fs', fileStorage.name, fileName, cachedPromise)

    if (cachedPromise) {
      if (toFileEntry) {
        return cachedPromise.then(blob => {
          return FileManager.copy(blob, toFileEntry);
        });
      }
      return cachedPromise;
    }

    const deferred = new Defer();
    let canceled = false;
    let resolved = false;
    const mimeType = options.mime || 'image/jpeg';
    let cacheFileWriter;
    var errorHandler = error => {
      deferred.reject(error);
      errorHandler = angular.noop;
      if (cacheFileWriter && (!error || error.type != 'DOWNLOAD_CANCELED')) {
        cacheFileWriter.truncate(0);
      }
    };

    fileStorage.getFile(fileName, size).then(
      blob => {
        if (toFileEntry) {
          FileManager.copy(blob, toFileEntry).then(() => {
            deferred.resolve();
          }, errorHandler);
        } else {
          deferred.resolve((this.cachedDownloads[fileName] = blob));
        }
      },
      () => {
        const fileWriterPromise = toFileEntry
          ? FileManager.getFileWriter(toFileEntry)
          : fileStorage.getFileWriter(fileName, mimeType);

        const processDownloaded = bytes => {
          if (!processSticker) {
            return qSync.when(bytes);
          }
          return WebpManager.getPngBlobFromWebp(bytes);
        };

        fileWriterPromise.then(fileWriter => {
          cacheFileWriter = fileWriter;
          const limit = 524288;
          let offset;
          let startOffset = 0;
          let writeFilePromise = $q.when();
          let writeFileDeferred;
          if (fileWriter.length) {
            startOffset = fileWriter.length;
            if (startOffset >= size) {
              if (toFileEntry) {
                deferred.resolve();
              } else {
                deferred.resolve((this.cachedDownloads[fileName] = fileWriter.finalize()));
              }
              return;
            }
            fileWriter.seek(startOffset);
            deferred.notify({ done: startOffset, total: size });
          }
          const writerFunc = (isFinal, offset, writeFileDeferred, writeFilePromise) => {
            return this.downloadRequest(
              dcID,
              () => {
                if (canceled) {
                  return $q.when();
                }
                return MtpApiManager.invokeApi(
                  'upload.getFile',
                  {
                    location,
                    offset,
                    limit,
                  },
                  {
                    dcID,
                    fileDownload: true,
                    singleInRequest: window.safari !== undefined,
                    createNetworker: true,
                  },
                );
              },
              2,
            ).then(result => {
              writeFilePromise.then(() => {
                if (canceled) {
                  return $q.when();
                }
                return processDownloaded(result.bytes).then(processedResult => {
                  return FileManager.write(fileWriter, processedResult)
                    .then(() => {
                      writeFileDeferred.resolve();
                    }, errorHandler)
                    .then(() => {
                      if (isFinal) {
                        resolved = true;
                        if (toFileEntry) {
                          deferred.resolve();
                        } else {
                          deferred.resolve(
                            (this.cachedDownloads[fileName] = fileWriter.finalize()),
                          );
                        }
                      } else {
                        deferred.notify({ done: offset + limit, total: size });
                      }
                    });
                });
              });
            });
          };
          for (offset = startOffset; offset < size; offset += limit) {
            writeFileDeferred = new Defer();
            writerFunc(offset + limit >= size, offset, writeFileDeferred, writeFilePromise);
            writeFilePromise = writeFileDeferred.promise;
          }
        });
      },
    );

    deferred.promise.cancel = () => {
      if (!canceled && !resolved) {
        canceled = true;
        delete this.cachedDownloadPromises[fileName];
        errorHandler({ type: 'DOWNLOAD_CANCELED' });
      }
    };

    if (!toFileEntry) {
      this.cachedDownloadPromises[fileName] = deferred.promise;
    }

    return deferred.promise;
  }

  uploadFile(file) {
    const fileSize = file.size;
    const isBigFile = fileSize >= 10485760;
    let canceled = false;
    let resolved = false;
    let doneParts = 0;
    let partSize = 262144; // 256 Kb
    let activeDelta = 2;

    if (fileSize > 67108864) {
      partSize = 524288;
      activeDelta = 4;
    } else if (fileSize < 102400) {
      partSize = 32768;
      activeDelta = 1;
    }
    const totalParts = Math.ceil(fileSize / partSize);

    if (totalParts > 3000) {
      return Promise.reject({ type: 'FILE_TOO_BIG' });
    }

    const fileID = [nextRandomInt(0xffffffff), nextRandomInt(0xffffffff)];
    const deferred = new Defer();
    var errorHandler = error => {
      // console.error('Up Error', error)
      deferred.reject(error);
      canceled = true;
      errorHandler = angular.noop;
    };
    let part = 0;
    let offset;
    const resultInputFile = {
      _: isBigFile ? 'inputFileBig' : 'inputFile',
      id: fileID,
      parts: totalParts,
      name: file.name,
      md5_checksum: '',
    };

    const downloadFunc = (offset, part) => {
      this.downloadRequest(
        'upload',
        () => {
          const uploadDeferred = new Defer();

          const reader = new FileReader();
          const blob = file.slice(offset, offset + partSize);

          reader.onloadend = e => {
            if (canceled) {
              uploadDeferred.reject();
              return;
            }
            if (e.target.readyState != FileReader.DONE) {
              return;
            }
            MtpApiManager.invokeApi(
              isBigFile ? 'upload.saveBigFilePart' : 'upload.saveFilePart',
              {
                file_id: fileID,
                file_part: part,
                file_total_parts: totalParts,
                bytes: e.target.result,
              },
              {
                startMaxLength: partSize + 256,
                fileUpload: true,
                singleInRequest: true,
              },
            ).then(function(result) {
              doneParts++;
              uploadDeferred.resolve();
              if (doneParts >= totalParts) {
                deferred.resolve(resultInputFile);
                resolved = true;
              } else {
                console.log(dT(), 'Progress', (doneParts * partSize) / fileSize);
                deferred.notify({ done: doneParts * partSize, total: fileSize });
              }
            }, errorHandler);
          };

          reader.readAsArrayBuffer(blob);

          return uploadDeferred.promise;
        },
        activeDelta,
      );
    };
    for (offset = 0; offset < fileSize; offset += partSize) {
      downloadFunc(offset, part++);
    }

    deferred.promise.cancel = () => {
      console.log('cancel upload', canceled, resolved);
      if (!canceled && !resolved) {
        canceled = true;
        errorHandler({ type: 'UPLOAD_CANCELED' });
      }
    };

    return deferred.promise;
  }
}
