/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 * 
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
#include "api.h"
#include <cstring>

uint8_t *arrFunc(uint8_t *input, int count)
{
    //uint8_t *result = new uint8_t[count];
    for (int8_t i = 0; i < count; i++)
    {
        // result[i] = input[i] * 2;
        // std::cout << result[i] << ' ';
        input[i] *= 2;
    }
    
    // return result;
    return input;
}

uint8_t *memFunc()
{
    // replyMemFunc data = replyMemFunc{120, 100, 200};
    // uint8_t *result = new uint8_t[sizeof(replyMemFunc)];
    //memcpy(result, &data, sizeof(data));
    // return result;
    return 0;
}