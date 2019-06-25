/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { useMemo } from 'react';
// Note, conditional hook disobeys one of the hook rules because
// it wraps hooks in a condition. For this reason, the condition
// is cached and kept the same regardless of updates.

/**
 * @param {Function} condition
 * @param {Function} left
 * @param {Function} right
 * @returns {Function}
 */
const conditional = (condition, left, right = x => x) => (props = {}) => {
  const conditionResult = useMemo(() => condition(props), [props]);

  return conditionResult ? left(props) : right(props);
};

export default conditional;
