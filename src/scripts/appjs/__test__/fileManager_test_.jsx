/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React, { useState } from 'react';
import FileManager from '../fileManager';

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

const FileManagertTestComponent = () => {
  const [writeState, setWriteState] = useState('-');

  const createSimpleBlob = () => new Blob(['hello yumcoder!'], { type: 'text/plain' });
  const isBlobAvailable = () => (FileManager.isBlobAvailable() ? 'true' : 'false');
  const chooseSaveFile = () => {
    FileManager.chooseSaveFile('test_file_manager', 'json', 'Aapplication/json')
      .then(fileWriter => {
        return FileManager.fileWriteData(fileWriter, createSimpleBlob());
      })
      .then(() => {
        setWriteState('write');
      })
      .catch(err => setWriteState(`${err}`));
  };
  const fileWriteData = () => {
    // supported only by chrome. then following code should be run first
    // window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    //
    // see filesystem:http://localhost:3000/temporary/
    window.requestFileSystem(
      window.TEMPORARY,
      1024 * 1024,
      fs => {
        fs.root.getFile(
          'log.txt',
          { create: true },
          fileEntry => {
            FileManager.getFileWriter(fileEntry).then(fileWriter => {
              FileManager.fileWriteData(fileWriter, createSimpleBlob());
            });
          },
          err => setWriteState(`${err}`),
        );
      },
      err => setWriteState(`${err}`),
    );
  };
  const downloadFile = () => {
    FileManager.downloadFile(createSimpleBlob(), 'text/plain', 'fs_test_download_file.txt');
  };

  return (
    <div>
      <p>File Manager component</p>
      <p>
        isBlobAvailable:
        {isBlobAvailable()}
      </p>
      <button type="button" onClick={chooseSaveFile}>
        chooseSaveFile
      </button>
      <button type="button" onClick={fileWriteData}>
        fileWriteData
      </button>
      <button type="button" onClick={downloadFile}>
        downloadFile
      </button>
      <p>
        message:
        {writeState}
      </p>
    </div>
  );
};

export default FileManagertTestComponent;

// it('fake test', () => {});
