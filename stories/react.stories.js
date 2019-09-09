/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable */

import React, { useCallback } from 'react';
import {storiesOf} from '@storybook/react';
import {Button} from '@storybook/react/demo';
import {action} from '@storybook/addon-actions';
import {pipe, withHandlers, withState} from '../src/js/core/index';
import {Map} from 'immutable';

storiesOf ('React', module).add (
  'with some emoji',
  () => (
    <Button onClick={action ('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ),
  {notes: 'A very simple component'}
);
// *************************************************************************************************
const pureComponent = storiesOf ('React/pureComponent', module);
// *************************************************************************************************
const f1 = ({data, setData}) => () => {
  // setData (d => d.set ('b', d.get ('b') + 1));
  setData(d=>{
    console.log ('f1', d.get ('a'), d.get ('b'), data.get('b'));
    return d.set ('b', d.get ('b') + 1);
  })
};
const f2 = ({data, setData}) => () => {
  setData (d => d.set ('a', d.get ('a') + 1));
  console.log ('f1', data.get ('a'), data.get ('b'));
};
const f3 = ({data, setData}) => () => {
   setData (d => d.set ('c', 2));
  console.log ('f1', data.get ('a'), data.get ('b'));
};
const CA = React.memo(props => {
  console.log ('ca');
  return <Button onClick={props.func1}>{props.a}</Button>;
});
const CB = props => {
  console.log ('cb');
  return <Button onClick={props.func2}>{props.b}</Button>;
};
const useControl = pipe (
    withState (() => Map ({a: 10, b: 20})),
    withHandlers ({f1, f2, f3})
  );

function useEventListener(fn) {
  const ref = React.useRef();
  React.useLayoutEffect(() => {
    ref.current = fn;
  });
  return React.useMemo(() => (...args) => (0, ref.current)(...args), []);
}
const CM = props => {
  console.log ('cm');
  const {data, f1, f2, f3} = useControl();
  const memoF1 = useCallback(()=>f1(), []);
  return (
    <div>
      <CA a={data.get ('a')} func1={useEventListener(f1)} />
      <CB b={data.get ('b')} func2={f2} />
      <Button onClick={f3}>cc</Button>
    </div>
  );
};
pureComponent.add ('render call', () => <CM />, {
  notes: 'evaluate render call (data and func change)',
});
