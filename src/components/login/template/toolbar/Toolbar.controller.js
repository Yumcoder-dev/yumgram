/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { pipe, withHandlers, withEmitter } from '../../../../js/core/index';

const onNextClick = ({ emitter }) => () => {
  emitter.emit('login.toolbar.onNextClick');
};

export default pipe(
  withEmitter(),
  withHandlers({ onNextClick }),
);
