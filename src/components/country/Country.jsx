/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Row, List, Input } from 'antd';
import countryController from './Country.controller';
import CustomScrollbars from '../scrollbars/Scrollbars';
import styles from './Country.module.less';

const { Search } = Input;

const CountryList = ({ onItemSelected }) => {
  const { data, onSearch } = countryController();

  return (
    <Row style={{ paddingBottom: '8px' }}>
      <div style={{ padding: '12px' }}>
        <Search
          placeholder="search"
          onChange={onSearch}
          allowClear
          ref={input => input && input.focus()}
        />
      </div>
      <Row style={{ height: '50vh' }}>
        <AutoSizer>
          {({ width, height }) => (
            <FixedSizeList
              height={height}
              itemCount={data.get('count')} // 1
              itemSize={32}
              width={width}
              outerElementType={CustomScrollbars}
            >
              {({ index, style }) => {
                const item = data.get('countries').get(index);
                if (item) {
                  return (
                    <List.Item
                      onClick={() => onItemSelected(item)}
                      key={index}
                      style={{
                        ...style,
                        paddingLeft: '26px',
                        paddingRight: '26px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                      }}
                      className={styles.cell}
                    >
                      <List.Item.Meta title={item.name} />
                      <div>{item.code}</div>
                    </List.Item>
                  );
                }
                return <div key={index}> loading... </div>;
              }}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Row>
    </Row>
  );
};

CountryList.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};

export default CountryList;
