/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React, { useState } from 'react';
import {
  Layout,
  Drawer,
  Typography,
  Icon,
  Avatar,
  Menu,
  List,
  Input,
  Row,
  Col,
  Badge,
  Card,
} from 'antd';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import ResizeObserver from 'resize-observer-polyfill';
import { List as ListView } from 'react-virtualized';
import i18n from '@locale';
import { CustomScrollbars } from '@components';

const { Header, Content } = Layout;
const { Text, Paragraph } = Typography;
const { Search } = Input;

const ListItem = ({ index, style }) => {
  return (
    <table style={{ ...style, cursor: 'pointer' }}>
      <tr>
        <td
          style={{
            whiteSpace: 'nowrap',
            paddingRight: '8px',
          }}
        >
          <Avatar icon="user" size="large" />
        </td>
        <td
          style={{
            width: '100%',
            maxWidth: 0,
          }}
        >
          <Paragraph style={{ margin: '0' }} strong ellipsis>
            {`${index} Yumcoder yum yum yum yum yum`}
          </Paragraph>
          <Paragraph style={{ margin: '0' }} ellipsis>
            omid jafariaaaaaaaaaaaaaaaaaaaaaaaa
          </Paragraph>
        </td>
        <td
          style={{
            whiteSpace: 'nowrap',
            textAlign: 'center',
            paddingRight: '16px',
          }}
        >
          <Paragraph style={{ margin: '0' }}>Fri 12:8</Paragraph>
          <Badge count={25} />
        </td>
      </tr>
    </table>
  );
};
// #endregion
const ListItem2 = ({ key, index, style, isScrolling }) => {
  return (
    <div style={style} key={key}>
      {/* <Avatar icon="user" size="small" />
      <div>
        <Paragraph style={{ margin: '0' }}>{`${index} Fri 12:8`}</Paragraph>
        <Badge count={25} />
      </div> */}
      <Avatar icon="user" size="small" />
      {index}
      <Badge count={25} />
    </div>
  );
};

const Dialogs = () => {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(!visible);
  };
  // const ref = React.useRef(null);
  // const [height, setHeight] = useState(0);
  // const [width, setWidth] = useState(0);

  // React.useEffect(() => {
  //   const el = ref.current;
  //   if (!el) return;

  //   function handleResize() {
  //     // eslint-disable-next-line no-shadow
  //     const { height, width } = el.getBoundingClientRect();
  //     setHeight(height);
  //     setWidth(width);
  //     console.log('aaaa', height, width);
  //   }

  //   // resize observer is a tool you can use to watch for size changes efficiently
  //   const resizeObserver = new ResizeObserver(handleResize);
  //   resizeObserver.observe(el);

  //   // eslint-disable-next-line consistent-return
  //   return () => resizeObserver.disconnect();
  // }, []); // eslint-disable-line

  React.useEffect(() => {
    console.log('update');
  });

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        // boxSizing: 'border-box',
      }}
    >
      <div>
        <Header>
          <a style={{ display: 'block' }} onClick={onClick}>
            <Avatar icon="menu" size={36} style={{ background: 'transparent', color: 'white' }} />
            <Text strong style={{ color: 'white' }}>
              Button2
            </Text>
          </a>
          <Drawer
            closable={false}
            placement="left"
            onClose={onClick}
            visible={visible}
            style={{ padding: '0px' }}
          >
            <List.Item.Meta
              style={{ marginBottom: '8px' }}
              avatar={<Avatar size={48} icon="user" />}
              title={<Text strong>Yumcoder</Text>}
              description="omid jafari"
            />
            <Menu>
              <Menu.Item key="1">
                <Icon type="mail" />
                Navigation One
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="calendar" />
                Navigation Two
              </Menu.Item>
            </Menu>
          </Drawer>
        </Header>
        <div style={{ padding: '8px' }}>
          <Search placeholder="search" />
        </div>
      </div>
      <div>
        <div style={{ height: '100%', padding: '8px' }}>
          {/* <AutoSizer>
            {({ width, height }) => (
              <FixedSizeList
                height={height}
                itemCount={20}
                itemSize={62}
                width={width}
                outerElementType={CustomScrollbars}
              >
                {({ index, style }) => {
                  return <ListItem index={index} style={style} />;
                }}
              </FixedSizeList>
            )}
          </AutoSizer> */}
          {/* <ListView
            height={300}
            itemCount={20}
            itemSize={48}
            width={250}
            // outerElementType={CustomScrollbars}
          >
            {({ index, style }) => <ListItem2 index={index} style={style} />}
          </ListView> */}
          <ListView
            width={300}
            height={300}
            rowCount={100}
            rowHeight={40}
            rowRenderer={ListItem2}
            overscanRowCount={10}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dialogs);

/* return (
  //#endregion<table
        style={{
          paddingLeft: '8px',
          paddingBottom: '8px',
          background: '#ffff',
          height: '100%',
          width: '100%',
        }}
      >
        <tr>
          <td style={{ padding: '8px', border: '5px solid white', borderColor: '#ff0000' }}>
            <Search placeholder="search" style={{ marginBottom: '8px' }} />
          </td>
        </tr>
        <tr>
          <td
            style={{
              height: '100%',
              border: '1px solid white',
              borderColor: '#ff0000',
            }}
          >
            <div />
          </td>
        </tr>
      </table>
  //#endregion
   <AutoSizer>
                {({ width, height }) => (
                  <FixedSizeList
                    defaultHeight={height}
                    itemCount={10}
                    itemSize={62}
                    defaultWidth={width}
                    outerElementType={CustomScrollbars}
                  >
                    {({ index, style }) => {
                      const item = { name: 'name', code: '100' };
                      return <ListItem index={index} style={style} />;
                    }}
                  </FixedSizeList>
                )}
              </AutoSizer>
                  <Row
                    type="flex"
                    justify="space-around"
                    align="middle"
                    style={{ ...style, paddingRight: '16px' }}
                  >
                    <Avatar icon="user" size="large" />
                    <div
                      style={{
                        overflow: 'hidden',
                        flex: 1,
                        marginLeft: '8px',
                      }}
                    >
                      <Paragraph style={{ margin: '0' }} strong ellipsis>
                        {`${index} Yumcoder yum yum yum yum yum`}
                      </Paragraph>
                      <Paragraph style={{ margin: '0' }} ellipsis>
                        omid jafariaaaaaaaaaaaaaaaaaaaaaaaa
                      </Paragraph>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Paragraph style={{ margin: '0' }}>Fri 12:8</Paragraph>
                      <Badge count={25} />
                    </div>
                  </Row>
                ); */
// <div

//                         style={{
//                           background: 'red',
//                           width: '100%',
//                         }}
//                       >
//                         <div>
//                           <Text strong ellipsis>
//                             Yumcoder
//                           </Text>
//                         </div>
//                         <div>
//                           <Text>San 8:89</Text>
//                         </div>
//                         <br />
//                         <div style={{ flexGrow: '1' }}>
//                           <Text ellipsis>new message long dialogs show new hello messages</Text>
//                         </div>
//                         <div>

//                         </div>
//                       </div>
