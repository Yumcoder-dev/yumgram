/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { dataUrlToBlob } from './bin';
import Defer from './defer';
import WebPDecoder from './vendor/libwebp-0.2.0';

class WebpManager {
  constructor() {
    this.nativeWebpSupport = false;

    const image = new Image();
    image.onload = () => {
      this.nativeWebpSupport = image.width === 2 && image.height === 1;
    };
    image.onerror = () => {
      this.nativeWebpSupport = false;
    };
    image.src =
      'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==';
  }

  getCanvasFromWebp(data) {
    // const start = tsNow();

    const decoder = new WebPDecoder();

    const config = decoder.WebPDecoderConfig;
    const buffer = config.j || config.output;
    const bitstream = config.input;

    if (!decoder.WebPInitDecoderConfig(config)) {
      console.error('[webpjs] Library version mismatch!');
      return false;
    }

    // console.log('[webpjs] status code', decoder.VP8StatusCode)
    const StatusCode = decoder.VP8StatusCode;

    let status = decoder.WebPGetFeatures(data, data.length, bitstream);
    // eslint-disable-next-line eqeqeq
    if (status != (StatusCode.VP8_STATUS_OK || 0)) {
      console.error('[webpjs] status error', status, StatusCode);
    }

    const mode = decoder.WEBP_CSP_MODE;
    buffer.colorspace = mode.MODE_RGBA;
    buffer.J = 4;

    try {
      status = decoder.WebPDecode(data, data.length, config);
    } catch (e) {
      status = e;
    }

    const ok = status === 0;
    if (!ok) {
      console.error('[webpjs] decoding failed', status, StatusCode);
      return false;
    }

    // console.log('[webpjs] decoded: ', buffer.width, buffer.height, bitstream.has_alpha, 'Now saving...')
    const bitmap = buffer.c.RGBA.ma;

    // console.log('[webpjs] done in ', tsNow() - start)

    if (!bitmap) {
      return false;
    }
    const biHeight = buffer.height;
    const biWidth = buffer.width;

    if (!this.canvas || !this.context) {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
    } else {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.canvas.height = biHeight;
    this.canvas.width = biWidth;

    const output = this.context.createImageData(this.canvas.width, this.canvas.height);
    const outputData = output.data;

    for (let h = 0; h < biHeight; h += 1) {
      for (let w = 0; w < biWidth; w += 1) {
        outputData[0 + w * 4 + biWidth * 4 * h] = bitmap[1 + w * 4 + biWidth * 4 * h];
        outputData[1 + w * 4 + biWidth * 4 * h] = bitmap[2 + w * 4 + biWidth * 4 * h];
        outputData[2 + w * 4 + biWidth * 4 * h] = bitmap[3 + w * 4 + biWidth * 4 * h];
        outputData[3 + w * 4 + biWidth * 4 * h] = bitmap[0 + w * 4 + biWidth * 4 * h];
      }
    }

    this.context.putImageData(output, 0, 0);

    return true;
  }

  getPngBlobFromWebp(data) {
    if (!this.getCanvasFromWebp(data)) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ type: 'WEBP_PROCESS_FAILED' });
    }
    if (this.canvas.toBlob === undefined) {
      return Promise.resolve(dataUrlToBlob(this.canvas.toDataURL('image/png')));
    }

    const deferred = new Defer();
    this.canvas.toBlob(blob => {
      deferred.resolve(blob);
    }, 'image/png');
    return deferred.promise;
  }

  isWebpSupported() {
    return this.nativeWebpSupport;
  }
}

export default WebpManager;
