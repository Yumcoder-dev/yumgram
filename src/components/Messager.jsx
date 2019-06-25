/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import React from 'react';
import { Link } from 'react-router-dom';

function Messager() {
  return (
    <div>
      <h1>messager</h1>
      <p>
        <Link to="/">GOTO HOME PAGE</Link>
        other data.
      </p>
    </div>
  );
}

export default Messager;
