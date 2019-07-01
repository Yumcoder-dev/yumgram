/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Map, List } from 'immutable';
import i18n from '../../locales/i18n';
import { pipe, withLifecycle, withState, withHandlers } from '../../js/core/index';
import { CountryCodes } from './contry.data';
import SearchIndexManager from '../../js/core/searchIndexManager';

const searchIndex = new SearchIndexManager();

const init = (/* porps */) => {
  const countries = [];
  let count = 0;
  const pageSize = 2100;
  // loop on countries and add to full text search
  CountryCodes.forEach((country, index) => {
    const name = i18n.t(country[1]); // get locate country name
    // calc records count and load first data page
    for (let j = 2; j < country.length; j += 1) {
      count += 1;
      if (count <= pageSize) {
        countries.push({ name, code: country[j] }); // load first page
      }
    }
    let searchString = country[0]; // country short code
    searchString += ` ${name}`; // add country name (considering locate)
    searchString += ` ${country.slice(2).join(' ')}`; // add code
    searchIndex.indexObject(index, searchString, searchIndex);
  });

  return new Map({
    filter: '',
    countries: List(countries),
    count,
    loading: false,
  });
};

const componentDidMount = () => {
  document.body.style = 'background: #e7ebf0;';
};

const componentWillUnmount = () => {
  document.body.style = 'background: ;';
};

const onSearch = ({ setData }) => newValue => {
  setData(s => s.set('loading', true));

  let filtered = false;
  let results = {};

  if (typeof newValue === 'string' && newValue.length) {
    filtered = true;
    results = SearchIndexManager.search(newValue);
  }

  const countries = [];

  let j;
  for (let i = 0; i < CountryCodes.length; i += 1) {
    if (!filtered || results[i]) {
      for (j = 2; j < CountryCodes[i].length; j += 1) {
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
      .set('filter', newValue)
      .set('countries', countries)
      .set('loading', false),
  );
};
// const closeSearchCountry = ({ setData }) => () => setData(s => s.set('showSearchCountry', false));

const isItemLoaded = ({ data }) => index => data.get('countries')[index] !== undefined;

const onLoadMoreItems = ({ data }) => (startIndex, stopIndex) => {
  console.log('loadMoreItems', startIndex, stopIndex);
  onSearch(data.get('filter'), startIndex, stopIndex);
};

export default pipe(
  withState(init),
  withHandlers({ onSearch, isItemLoaded, onLoadMoreItems }),
  withLifecycle({
    componentDidMount,
    componentWillUnmount,
  }),
);
