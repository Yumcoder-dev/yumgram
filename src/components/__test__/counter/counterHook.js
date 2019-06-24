/* eslint-disable no-console */
import { Map } from 'immutable';
import {
  pipe,
  withState,
  withHandlers,
  withLifecycle,
  withEmitter,
} from '../../../js/sys/index';

const init = (/* porps */) => Map({ counter: 0 });

const componentDidMount = () => {
  console.log('componentDidMount');
};

const componentWillUnmount = () => {
  console.log('componentWillUnmount');
};

const componentDidUpdate = (props) => {
  console.log('componentDidUpdate', props);
};

const increment = ({ data, /*  p1, */ emitter }) => (value) => {
  setTimeout(() => {
    const upd = data.update('counter', v => v + (value || 1));
    emitter.emit('onEvent', upd);
  }, 1000);
};

const decrement = ({ setData }) => () => setData(s => s.update('counter', v => v - 1));

const onDataEventChange = (data, setData) => {
  setData(data);
};

const addListener = ({ /* p1, */ setData, emitter }) => {
  const subscription = emitter.addListener('onEvent', data => onDataEventChange(data, setData));
  //   (previousData) => {
  //   console.log('new ---data', p1, newData, previousData);
  //   // if (p1 === 'a') {
  //   //   return newData;
  //   // }
  //   // return previousData;
  //   return newData;
  // }));
  // setData(pd => pd.update('evlist', pd.get('evlist').push(subscription)));
  return [subscription];
};

// const removeListener = () => {
//   // evTokenList.map(v => v.remove());
// };

export default pipe(
  withState(init /* , 'data', 'setData' */),
  withEmitter({ addListener /* , removeListener */ }),
  withHandlers({ increment, decrement }),
  withLifecycle({
    componentDidMount,
    componentWillUnmount,
    componentDidUpdate,
  }),
);
