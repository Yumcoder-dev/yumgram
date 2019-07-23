/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-param-reassign */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { blobConstruct, bytesToArrayBuffer, blobSafeMimeType, bytesToBase64 } from './bin';
import Defer from './defer';
import Timeout from './timeout';
import setZeroTimeout from './polyfill';

class FileManager {
  constructor() {
    window.URL = window.URL || window.webkitURL;
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
    this.isSafari = 'safari' in window;
    this.safariVersion = parseFloat(
      this.isSafari && (navigator.userAgent.match(/Version\/(\d+\.\d+).* Safari/) || [])[1],
    );
    this.safariWithDownload = this.isSafari && this.safariVersion >= 11.0;
    this.buggyUnknownBlob = this.isSafari && !this.safariWithDownload;
    this.blobSupported = true;
    try {
      blobConstruct([], '');
    } catch (e) {
      this.blobSupported = false;
    }
  }

  isBlobAvailable() {
    return this.blobSupported;
  }

  fileCopyTo(fromFileEntry, toFileEntry) {
    return this.getFileWriter(toFileEntry).then(fileWriter => {
      return this.fileWriteData(fileWriter, fromFileEntry).then(
        () => {
          return fileWriter;
        },
        error => {
          try {
            fileWriter.truncate(0);
          } catch (e) {}
          return Promise.reject(error);
        },
      );
    });
  }

  static fileWriteData(fileWriter, bytes) {
    const deferred = new Defer();

    fileWriter.onwriteend = () => {
      deferred.resolve();
    };
    fileWriter.onerror = e => {
      deferred.reject(e);
    };

    if (bytes.file) {
      bytes.file(
        file => {
          fileWriter.write(file);
        },
        error => {
          deferred.reject(error);
        },
      );
    } else if (bytes instanceof Blob) {
      // is file bytes
      fileWriter.write(bytes);
    } else {
      try {
        const blob = blobConstruct([bytesToArrayBuffer(bytes)]);
        fileWriter.write(blob);
      } catch (e) {
        deferred.reject(e);
      }
    }

    return deferred.promise;
  }

  static chooseSaveFile(fileName, ext, mimeType) {
    if (!window.chrome || !chrome.fileSystem || !chrome.fileSystem.chooseEntry) {
      return Promise.reject();
    }
    const deferred = new Defer();

    chrome.fileSystem.chooseEntry(
      {
        type: 'saveFile',
        suggestedName: fileName,
        accepts: [
          {
            mimeTypes: [mimeType],
            extensions: [ext],
          },
        ],
      },
      writableFileEntry => {
        deferred.resolve(writableFileEntry);
      },
    );

    return deferred.promise;
  }

  static getFileWriter(fileEntry) {
    const deferred = new Defer();

    fileEntry.createWriter(
      fileWriter => {
        deferred.resolve(fileWriter);
      },
      error => {
        deferred.reject(error);
      },
    );

    return deferred.promise;
  }

  getFakeFileWriter(mimeType, saveFileCallback) {
    let blobParts = [];
    const { blobSupported } = this;
    const fakeFileWriter = {
      write(blob) {
        if (!blobSupported) {
          if (fakeFileWriter.onerror) {
            fakeFileWriter.onerror(new Error('Blob not supported by browser'));
          }
          return;
        }
        blobParts.push(blob);
        setZeroTimeout(() => {
          if (fakeFileWriter.onwriteend) {
            fakeFileWriter.onwriteend();
          }
        });
      },
      truncate() {
        blobParts = [];
      },
      finalize() {
        const blob = blobConstruct(blobParts, mimeType);
        if (saveFileCallback) {
          saveFileCallback(blob);
        }
        return blob;
      },
    };

    return fakeFileWriter;
  }

  static getUrl(fileData, mimeType) {
    const safeMimeType = blobSafeMimeType(mimeType);
    // console.log(dT(), 'get url', fileData, mimeType, fileData.toURL !== undefined, fileData instanceof Blob)
    if (fileData.toURL !== undefined) {
      return fileData.toURL(safeMimeType);
    }
    if (fileData instanceof Blob) {
      return URL.createObjectURL(fileData);
    }
    return `data:${safeMimeType};base64,${bytesToBase64(fileData)}`;
  }

  static getByteArray(fileData) {
    if (fileData instanceof Blob) {
      const deferred = new Defer();
      try {
        const reader = new FileReader();
        reader.onloadend = e => {
          deferred.resolve(new Uint8Array(e.target.result));
        };
        reader.onerror = e => {
          deferred.reject(e);
        };
        reader.readAsArrayBuffer(fileData);

        return deferred.promise;
      } catch (e) {
        return deferred.reject(e);
      }
    } else if (fileData.file) {
      const deferred = new Defer();
      fileData.file(
        blob => {
          FileManager.getByteArray(blob).then(
            result => {
              deferred.resolve(result);
            },
            error => {
              deferred.reject(error);
            },
          );
        },
        error => {
          deferred.reject(error);
        },
      );
      return deferred.promise;
    }
    return Promise.resolve(fileData);
  }

  static getDataUrl(blob) {
    const deferred = new Defer();
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        deferred.resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      return deferred.reject(e);
    }

    return deferred.promise;
  }

  getFileCorrectUrl(blob, mimeType) {
    if (this.buggyUnknownBlob && blob instanceof Blob) {
      const blobMimeType = blob.type || blob.mimeType || mimeType || '';
      if (!blobMimeType.match(/image\/(jpeg|gif|png|bmp)|video\/quicktime/)) {
        return FileManager.getDataUrl(blob);
      }
    }
    return Promise.reject(FileManager.getUrl(blob, mimeType));
  }

  downloadFile(blob, mimeType, fileName) {
    if (window.navigator && navigator.msSaveBlob !== undefined) {
      window.navigator.msSaveBlob(blob, fileName);
      return;
    }

    if (window.navigator && navigator.getDeviceStorage) {
      let storageName = 'sdcard';
      const subdir = 'yumgram/';
      // eslint-disable-next-line default-case
      switch (mimeType.split('/')[0]) {
        case 'video':
          storageName = 'videos';
          break;
        case 'audio':
          storageName = 'music';
          break;
        case 'image':
          storageName = 'pictures';
          break;
      }
      const deviceStorage = navigator.getDeviceStorage(storageName);

      const request = deviceStorage.addNamed(blob, subdir + fileName);

      request.onsuccess = () => {
        console.log('Device storage save result', this.result);
      };
      request.onerror = () => {};
      return;
    }

    let popup = false;
    if (this.isSafari && !this.safariWithDownload) {
      popup = window.open();
    }

    this.getFileCorrectUrl(blob, mimeType).then(url => {
      if (popup) {
        try {
          popup.location.href = url;
          return;
        } catch (e) {}
      }
      const anchor = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      anchor.href = url;
      if (!this.safariWithDownload) {
        anchor.target = '_blank';
      }
      anchor.download = fileName;
      if (anchor.dataset) {
        anchor.dataset.downloadurl = ['video/quicktime', fileName, url].join(':');
      }
      anchor.setAttribute('style', 'position: absolute, top: 1, left: 1');
      document.body.appendChild(anchor);
      try {
        const clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null,
        );
        anchor.dispatchEvent(clickEvent);
      } catch (e) {
        // console.error('Download click error', e);
        try {
          anchor[0].click();
        } catch (e1) {
          window.open(url, '_blank');
        }
      }
      Timeout(() => anchor.parentElement.removeChild(anchor), 100);
    });
  }
}

export default FileManager;
