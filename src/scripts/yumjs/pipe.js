/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/**
 *
 * note about arr.reduce and arr.reduceRight
 *      let value = arr.reduce(function(previousValue, item, index, array) {// ...}, initial);
 * They are used to calculate a single value based on the array
 * example:
 *      let arr = [1, 2, 3, 4, 5];
 *      let result = arr.reduce((sum, current) => sum + current, 0);
 *      alert(result); // 15
 * But such use requires an extreme care. If the array is empty, then reduce call without initial
 * value gives an error example:
 *      let arr = [];
 *      // Error: Reduce of empty array with no initial value
 *      // if the initial value existed, reduce would return it for the empty arr.
 *      arr.reduce((sum, current) => sum + current);
 * so props should have default value to avoid error (Reduce of empty array with no initial value)
 */

const pipe = (...fns) => (props = {}) => fns.reduce((v, f) => f(v), props /* initial value */);

export default pipe;
