/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as VList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Row, List, Input } from 'antd';
import countryController from './Country.controller';
import CustomScrollbars from '../scrollbars/Scrollbars';
import styles from './Country.module.less';

const { Search } = Input;

const CountryList = ({ onItemSelected }) => {
  const { data, isItemLoaded, onLoadMoreItems, onSearch } = countryController();
  // const itemCount = data.get('countries').length;

  return (
    <Row style={{ paddingBottom: '8px' }}>
      <div style={{ padding: '12px' }}>
        <Search placeholder="search" onSearch={value => onSearch(value)} />
      </div>
      <Row style={{ height: '50vh' }}>
        {/* <Spin style={{ left: '50%' }} tip="Loading..." spinning={data.get('loading')} /> */}
        <AutoSizer>
          {({ width, height }) => (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={data.get('count')} // 1
              loadMoreItems={onLoadMoreItems}
            >
              {({ onItemsRendered, ref }) => (
                <VList
                  className="List"
                  height={height}
                  itemCount={data.get('count')} // 1
                  itemSize={32}
                  onItemsRendered={onItemsRendered}
                  ref={ref}
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
                </VList>
              )}
            </InfiniteLoader>
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
