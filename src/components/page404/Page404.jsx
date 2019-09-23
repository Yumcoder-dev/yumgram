/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import './Page404.module.less';
import noiseController from './Noise.controller';

// see https://ant.design/components/result/
const NoiseCanvas = () => {
  const { data } = noiseController();

  return <canvas ref={data.get('elm')} style={{ width: '100%', height: '100%' }} />;
};

function Page404() {
  return (
    <>
      <NoiseCanvas />
      <div id="display">
        404
        <div id="title">Not Found</div>
      </div>
    </>
  );
}

export default Page404;
