/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
const createWebAssembly = async path => {
  const result = await window.fetch(path);
  const bytes = await result.arrayBuffer();
  return WebAssembly.instantiate(bytes);
};

export default createWebAssembly;
