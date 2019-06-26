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
      <Button onClick={() => increment(2)}>syn</Button>
      <Button onClick={decrement}>asyn</Button>
    </div>
  );
};

CounterComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
};

const CounterContainer = () => (
  <div>
    <CounterComponent prop1="a" />
    <CounterComponent prop1="b" />
  </div>
);

export default CounterContainer;
