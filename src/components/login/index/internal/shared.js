/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

// index shared conts and objects
import { showError } from '@components';

export const options = { dcID: 2, createNetworker: true, showError };

export const PAGE_SENDCODE = 0;
export const PAGE_LOGIN = 1;
export const PAGE_PASSWORD = 2;
export const PAGE_FULLNAME = 3;

export const EVENT_ON_STATUS_CHANGED = 'evl.onStatusChanged';
export const EVENT_SHOW_PAGE = 'evl.showPage';
export const EVENT_ON_SUBMIT = 'evl.onSubmit';
export const EVENT_AUTH_USER = 'evl.authUser';

export * from '../../pages/widgets/country/country.data';
