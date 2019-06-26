# Counter example

counter component:

```javascript
import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import useCounter from './Counter.Controller';

const CounterComponent = props => {
  const { data, increment, decrement } = useCounter(props);
  const { prop1 } = props;

  return (
    <div>
      <h1>
        counter view
        {prop1}
      </h1>
      <p>{data.get('counter')}</p>
      <Button onClick={() => increment(2)}>asyn func with parameters</Button>
      <Button onClick={decrement}>syn func without parameters</Button>
    </div>
  );
};

CounterComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
};
```

the container component:

```javascript
const CounterContainer = () => (
  <div>
    <CounterComponent prop1="a" />
    <CounterComponent prop1="b" />
  </div>
);

export default CounterContainer;
```

controller:

```javascript
/* eslint-disable no-console */
import { Map } from 'immutable';
import { pipe, withState, withHandlers, withLifecycle, withEmitter } from '../../../js/sys/index';

// init func, construct state model and default values
const init = (/* porps */) => Map({ counter: 0 });

// run once at start
const componentDidMount = () => {
  console.log('componentDidMount');
};

// run once at stop
const componentWillUnmount = () => {
  console.log('componentWillUnmount');
};

// run once at update
const componentDidUpdate = props => {
  console.log('componentDidUpdate', props);
};

// simulate async func
// ({ data, /*  prop1, */ emitter }) = { ...state, ...props, emitter }
// note about emitter: increment at withHandlers in pip is after withEmitter
// vlaue is func parameters (increment)
const increment = ({ data, /*  prop1, */ emitter }) => value => {
  setTimeout(() => {
    const upd = data.update('counter', v => v + (value || 1));
    emitter.emit('onEvent', upd);
  }, 1000);
};

// simulate sync func
// for more info about map see immutable-js(https://github.com/immutable-js/immutable-js)
const decrement = ({ setData }) => () => setData(s => s.update('counter', v => v - 1));

const onDataEventChange = (data, setData) => {
  setData(data);
};

const addListener = ({ /* prop1, */ setData, emitter }) => {
  const subscription = emitter.addListener('onEvent', data => onDataEventChange(data, setData));
  //   (previousData) => {
  //   console.log('new ---data', prop1, newData, previousData);
  //   // if (p1 === 'a') {
  //   //   return newData;
  //   // }
  //   // return previousData;
  //   return newData;
  // }));
  // setData(pd => pd.update('evlist', pd.get('evlist').push(subscription)));
  return [subscription];
};

export default pipe(
  // let { data, setData} = state
  withState(init /* , 'data', 'setData' */), // default names for state
  withEmitter({ addListener /* , removeListener */ }),
  withHandlers({ increment, decrement }), // react component functions
  withLifecycle({
    // component lifecycle funcs
    componentDidMount,
    componentWillUnmount,
    componentDidUpdate,
  }),
);
```
