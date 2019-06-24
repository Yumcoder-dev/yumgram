import { Map } from 'immutable';
import {
  pipe,
  withState,
  withHandlers,
  lifecycle,
  withEmitter
} from '../../../js/sys/index';

const init = (/* porps */) => Map({ counter: 0 });

export default pipe(
  lifecycle({
    componentDidMount: () => {
      console.log('componentDidMount');
      console.log('subscription');
      // emitter.addListener('event', (eventData) => { console.log('event', eventData); });
    },
    componentWillUnmount: () => {
      console.log('componentWillUnmount');
      // subscription.remove();
    },
    componentDidUpdate: props => {
      console.log('componentDidUpdate', props);
    }
  }),
  withState('data', 'setData', init),
  withEmitter({
    componentDidMount: ({ p1, setData, emitter }) => {
      emitter.addListener('event', data =>
        setData(s => {
          console.log('new ---data', p1, data, s);
          if (p1 === 'a') {
            return data;
          }
          return s;
        })
      );
    },
    componentWillUnmount: ({ data, emitter }) => {
      // subscription.remove();
    }
  }),
  withHandlers({
    increment: ({ data, p1, emitter }) => value => {
      setTimeout(() => {
        const upd = data.update('counter', v => v + (value || 1));
        emitter.emit('event', upd);
      }, 1000);
    },
    decrement: ({ setData }) => () =>
      setData(s => s.update('counter', v => v - 1))
  })
);
