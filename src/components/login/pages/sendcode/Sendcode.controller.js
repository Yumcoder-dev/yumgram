/* eslint-disable no-unused-vars */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import { confirmPhone } from '@components';
import {
  pipe,
  withLifecycle,
  withState,
  withHandlers,
  withCacheHandlers,
  withEmitter,
} from '@yumjs';
import { config, mtpApiManager, Timeout } from '@appjs';
import {
  langCountries,
  countryCodes,
  options,
  PAGE_LOGIN,
  EVENT_SHOW_PAGE,
  EVENT_ON_STATUS_CHANGED,
  EVENT_ON_SUBMIT,
} from '@login-shared';
import i18n from '@locale';

// Two-way Binding: The recommendation is to explicitly set the value and change handler.
// see: https://reactjs.org/docs/two-way-binding-helpers.html

const init = ({ phoneCountry, phoneNumber, phoneCountryName }) =>
  Map({
    showSearchCountry: false,
    phoneCountryName: phoneCountryName || '',
    phoneCountry: phoneCountry || '',
    phoneNumber: phoneNumber || '',
    err: '',
    focusIndex: phoneNumber !== undefined ? 1 : 0,
    progressEnabled: false,
    setNearestDc: true,
  });

const selectPhoneCountryByIso2 = (setData, countryIso2) => {
  if (countryIso2) {
    for (let i = 0; i < countryCodes.length; i += 1) {
      const country = countryCodes[i];
      if (country[0] === countryIso2) {
        const name = i18n.t(country[1]);
        // eslint-disable-next-line no-loop-func
        setData(s => s.set('phoneCountryName', name).set('phoneCountry', country[2]));
        return;
      }
    }
  }
  const name = i18n.t('country_select_modal_country_us');
  setData(s => s.set('phoneCountryName', name).set('phoneCountry', '+1'));
};

const initPhoneCountry = (data, setData) => {
  const langCode = (navigator.language || '').toLowerCase();
  const countryIso2 = langCountries[langCode];

  if (['en', 'en-us', 'en-uk'].indexOf(langCode) === -1) {
    if (countryIso2 !== undefined) {
      selectPhoneCountryByIso2(setData, countryIso2);
    } else if (langCode.indexOf('-') > 0) {
      selectPhoneCountryByIso2(setData, langCode.split('-')[1].toUpperCase());
    } else {
      selectPhoneCountryByIso2(setData, 'US');
    }
  } else {
    selectPhoneCountryByIso2(setData, 'US');
  }
  if (config.Navigator.mobile) {
    return;
  }

  // const wasCountry = d.get('phoneCountry');
  mtpApiManager.invokeApi('help.getNearestDc', {}, options).then(nearestDcResult => {
    if (data.get('setNearestDc') === true) {
      // if user does not change country
      selectPhoneCountryByIso2(setData, nearestDcResult.country);
      setData(d => d.set('focusIndex', 1));
    }

    if (nearestDcResult.nearest_dc !== nearestDcResult.this_dc) {
      mtpApiManager.mtpGetNetworker(nearestDcResult.nearest_dc, { createNetworker: true });
    }
  });
};

const openContryList = ({ setData }) => () => setData(s => s.set('showSearchCountry', true));

const closeContryList = ({ setData }) => () => setData(s => s.set('showSearchCountry', false));

const onChooseCountry = ({ setData }) => selectedItem => {
  setData(s =>
    s
      .set('phoneCountryName', selectedItem.name)
      .set('phoneCountry', selectedItem.code)
      .set('showSearchCountry', false),
  );
};

const updateCountry = phoneNumber => {
  let maxLength = 0;
  let maxName = false;
  if (phoneNumber.length) {
    for (let i = 0; i < countryCodes.length; i += 1) {
      for (let j = 2; j < countryCodes[i].length; j += 1) {
        const code = countryCodes[i][j].replace(/\D+/g, '');
        if (code.length > maxLength && !phoneNumber.indexOf(code)) {
          maxLength = code.length;
          maxName = i18n.t(`${countryCodes[i][1]}`);
        }
      }
    }
  }
  return maxName || i18n.t('login_controller_unknown_country');
};

const onCodeChanged = ({ data, setData }) => newVal => {
  const phoneCountry = newVal || '';
  const phone = (phoneCountry + (data.get('phoneNumber') || '')).replace(/\D+/g, '');
  setData(s =>
    s
      .set('phoneCountryName', updateCountry(phone))
      .set('phoneCountry', phoneCountry)
      .set('focusIndex', -1)
      .set('setNearestDc', false),
  );
};

const onTelChanged = ({ data, setData }) => newVal => {
  const phoneNumber = newVal || '';
  const phoneCountry = data.get('phoneCountry') || '';
  if (phoneCountry.length === 0 && data.get('phoneCountryName') === '') {
    const phone = (phoneCountry + phoneNumber).replace(/\D+/g, '');
    setData(s =>
      s
        .set('phoneCountryName', updateCountry(phone))
        .set('phoneNumber', phoneNumber)
        .set('focusIndex', -1)
        .set('setNearestDc', false),
    );
    return;
  }
  setData(s =>
    s
      .set('phoneNumber', phoneNumber)
      .set('focusIndex', -1)
      .set('setNearestDc', false),
  );
};

const onSubmit = (data, setData, emitter) => {
  let fullPhone = (data.get('phoneCountry') || '') + (data.get('phoneNumber') || '');
  let badPhone = !fullPhone.match(/^[\d\-+\s]+$/);
  if (!badPhone) {
    fullPhone = fullPhone.replace(/\D/g, '');
    if (fullPhone.length < 7) {
      badPhone = true;
    }
  }
  if (badPhone) {
    setData(d => d.set('err', i18n.t('login_incorrect_number')));
    return;
  }

  setData(d => d.set('err', ''));

  confirmPhone(data.get('phoneCountry'), data.get('phoneNumber'), () => {
    // onOk
    setData(d => d.set('progressEnabled', true)); // show login generating keys info
    emitter.emit(EVENT_ON_STATUS_CHANGED, i18n.t('login_generating_key')); // chnage status bar msg
    mtpApiManager
      .invokeApi(
        'auth.sendCode',
        {
          flags: 0,
          phone_number: data.get('phoneCountry') + data.get('phoneNumber'),
          api_id: config.App.id,
          api_hash: config.App.hash,
          lang_code: navigator.language || 'en',
        },
        options,
      )
      .then(sentCode => {
        // auth.sentCode#38faab5f flags:# phone_registered:flags.0?true type:auth.SentCodeType phone_code_hash:string next_type:flags.1?auth.CodeType timeout:flags.2?int terms_of_service:flags.3?help.TermsOfService = auth.SentCode;
        // ---functions---
        // auth.sendCode#a677244f phone_number:string api_id:int api_hash:string settings:CodeSettings = auth.SentCode;
        // $scope.credentials.type = sentCode.type;
        // $scope.nextPending.type = sentCode.next_type || false;
        // $scope.nextPending.remaining = sentCode.timeout || false;
        emitter.emit(EVENT_SHOW_PAGE, PAGE_LOGIN, {
          /* props object */
          phoneCountry: data.get('phoneCountry'),
          phoneNumber: data.get('phoneNumber'),
          phoneCountryName: data.get('phoneNumber'),
          sentCodeResponse: sentCode,
        });
      })
      .catch(error => {
        setData(d => d.set('progressEnabled', false));
        // eslint-disable-next-line no-console
        console.log('sendCode error', error);
        // eslint-disable-next-line default-case
        switch (error.type) {
          case 'PHONE_NUMBER_INVALID':
            setData(d => d.set('err', i18n.t('login_incorrect_number')));
            break;
          case 'PHONE_NUMBER_APP_SIGNUP_FORBIDDEN':
            setData(d => d.set('err', i18n.t('login_incorrect_app_signup_forbidden')));
            break;
        }
      })
      .finally(() => {
        emitter.emit(EVENT_ON_STATUS_CHANGED, '');
        // if ($rootScope.idle.isIDLE || tsNow() - authKeyStarted > 60000) {
        //   NotificationsManager.notify({
        //     title: 'Telegram',
        //     message: 'Your authorization key was successfully generated! Open the app to log in.',
        //     tag: 'auth_key',
        //   });
        // }
      });
  });
};

const addListener = ({ data, setData, emitter }) => {
  const subscription = emitter.addListener(EVENT_ON_SUBMIT, () => onSubmit(data, setData, emitter));

  return [subscription];
};

const onCreate = ({ data, setData }) => {
  if (data.get('phoneNumber') === '') {
    initPhoneCountry(data, setData);
  }
};

export default pipe(
  withState(init),
  withEmitter(addListener),
  withCacheHandlers({
    openContryList,
    closeContryList,
    onChooseCountry,
    onCodeChanged,
    onTelChanged,
  }),
  withLifecycle({ onCreate }),
);

// setTimeout(() => {
//   emitter.emit(EVENT_ON_STATUS_CHANGED, '');
//   emitter.emit(EVENT_SHOW_PAGE, LOGIN, {
//     /* props object */
//     phoneCountry: data.get('phoneCountry'),
//     phoneNumber: data.get('phoneNumber'),
//     phoneCountryName: data.get('phoneCountryName'),
//     sentCodeResponse: {
//       flags: 3,
//       next_type: { _: 'auth.codeTypeSms' },
//       pFlags: { phone_registered: true },
//       phone_code_hash: 'a175f54fc7a04775a2',
//       type: { _: 'auth.sentCodeTypeApp', length: 5 },
//       timeout: 3000,
//       _: 'auth.sentCode',
//     },
//   });
// }, 100);
