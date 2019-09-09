/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import Login from '../login/index';
import Welcome from '../welcome/Welcome';
import Im from '../im/Im';
import Page404 from '../page404/Page404';
import Pages from './pages';
import Form from '../__test__/Form.test';

export default [
  {
    // name: 'welcome',
    path: Pages.ROOT,
    // icon: 'dashboard',
    component: Welcome,
  },
  {
    // name: 'login',
    path: Pages.LOGIN,
    component: Login,
  },
  {
    // name: 'messager',
    path: Pages.IM,
    component: Im,
  },
  {
    path: '/form',
    component: Form,
  },
  // add new routing here
  {
    // name: 'p404',
    path: Pages.FOF, // four-o-four
    component: Page404,
  },
];
