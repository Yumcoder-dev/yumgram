/* eslint-disable no-param-reassign */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import { pipe, withState, withEmitter, withCacheHandlers } from '../../../../js/core/index';
import {
  SENDCODE,
  PASSWORD,
  FULLNAME,
  EVENT_SHOW_PAGE,
  EVENT_AUTH_USER,
  EVENT_ON_STATUS_CHANGED,
  EVENT_ON_SUBMIT,
} from '../../constant';
import onDataValueChanged from '../onDataValueChanged';
import MtpApiManager from '../../../../js/app/mtpApiManager';
import options from '../apiOpt';
import i18n from '../../../../locales/i18n';

const init = ({ phoneCountry, phoneNumber, phoneCountryName, sentCodeResponse }) =>
  Map({
    incorrectCode: false,
    phoneCode: '',
    phoneCountry,
    phoneNumber,
    phoneCountryName,
    sentCodeType: (sentCodeResponse && sentCodeResponse.type && sentCodeResponse.type._) || '',
    nextSentCodeType:
      (sentCodeResponse && sentCodeResponse.next_type && sentCodeResponse.next_type._) || '',
    remaining: (sentCodeResponse && sentCodeResponse.timeout) || 0,
    phoneCodeHash: sentCodeResponse && sentCodeResponse.phone_code_hash,
    nextPendingProgress: false,
  });

const onResendCode = ({ data, setData }) => () => {
  if (data.get('nextSentCodeType') === '' || data.get('remaining') > 0) {
    return;
  }
  setData(d => d.set('nextPendingProgress', true));
  MtpApiManager.invokeApi(
    'auth.resendCode',
    {
      phone_number: data.get('phoneCountry') + data.get('phoneNumber'),
      phone_code_hash: data.get('phone_code_hash'),
    },
    options,
  ).then(sentCodeResponse => {
    setData(d =>
      d
        .set('sentCodeType', sentCodeResponse.type._ || '')
        .set('nextSentCodeType', sentCodeResponse.next_type._ || '')
        .set('remaining', sentCodeResponse.timeout || 0)
        .set('phoneCodeHash', sentCodeResponse.phone_code_hash || '')
        .set('nextPendingProgress', false),
    );
  });
};

const nextPendingTimeout = ({ setData }) => () => {
  setData(d => d.set('remaining', 0));
};

const editPhone = ({ data, emitter }) => () => {
  if (
    data.get('phoneCountry') !== '' &&
    data.get('phoneNumber') !== '' &&
    data.get('phoneCodeHash') !== ''
  ) {
    MtpApiManager.invokeApi(
      'auth.cancelCode',
      {
        phone_number: data.get('phoneCountry') + data.get('phoneNumber'),
        phone_code_hash: data.get('phoneCodeHash'),
      },
      options,
    );
  }

  emitter.emit(EVENT_SHOW_PAGE, SENDCODE, {
    phoneCountry: data.get('phoneCountry'),
    phoneNumber: data.get('phoneNumber'),
    phoneCountryName: data.get('phoneCountryName'),
  });
};

const onSubmit = (data, setData, emitter) => {
  if (data.get('phoneCode') === '') {
    setData(d => d.set('incorrectCode', true));
    return;
  }
  emitter.emit(EVENT_ON_STATUS_CHANGED, i18n.t('login_checking_code'));

  MtpApiManager.invokeApi(
    'auth.signIn',
    {
      phone_number: data.get('phoneCountry') + data.get('phoneNumber'),
      phone_code_hash: data.get('phoneCodeHash'),
      phone_code: data.get('phoneCode'),
    },
    options,
  )
    .then(result => {
      emitter.emit(EVENT_AUTH_USER, options.id, result.user.id);
    })
    .catch(error => {
      // $scope.progress.enabled = false;
      if (error.code === 400 && error.type === 'PHONE_NUMBER_UNOCCUPIED') {
        // auth.signIn method can be used to pre-validate the code entered from
        // the text message. The code was entered correctly if the method returns Error 400 PHONE_NUMBER_UNOCCUPIED.
        error.handled = true;
        // $scope.credentials.phone_code_valid = true;
        // $scope.credentials.phone_unoccupied = true;
        // $scope.about = {};
        emitter.emit(EVENT_ON_STATUS_CHANGED, '');
        emitter.emit(EVENT_SHOW_PAGE, FULLNAME, {
          phoneNumber: data.get('phoneCountry') + data.get('phoneNumber'),
          phoneCodeHash: data.get('phoneCodeHash'),
          phoneCode: data.get('phoneCode'),
        });
        return;
      }
      if (error.code === 401 && error.type === 'SESSION_PASSWORD_NEEDED') {
        // $scope.progress.enabled = true;
        error.handled = true;
        MtpApiManager.invokeApi('account.getPassword', {}, options).then(result => {
          emitter.emit(EVENT_ON_STATUS_CHANGED, '');
          emitter.emit(EVENT_SHOW_PAGE, PASSWORD, {
            // phoneNumber: data.get('phoneCountry') + data.get('phoneNumber'),
            // phoneCodeHash: data.get('phoneCodeHash'),
            // phoneCode: data.get('phoneCode'),
            // account.password#7c18141c current_salt:bytes new_salt:bytes hint:string has_recovery:Bool email_unconfirmed_pattern:string = account.Password;
            accountPassword: result,
          });
        });
        // updatePasswordState().then(() => {
        //   // $scope.progress.enabled = false;
        //   // $scope.credentials.phone_code_valid = true;
        //   // $scope.credentials.password_needed = true;
        //   // $scope.about = {};
        // });
        return;
      }

      // eslint-disable-next-line default-case
      switch (error.type) {
        case 'PHONE_CODE_INVALID':
          // $scope.error = { field: 'phone_code' };
          // delete $scope.credentials.phone_code_valid;
          setData(s => s.set('incorrectCode', true));
          error.handled = true;
          break;
        case 'PHONE_CODE_EXPIRED':
          // $scope.editPhone();
          error.handled = true;
          break;
      }
    });
};

const addListener = ({ data, setData, emitter }) => {
  const subscription = emitter.addListener(EVENT_ON_SUBMIT, () => onSubmit(data, setData, emitter));

  return [subscription];
};

export default pipe(
  withState(init),
  withEmitter(addListener),
  withCacheHandlers({ onDataValueChanged, onResendCode, nextPendingTimeout, editPhone }),
);

// setTimeout(() => {
//   setData(d1 =>
//     d1
//       .set('nextPendingProgress', false)
//       .set('sentCodeType', 'auth.sentCodeTypeSms')
//       .set('nextSentCodeType', 'auth.codeTypeCall')
//       .set('phoneCodeHash', '5448'),
//   );
//   emitter.emit(EVENT_AUTH_USER, options.id, 2);
// }, 1000);
