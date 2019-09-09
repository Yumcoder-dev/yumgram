/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

it('play ground - reduce', () => {
  const arr = [1, 2, 3];
  const res = arr.reduce((sum, current) => sum + current, 0);
  expect(res).toBe(6);
});

it('play ground - async', async () => {
  const afunc = i => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (i < 10) {
          resolve(1);
        } else {
          reject(new Error('err'));
        }
      }, 100);
    });
  };

  const funCall1 = await afunc(8).then(
    r => {
      // console.log('r1', r);
      return r;
    },
    e => {
      // console.log('e1', e);
      return e;
    },
  );
  expect(funCall1).toBe(1);

  const funCall2 = await afunc(15).catch(e => {
    // console.log('e2', e);
    return e;
  });
  expect(funCall2).toEqual(new Error('err'));

  const funCall4 = await afunc(40)
    .then(r => {
      // console.log('r4', r);
      return r;
    })
    .catch(e => {
      // console.log('e4', e);
      return e;
    });
  expect(funCall4).toEqual(new Error('err'));
});
