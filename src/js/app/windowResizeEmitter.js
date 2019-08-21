/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import Storage from './storage';
import Emitter from '../core/emitter';

// exmple usage in a react component:
// import windowResizeEmitter from 'path/windowResizeEmitter'
// useEffect(windowResizeEmitter, []);
export default () => {
  const isClient = typeof window === 'object';
  if (!isClient) {
    return false;
  }
  const getSize = () => {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  };
  const handleResize = () => {
    Emitter.emit('onWindowResize', getSize());
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
};

export const setMobileLayout = mobile => {
  Storage.setNoPrefix();
  Storage.set({
    layout_selected: mobile ? 'mobile' : 'desktop',
    layout_width: window.innerWidth,
  }).then(() => {
    window.location.reload(false);
  });
};
