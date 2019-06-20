import React from 'react';
import { Link } from 'react-router-dom';

function Messager() {
  return (
    <div>
      <h1>messager</h1>
      <p>
        <Link to="/">GOTO HOME PAGE</Link> other data.
      </p>
    </div>
  );
}

export default Messager;
