/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import { pipe, withState, withEmitter, withHandlers } from '../../../../js/core/index';
import {
  // FULLNAME,
  // EVENT_SHOW_PAGE,
  EVENT_AUTH_USER,
  EVENT_ON_STATUS_CHANGED,
  EVENT_ON_SUBMIT,
} from '../../constant';
import onDataValueChanged from '../onDataValueChanged';
import i18n from '../../../../locales/i18n';
import options from '../apiOpt';
import MtpApiManager from '../../../../js/app/mtpApiManager';

const init = () =>
  Map({
    fname: '',
    lname: '',
    incorrectFname: false,
    incorrectLname: false,
  });

const signUp = ({ data, setData, emitter }) => {
  MtpApiManager.invokeApi(
    'auth.signUp',
    {
      phone_number: data.get('phoneCountry') + data.get('phoneNumber'),
      phone_code_hash: data.get('phoneCodeHash'),
      phone_code: data.get('phone_code'),
      first_name: data.get('fname') || '',
      last_name: data.get('lname') || '',
    },
    options,
  )
    .then(result => {
      emitter.emit(EVENT_AUTH_USER, options.id, result.user.id);
    })
    .catch(error => {
      // $scope.progress.enabled = false;
      // if (error.code === 400 && error.type === 'PHONE_NUMBER_OCCUPIED') {
      //   error.handled = true;
      //   return $scope.logIn(false);
      // }

      /* eslint-disable */
      switch (error.type) {
        case 'FIRSTNAME_INVALID':
          // $scope.error = { field: 'first_name' };
          setData(s => s.set('incorrectFname', true));
          error.handled = true;
          break;
        case 'LASTNAME_INVALID':
          setData(s => s.set('incorrectLname', true));
          // $scope.error = { field: 'last_name' };
          error.handled = true;
          break;
        // case 'PHONE_CODE_INVALID':
        //   // $scope.error = { field: 'phone_code' };
        //   // delete $scope.credentials.phone_code_valid;
        //   error.handled = true;
        //   setData(s => s.set('incorrectCode', true));
        //   break;
        // case 'PHONE_CODE_EXPIRED':
        //   // $scope.editPhone();
        //   error.handled = true;
        //   break;
      }
      /* eslint-disable */
    });
};
const onSubmit = (data, setData, emitter) => {
  let fname = false;
  let lname = false;
  if (data.get('fname') === '') {
    fname = true;
  }
  if (data.get('lname') === '') {
    lname = true;
  }
  setData(d => d.set('incorrect_fname', fname).set('incorrect_lname', lname));
  if (fname || lname) {
    return;
  }

  emitter.emit(EVENT_ON_STATUS_CHANGED, i18n.t('login_signing_up'));

  // setTimeout(() => {
  //   emitter.emit(EVENT_ON_STATUS_CHANGED, '');
  //   emitter.emit(EVENT_SHOW_PAGE, FULLNAME);
  // }, 100);
  signUp(data, setData, emitter);
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
