/* eslint-disable no-unused-vars */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map } from 'immutable';
import { pipe, withLifecycle, withState, withHandlers } from '../../js/core/index';
import Config from '../../js/app/config';
import MtpApiManager from '../../js/app/mtpApiManager';
import { LangCountries, CountryCodes } from '../country/country.data';
import i18n from '../../locales/i18n';

const init = (/* porps */) =>
  Map({
    showSearchCountry: false,
    selectedCountry: {},
  });

const selectPhoneCountryByIso2 = (setData, countryIso2) => {
  if (countryIso2) {
    let country;
    for (let i = 0; i < CountryCodes.length; i += 1) {
      country = CountryCodes[i];
      if (country[0] === countryIso2) {
        const name = i18n.t(country[1]);
        // eslint-disable-next-line no-loop-func
        return setData(s => s.set('selectedCountry', { name, code: country[2] }));
      }
    }
  }
  const name = i18n.t('country_select_modal_country_us');
  return setData(s => s.set('selectedCountry', { name, code: '+1' }));
};

const initPhoneCountry = setData => {
  const langCode = (navigator.language || '').toLowerCase();
  const countryIso2 = LangCountries[langCode];
  const shouldPregenerate = !Config.Navigator.mobile;

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
  if (!shouldPregenerate) {
    return;
  }
  setData(d => {
    const wasCountry = d.get('phone_country');
    MtpApiManager.invokeApi(
      'help.getNearestDc',
      {},
      {
        dcID: 2,
        createNetworker: true,
      },
    ).then(nearestDcResult => {
      if (wasCountry === d.get('phone_country')) {
        // if user does not change country
        selectPhoneCountryByIso2(setData, nearestDcResult.country);
      }
      if (nearestDcResult.nearest_dc !== nearestDcResult.this_dc) {
        MtpApiManager.mtpGetNetworker(nearestDcResult.nearest_dc, { createNetworker: true });
      }
    });

    return d;
  });
};

const componentDidMount = ({ setData }) => {
  document.body.style = 'background: #e7ebf0;';
  // initPhoneCountry(setData);
};

const componentWillUnmount = () => {
  document.body.style = 'background: ;';
};

const openSearchContry = ({ setData }) => () => setData(s => s.set('showSearchCountry', true));
const closeSearchCountry = ({ setData }) => () => setData(s => s.set('showSearchCountry', false));
const onChooseCountry = ({ setData }) => selectedItem => {
  setData(s => s.set('selectedCountry', selectedItem).set('showSearchCountry', false));
};

export default pipe(
  withState(init),
  withHandlers({ openSearchContry, closeSearchCountry, onChooseCountry }),
  withLifecycle({ componentDidMount, componentWillUnmount }),
);
