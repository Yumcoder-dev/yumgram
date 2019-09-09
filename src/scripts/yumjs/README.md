# Simple example

**YumJs** tries to simplify things which are hard to do in react cod, such as simplifying component's async data dependencies and better rendering performance.

Simple scenario of use includes:

- component controller: a module includes component **lifcycle** functions (_`onCreate`_, _`onDestroy`_, _`onUpdate`_) and components handlers/funcs.
- a react component: funcs defined in controller are used in it.

As example:

```javascript
// component controller
const useCount = pipe(
  // state => {count:0}
  // setCount is a func to set count value
  withState(0, 'count', 'setCount'),
  withHandlers({
    // funcs available for compoment
    // func_name = ({...state, ...props}) => (func_parameters) => { func_body},
    increment: ({ count, setCount }) => () => setCount(count + 1),
    decrement: ({ count, setCount }) => () => setCount(count - 1),
  }),
);

// react component
function Counter() {
  const { count, increment } = useCount();

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={increment}>Click me</button>
    </div>
  );
}
```

## Shared state example

In the following example a container with two counter components is shown. Incriment action/handler/func betwwen two components are shared state/data with an [event bus](https://github.com/facebook/emitter).

counter component (Counter.jsx):

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

controller (Counter.Controller.jsx):

```javascript
/* eslint-disable no-console */
import { Map } from 'immutable';
import { pipe, withState, withHandlers, withLifecycle, withEmitter } from 'path-to-yumjs/index';

// init func, construct state model and default values
const init = (/* porps */) => Map({ counter: 0 });

// run once at start
const onCreate = () => {
  console.log('componentDidMount');
};

// run once at stop
const onDestroy = () => {
  console.log('componentWillUnmount');
};

// run once at update
const onUpdate = props => {
  console.log('componentDidUpdate', props);
};

// simulate async func
// ({ data, /*  prop1, */ emitter }) = { ...state, ...props, emitter }
// note about emitter: see pipe func (in the end of the file) increment at withHandlers is after injected emitter (see withEmitter)
// vlaue is func parameter (increment)
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
  return [subscription];
};

export default pipe(
  // let { data, setData} = state
  withState(init /* , 'data', 'setData' */), // default names for state
  withEmitter(addListener),
  withHandlers({ increment, decrement }), // react component functions
  withLifecycle({
    // component lifecycle funcs
    onCreate,
    onDestroy,
    onUpdate,
  }),
);
```

## Docs

_Main Apis to create a controller._

- [`pipe()`](#pipe)
- [`withHandlers()`](#withhandlers)
- [`withState()`](#withstate)
- [`withStateHandlers()`](#withstatehandlers)
- [`withLifecycle()`](#withLifecycle)
- [`withEmitter()`](#withEmitter)
- #todo doc and sample for withCacheHandlers

### `pipe()`

```js
pipe(...functions);
```

[pipe](<https://en.wikipedia.org/wiki/Pipeline_(Unix)>) api `pipeline` funcs. Each input is a function that takes `props` and returns new `props` and chain these together.

### `withHandlers()`

Create handlers in pipeline. Takes an object of handler creators, these are accept a set of props and state in previous pipeline and return a function handler.

Usage example:

```js
const useForm = pipe(
  withState('value', 'updateValue', ''),
  withHandlers({
    onChange: props => event => {
      props.updateValue(event.target.value);
    },
    onSubmit: props => event => {
      event.preventDefault();
      submitForm(props.value);
    },
  }),
);

function Form() {
  const { value, onChange, onSubmit } = useForm();

  return (
    <form onSubmit={onSubmit}>
      <label>
        Value
        <input type="text" value={value} onChange={onChange} />
      </label>
    </form>
  );
}
```

### `withState()`

```js
withState(initialState, stateName, stateUpdaterName);
```

Create state and state updater in pipeline:

- initialState: a value or a func to set initial value of the state.
- stateName: define a object with given name in pipeline.
- stateUpdaterName: define a object updater with given name in pipeline.

An example of usage scenario is as follow:

```js
const addCounting = pipe(
  withState(0, 'counter', 'setCounter'),
  withHandlers({
    increment: ({ setCounter }) => () => setCounter(n => n + 1),
    decrement: ({ setCounter }) => () => setCounter(n => n - 1),
    reset: ({ setCounter }) => () => setCounter(0),
  }),
);
```

### `withStateHandlers()`

```js
withStateHandlers(initialState, { ...handlers });
```

create state object and **immutable** updater functions.

Every state updater function accepts state, props and payload and must return a new state or undefined. The new state is shallowly merged with the previous state.

handler format:

```js
handler: ({...props, ...state}) => (func_payload) => {
  // func body
}
```

Example:

```js
const useCounter = withStateHandlers(
  ({ initialCounter = 0 }) => ({
    counter: initialCounter,
  }),
  {
    incrementOn: ({ counter /* prevValue*/ }) => (value) /* newValue*/ => ({
      counter: counter + value,
    }),
    decrementOn: ({ counter }) => value => ({
      counter: counter - value,
    }),
    resetCounter: (_, { initialCounter = 0 }) => () => ({
      counter: initialCounter,
    }),
  },
);

function Counter() {
  const { counter, incrementOn, decrementOn, resetCounter } = useCounter();

  return (
    <div>
      <Button onClick={() => incrementOn(2)}>Inc</Button>
      <Button onClick={() => decrementOn(3)}>Dec</Button>
      <Button onClick={resetCounter}>Reset</Button>
    </div>
  );
}
```

### `withLifecycle()`

```js
withLifecycle(lifecycle_funcs);
```

Lifecycle supports `onCreate`, `onDestroy`, `onUpdate`.

Any state changes made in a lifecycle method, by using `setState`, will be merged with props.

Example:

```js
const usePosts = lifecycle({
  onCreate({ setData }) {
    fetchPosts().then(newPosts => {
      setData(newPosts);
    });
  },
});

function PostsList() {
  const { posts = [] } = usePosts();

  return (
    <ul>
      {posts.map(p => (
        <li>{p.title}</li>
      ))}
    </ul>
  );
}
```
