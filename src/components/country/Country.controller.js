/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map, List } from 'immutable';
import i18n from '../../locales/i18n';
import { pipe, withState, withHandlers } from '../../js/core/index';
import { CountryCodes } from './country.data';
import SearchIndexManager from '../../js/core/searchIndexManager';

const searchIndex = new SearchIndexManager();

const init = (/* porps */) => {
  const countries = [];
  let count = 0;
  // loop on countries and add to full text search
  CountryCodes.forEach((country, index) => {
    const name = i18n.t(country[1]); // get locate country name
    // calc records count and load first data page
    for (let j = 2; j < country.length; j += 1) {
      count += 1;
      countries.push({ name, code: country[j] });
    }
    let searchString = country[0]; // country short code
    searchString += ` ${name}`; // add country name (considering locate)
    searchString += ` ${country.slice(2).join(' ')}`; // add code
    searchIndex.indexObject(index, searchString, searchIndex);
  });

  return new Map({
    countries: List(countries),
    count,
    loading: false,
  });
};

const onSearch = ({ setData }) => e => {
  const { value } = e.target;
  setData(s => s.set('loading', true));

  let filtered = false;
  let results = {};

  if (typeof value === 'string' && value.length) {
    filtered = true;
    results = searchIndex.search(value);
  }

  const countries = [];
  let count = 0;
  let j;
  for (let i = 0; i < CountryCodes.length; i += 1) {
    if (!filtered || results[i]) {
      for (j = 2; j < CountryCodes[i].length; j += 1) {
        count += 1;
        countries.push({
          name: i18n.t(`${CountryCodes[i][1]}`),
          code: CountryCodes[i][j],
        });
      }
    }
  }
  if (String.prototype.localeCompare) {
    countries.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  setData(d =>
    d
      .set('countries', List(countries))
      .set('count', count)
      .set('loading', false),
  );
};

export default pipe(
  withState(init),
  withHandlers({ onSearch }),
);
