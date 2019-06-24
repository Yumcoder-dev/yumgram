import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import useCounter from './counterHook';

const IncV = props => {
  const { data, increment, decrement } = useCounter(props);
  const { p1 } = props;

  return (
    <div>
      <h1>counter view {p1}</h1>
      <p>{data.get('counter')}</p>
      <Button onClick={() => increment(2)}>syn</Button>
      <Button onClick={decrement}>asyn</Button>
    </div>
  );
};

IncV.propTypes = {
  p1: PropTypes.string.isRequired
};

const Inc = () => (
  <div>
    <IncV p1="a" />
    <IncV p1="b" />
  </div>
);

export default Inc;
