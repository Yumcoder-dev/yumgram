/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { request } from '../ajax';

it('test ajax request', async () => {
  const result = {
    comments: [
      { body: 'some comment', id: 1, postId: 1 },
      { body: 'some comment', id: 2, postId: 1 }
    ],
    posts: [
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' },
      { id: 3, title: 'Post 3' }
    ],
    profile: { name: 'typicode' }
  };
  const url = 'https://my-json-server.typicode.com/typicode/demo/db';
  await expect(request('Get', url)).resolves.toEqual(result);
}, 6000);
