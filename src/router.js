/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import Country from './components/login/Login';
import Messager from './components/messenger/Messenger';
import Page404 from './components/Page404';

const routes = [
  {
    name: 'login',
    path: '/',
    icon: 'dashboard',
    component: Country,
  },
  {
    name: 'messager',
    path: '/im',
    icon: 'dashboard',
    component: Messager,
  },
  {
    name: 'page404',
    icon: 'page404',
    component: Page404,
  },
];

export default routes;
