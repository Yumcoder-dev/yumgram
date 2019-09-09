/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-param-reassign */
import { blobConstruct, bytesToArrayBuffer, blobSafeMimeType, bytesToBase64 } from './bin';
import Defer from './defer';
import Timeout from './timeout';
import { setZeroTimeout } from './polyfill';

export default class FileManager {
  constructor() {
    window.URL = window.URL || window.webkitURL;
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

    const isSafari = 'safari' in window;
    const safariVersion = parseFloat(
      isSafari && (navigator.userAgent.match(/Version\/(\d+\.\d+).* Safari/) || [])[1],
    );
    this.safariWithDownload = isSafari && safariVersion >= 11.0;
    this.buggyUnknownBlob = isSafari && !this.safariWithDownload;
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

  fileWriteData(fileWriter, bytes) {
    const deferred = new Defer();

    fileWriter.onwriteend = () => deferred.resolve();
    fileWriter.onerror = e => deferred.reject(e);

    if (bytes.file) {
      bytes.file(file => fileWriter.write(file), error => deferred.reject(error));
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

  chooseSaveFile(fileName, ext, mimeType) {
    if (!window.chrome || !chrome.fileSystem || !chrome.fileSystem.chooseEntry) {
      return Promise.reject(new Error('unsupported file system'));
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

  getFileWriter(fileEntry) {
    const deferred = new Defer();

    fileEntry.createWriter(
      fileWriter => deferred.resolve(fileWriter),
      error => deferred.reject(error),
    );

    return deferred.promise;
  }

  getFakeFileWriter(mimeType, saveFileCallback) {
    let blobParts = [];
    const fakeFileWriter = {
      write(blob) {
        if (!this.blobSupported) {
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

  getUrl(fileData, mimeType) {
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

  getByteArray(fileData) {
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
        blob =>
          this.getByteArray(blob).then(
            result => deferred.resolve(result),
            error => deferred.reject(error),
          ),
        error => deferred.reject(error),
      );
      return deferred.promise;
    }
    return Promise.resolve(fileData);
  }

  getDataUrl(blob) {
    const deferred = new Defer();
    try {
      const reader = new FileReader();
      reader.onloadend = () => deferred.resolve(reader.result);
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
        return this.getDataUrl(blob);
      }
    }
    return Promise.resolve(this.getUrl(blob, mimeType));
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

      request.onsuccess = (/* result */) => {
        // console.log(`Device storage save result${result}`);
      };
      request.onerror = () => {};
      return;
    }

    let popup = false;
    if (this.buggyUnknownBlob) {
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
      // eslint-disable-next-line no-new
      new Timeout(() => anchor.parentElement.removeChild(anchor), 100);
    });
  }
}
