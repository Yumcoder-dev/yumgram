/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import * as CSRFManager from './csrfManager';
import encodeFormData from './encodeFormData';

let basePath = '';

export function setBasePath(newBasePath) {
  basePath = newBasePath || '';
  if (basePath.endsWith('/')) {
    basePath = basePath.slice(0, basePath.length - 1);
  }
}

// abortable flag used to pass xhr reference so user can abort accordingly
// see https://javascript.info/fetch-crossorigin
export function request(
  method,
  url,
  body,
  abortable = false,
  withCredentials = true,
  useRequestedWith = true,
) {
  let requestUrl = url;
  if (
    !url.startsWith('http://') &&
    !url.startsWith('https://') &&
    basePath.length &&
    !url.startsWith(`${basePath}/`)
  ) {
    requestUrl = basePath + url;
  }
  const xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    xhr.setRequestHeader('X-CSRF-Token', CSRFManager.getToken());
  }
  if (useRequestedWith) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  }
  /**
   *  If we make a fetch from an arbitrary web-site, that will probably fail.
   *  The core concept here is origin – a domain/port/protocol triplet.
   *  Cross-origin requests – those sent to another domain (even a sub-domain) or protocol or port –
   *  require special headers from the remote side.
   *  That policy is called “CORS”: Cross-Origin Resource Sharing
   *
   *  XMLHttpRequest can make cross-domain requests, using the same CORS policy as fetch.
   *  Just like fetch, it does not send cookies and HTTP-authorization to another origin by default.
   *  To enable them, set xhr.withCredentials to true
   */
  xhr.withCredentials = withCredentials;
  let resolve;
  let reject;
  const p = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  p.resolve = resolve;
  p.reject = reject;
  /*
   * Listen to events for response of XMLHttpRequest:
   *   load – when the result is ready, that includes HTTP errors like 404.
   *   error – when the request couldn’t be made, e.g. network down or invalid URL.
   *   progress – triggers periodically during the download, reports how much downloaded.
   *
   *   xhr.onprogress = function(event) { // triggers periodically
   *     // event.loaded - how many bytes downloaded
   *     // event.lengthComputable = true if the server sent Content-Length header
   *     // event.total - total number of bytes (if lengthComputable)
   *     alert(`Received ${event.loaded} of ${event.total}`);
   *   };
   */
  xhr.onerror = () => {
    p.reject({
      success: false,
      message: 'Network Error',
      error: 'Network Error',
      errors: ['Network Error'],
      notice: 'Network Error',
    });
  };
  // eslint-disable-next-line func-names
  xhr.onload = function() {
    if (this.status === 200) {
      let json = {};
      try {
        json = JSON.parse(this.responseText);
      } catch (ex) {
        p.reject(this.responseText);
        return;
      }
      // eslint-disable-next-line no-prototype-builtins
      if (json.hasOwnProperty('success') && json.success === false) {
        p.reject(json);
      } else {
        p.resolve(json);
      }
    } else if (this.status === 403) {
      p.reject({
        success: false,
        message: 'Permission Denied',
        error: 'Permission Denied',
        errors: ['Permission Denied'],
        notice: 'Permission Denied',
      });
    } else if (this.status >= 400 && this.status < 500) {
      let json = {};
      try {
        json = JSON.parse(this.responseText);
      } catch (ex) {
        p.reject(this.responseText);
        return;
      }
      const message = json.message || json.error || json.notice || 'Request Error';
      p.reject({
        success: false,
        message,
        error: message,
        errors: json.errors || [message],
        notice: message,
      });
    } else if (this.status >= 500) {
      p.reject({
        success: false,
        message: 'Server Error',
        error: 'Server Error',
        errors: ['Server Error'],
        notice: 'Server Error',
      });
    }
  };

  if (typeof body === 'object') {
    if (body instanceof FormData) {
      /*
       *   <form name="person">
       *      <input name="name" value="John">
       *      <input name="surname" value="Smith">
       *    </form>
       *
       *   <script>
       *      // pre-fill FormData from the form
       *      let formData = new FormData(document.forms.person);
       *
       *      // add one more field
       *      formData.append("middle", "Lee");
       *
       *      // send it out
       *      let xhr = new XMLHttpRequest();
       *      xhr.open("POST", "/article/xmlhttprequest/post/user");
       *      xhr.send(formData);
       *
       *    </script>
       * */
      xhr.send(body);
    } else {
      /*
       * Content-Type: application/x-www-form-urlencoded, multipart/form-data or text/plain, etc.
       * */
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      // Encode it as a url parameter string
      const formData = [];
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const k in body) {
        formData.push(encodeFormData(k, body[k]));
      }
      xhr.send(formData.join('&'));
    }
  } else {
    xhr.send(body);
  }
  if (abortable) {
    return {
      xhr,
      promise: p,
    };
  }
  return p;
}

/**
 * abortableGet - get request for requests that may need to be aborted
 * @param  {String} url - get request path
 * @return {Object} {promise, xhr} - promise and xhr reference
 */
export function abortableGet(url) {
  return request('GET', url, null, true);
}

export function get(url) {
  return request('GET', url);
}

export function post(url, body) {
  return request('POST', url, body);
}

export function put(url, body) {
  return request('PUT', url, body);
}

// `delete` is a keyword
export function del(url) {
  return request('DELETE', url);
}
