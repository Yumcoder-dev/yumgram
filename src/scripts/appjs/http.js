/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

export default function(url, options) {
  // eslint-disable-next-line no-param-reassign
  options = options || {};
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    // "" (default) – get as string,
    // "text" – get as string,
    // "arraybuffer" – get as ArrayBuffer (for binary data, see chapter ArrayBuffer, binary arrays),
    // "blob" – get as Blob (for binary data, see chapter ),
    // "document" – get as XML document (can use XPath and other XML methods),
    // "json" – get as JSON (parsed automatically).
    request.responseType = options.responseType || 'arraybuffer';

    request.open(options.method || 'get', url, true);

    request.onload = () => {
      const ok = (request.status / 100 || 0) === 2; // 200-299
      if (!ok) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ code: request.status, message: request.statusText });
      }
      resolve(request.response);
    };

    // resolve({
    //   ok:
    //   err: { code: request.status, type: request.statusText },
    //   // url: request.responseURL,
    //   response: request.response,
    //   // text: () => Promise.resolve(request.responseText),
    //   // json: () => Promise.resolve(JSON.parse(request.responseText)),
    //   // blob: () => Promise.resolve(new Blob([request.response])),
    //   // clone: response,
    //   headers: {
    //     //  request.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, (m, key, value) => {
    //     //   keys.push((key = key.toLowerCase()));
    //     //   all.push([key, value]);
    //     //   headers[key] = headers[key] ? `${headers[key]},${value}` : value;
    //   },
    // });

    request.onerror = reject;

    request.withCredentials = options.credentials === 'include';

    // request.setRequestHeader('Connection', 'keep-alive');

    // eslint-disable-next-line
    for (const i in options.headers) {
      request.setRequestHeader(i, options.headers[i]);
    }

    request.send(options.body || null);
  });
}
