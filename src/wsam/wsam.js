/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

export const createWebAssembly = async (path, importObject) => {
  if (WebAssembly.instantiateStreaming !== undefined) {
    // if (process.env.NODE_ENV === 'production') {
    const module = await WebAssembly.compileStreaming(fetch(`/assets/wasm/${path}`));
    const res = await WebAssembly.instantiate(module, importObject);
    return Promise.resolve(res.exports);
  }

  const result = await window.fetch(`/assets/wasm/${path}`);
  const bytes = await result.arrayBuffer();
  const res = await WebAssembly.instantiate(bytes, importObject);
  return Promise.resolve(res.instance.exports);
};

export const getImportObject = (memPages = 256) => {
  // A WebAssembly page has a constant size of 65,536 bytes, i.e., 64KiB.
  // memPages = 256 -> 256 *64K = 16mb
  const memory = new WebAssembly.Memory({ initial: memPages, maximum: memPages });

  // const i8Heap = new Uint8Array(memory.buffer);

  const env = {
    abortStackOverflow: () => {
      throw new Error('overflow');
    },
    // __Znam: size => {
    //   console.log(size);
    //   // return i8Heap;
    // },
    // __Znwm: size => {
    //   console.log(size);
    //   // return i8Heap;
    // },
    table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
    __table_base: 0,
    memory,
    __memory_base: 1024,
    STACKTOP: 0,
    STACK_MAX: memory.buffer.byteLength,
  };
  return { env };
};
