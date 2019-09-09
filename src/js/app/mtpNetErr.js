/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

export default (url, originalError) => {
  const res = {
    code: 406,
    type: 'NETWORK_BAD_RESPONSE',
    url,
  };
  if (originalError) {
    res.originalError = originalError;
  }
  return res;
};
