/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import SearchIndexManager from '../searchIndexManager';

it('test clean search text', () => {
  expect(SearchIndexManager.cleanSearchText('yumcoder\\')).toEqual('yumcoder');
  expect(SearchIndexManager.cleanSearchText('yumcoder    ')).toEqual('yumcoder');
  expect(SearchIndexManager.cleanSearchText('yumcoder !')).toEqual('yumcoder');
  expect(SearchIndexManager.cleanSearchText('@**[]]=_;+?{}yumcoder ()\\')).toEqual('yumcoder');
});

it('test full text search', () => {
  const searchIndex = new SearchIndexManager();
  searchIndex.indexObject(1, 'If music be the food of love, play on');
  searchIndex.indexObject(2, 'When shall we three meet again, In thunder, lightning, or in rain?');
  searchIndex.indexObject(
    3,
    'Now is the winter of our discontent, Made glorious summer by this sun of York;',
  );
  const res = searchIndex.search('love');
  expect(res).toEqual({ '1': true });
});
