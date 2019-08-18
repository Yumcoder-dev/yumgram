/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 * 
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

#include "api.h"

int fib(int x)
{
    if (x < 1)
        return 0;
    if (x == 1)
        return 1;
    return fib(x - 1) + fib(x - 2);
}