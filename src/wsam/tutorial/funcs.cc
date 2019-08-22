/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 * 
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

#include "api.h"
#include <cstring>

// extern from js
int callJsFuncFromC(int a, int b)
{
    return js_add(a, b);
}
// memory shared memory between c and js
unsigned int *memory = 0;
unsigned int put(unsigned int offset, unsigned int value)
{
    *(memory + offset) = value;
    return *(memory + offset);
}
unsigned int get(unsigned int offset)
{
    return *(memory + offset);
}

uint8_t *memoryH8 = 0;
unsigned int arrFunc(uint8_t *input, int count)
{
    for (int8_t i = 0; i < count; i++)
    {
        *(memoryH8 + count + i) = input[i] << 3;
    }

    return count;
}

uint64_t llui()
{
    uint64_t what = 0;
    for (int i = 0; i < 8; i++)
    {
        what += 255 << (i * 8);
    }
    return what;
}

unsigned int getLong(uint8_t *res)
{
    unsigned long int data = llui();
    for (int i = 0; i < 8; i++)
    {
        unsigned char byte = data >> ((8 - i - 1) * 8) & 0xFF;
        res[i] = byte;
    }

    return 0;
}
