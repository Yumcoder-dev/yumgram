/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import React from 'react';
import styles from './AppIcon.module.less';

// example: <AppIcon color={color} height={32} width={32}
const AppIconComponent = svg => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width={svg.width}
    height={svg.height}
    style={svg.style}
    className={svg.className}
    viewBox="0 0 620 620"
    enableBackground="new 0 0 620 620"
    xmlSpace="preserve"
  >
    <linearGradient
      id="SVGAPPID_1_"
      gradientUnits="userSpaceOnUse"
      x1="311.1667"
      y1="603.3333"
      x2="311.1667"
      y2="19"
    >
      <stop offset="0" className={styles.color1} />
      <stop offset="1" className={styles.color2} />
    </linearGradient>
    <circle
      fill="url(#SVGAPPID_1_)"
      stroke="#FFFFFF"
      strokeWidth="28"
      strokeMiterlimit="10"
      cx="311.167"
      cy="311.167"
      r="292.167"
    />
    <path
      fill="#C8DAEA"
      d="M220.759,338.848l35.363,97.88c0,0,4.42,9.157,9.157,9.157s75.147-73.252,75.147-73.252l78.304-151.24
	l-196.707,92.197L220.759,338.848z"
    />
    <path
      fill="#A9C6D8"
      d="M267.646,363.949l-6.788,72.147c0,0-2.842,22.102,19.26,0c22.102-22.102,43.257-39.152,43.257-39.152"
    />
    <path
      fill="#FFFFFF"
      d="M221.398,342.34l-72.734-23.7c0,0-8.683-3.526-5.894-11.525c0.575-1.65,1.736-3.052,5.21-5.473
		c16.119-11.234,298.324-112.667,298.324-112.667s7.969-2.683,12.677-0.898c2.152,0.816,3.526,1.737,4.684,5.104
		c0.421,1.225,0.663,3.83,0.631,6.42c-0.023,1.868-0.253,3.599-0.421,6.315c-1.719,27.732-53.145,234.705-53.145,234.705
		s-3.076,12.112-14.103,12.524c-4.02,0.15-8.9-0.664-14.734-5.683c-21.635-18.612-96.42-68.87-112.944-79.924
		c-0.93-0.622-1.197-1.433-1.354-2.222c-0.233-1.165,1.034-2.61,1.034-2.61S398.847,246.957,402.31,234.811
		c0.268-0.941-0.739-1.406-2.105-1c-8.65,3.182-158.58,97.857-175.126,108.312C224.112,342.734,221.398,342.34,221.398,342.34z"
    />
  </svg>
);

export default React.memo(AppIconComponent);
