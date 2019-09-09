/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { useEffect, useState } from 'react';

export default (date, options = {}) => {
  const { intervalTime = 1000, now = () => Date.now() } = options;
  const [timeLeft, setTimeLeft] = useState(() => new Date(date()) - new Date(now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(current => {
        if (current <= 0) {
          clearInterval(interval);

          return 0;
        }

        return current - intervalTime;
      });
    }, intervalTime);

    return () => clearInterval(interval); // cleanup
  }, [intervalTime]);

  return timeLeft;
};
