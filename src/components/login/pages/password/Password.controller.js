/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import { pipe, withState, withEmitter, withHandlers } from '../../../../js/core/index';
import {
  FULLNAME,
  EVENT_SHOW_PAGE,
  EVENT_AUTH_USER,
  EVENT_ON_STATUS_CHANGED,
  EVENT_ON_SUBMIT,
} from '../../constant';
import onDataValueChanged from '../onDataValueChanged';
import i18n from '../../../../locales/i18n';
import makePasswordHash from '../../../../js/app/passwordManager';
import MtpApiManager from '../../../../js/app/mtpApiManager';
import options from '../apiOpt';

const init = ({ accountPassword }) =>
  Map({
    password: '',
    // account.password#7c18141c current_salt:bytes new_salt:bytes hint:string has_recovery:Bool email_unconfirmed_pattern:string = account.Password;
    accountPassword,
    incorrectPassword: false,
  });

// const forgotPassword = () => () => {
//   MtpApiManager.invokeApi('auth.requestPasswordRecovery', {}, options)
//     .then(emailRecovery => {
//       // const scope = $rootScope.$new();
//       // scope.recovery = emailRecovery;
//       // scope.options = options;
//       // const modal = $modal.open({
//       //   scope,
//       //   templateUrl: templateUrl('password_recovery_modal'),
//       //   controller: 'PasswordRecoveryModalController',
//       //   windowClass: 'md_simple_modal_window mobile_modal',
//       // });
//       // modal.result.then(function(result) {
//       //   if (result && result.user) {
//       //     saveAuth(result);
//       //   } else {
//       //     $scope.canReset = true;
//       //   }
//       // });
//     })
//     .catch(error => {
//       /* eslint-disable */
//       switch (error.type) {
//         case 'PASSWORD_EMPTY':
//           // $scope.logIn();
//           error.handled = true;
//           break;
//         case 'PASSWORD_RECOVERY_NA':
//           // $timeout(function() {
//           //   $scope.canReset = true;
//           // }, 1000);
//           error.handled = true;
//           break;
//       }
//       /* eslint-disable */
//     });

//   return cancelEvent(event);
// };

const onSubmit = (data, setData, emitter) => {
  if (data.get('password') === '') {
    setData(d => d.set('incorrect_password', true));
    return;
  }
  emitter.emit(EVENT_ON_STATUS_CHANGED, i18n.t('login_checking_password'));
  // 1.
  makePasswordHash(data.get('accountPassword').current_salt, data.get('password')).then(
    passwordHash => {
      // 2.
      MtpApiManager.invokeApi(
        'auth.checkPassword',
        {
          password_hash: passwordHash,
        },
        options,
      )
        .then(result => {
          // 3.
          emitter.emit(EVENT_AUTH_USER, options.id, result.user.id);
        })
        .catch(error => {
          // 3.
          emitter.emit(EVENT_ON_STATUS_CHANGED, '');
          /* eslint-disable */
          switch (error.type) {
            case 'PASSWORD_HASH_INVALID':
              setData(d => d.set('incorrectPassword', true));
              error.handled = true;
              break;
          }
          /* eslint-disable */
        });
    },
  );

  setTimeout(() => {
    emitter.emit(EVENT_ON_STATUS_CHANGED, '');
    emitter.emit(EVENT_SHOW_PAGE, FULLNAME);
  }, 100);
};

const addListener = ({ data, setData, emitter }) => {
  const subscription = emitter.addListener(EVENT_ON_SUBMIT, () => onSubmit(data, setData, emitter));

  return [subscription];
};

export default pipe(
  withState(init),
  withHandlers({ onDataValueChanged }),
  withEmitter(addListener),
);
