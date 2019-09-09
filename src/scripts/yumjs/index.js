/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

export { default as pipe } from './pipe';
export { default as withLifecycle } from './withLifecycle';
export { default as withState } from './withState';
// used when handlers do not pass to childs components
// -- avoid changing handler Ref cacuse rerender child components
export { default as withHandlers } from './withHandlers';
export { default as withStateHandlers } from './withStateHandlers';

// for single usage
// -- for more info see https://github.com/facebook/react/issues/14099
export { default as withCacheHandler } from './withCacheHandler';
// All handkers pass to child components
export { default as withCacheHandlers } from './withCacheHandlers';

export { default as emitter } from './emitter';

// inject event bus object in state
export { default as withEmitter } from './withEmitter';

export { default as SearchIndexManager } from './searchIndexManager';
