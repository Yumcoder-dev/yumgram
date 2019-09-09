/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import { pipe, withHandlers, withState } from '../../../../js/core/index';

// #todo convert to object
export const INTRO = 0;
export const LEAR_MORE = 1;

const init = () =>
  Map({
    view: INTRO,
  });

const onClick = ({ setData }) => () => {
  setData(d => d.update('view', v => 1 - v)); // v = !v
};

export default pipe(
  withState(init),
  withHandlers({ onClick }),
);
