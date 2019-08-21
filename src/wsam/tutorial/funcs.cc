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
        *(memoryH8 + count + i) = input[i] * 2;
    }

    return count;
}


// malloc
// typedef struct Block
// {
//     unsigned int size;
//     unsigned int usize;
//     struct Block *next;
//     struct Block *prev;
// } Block;

// Block *usedBlocks = 0;
// Block *freeBlocks = 0;
// Block *nextBlock = (Block *)1024; // todo: first block case

// void *malloc(unsigned int size)
// {
//     Block *b = freeBlocks;
//     while (b && b->size < size)
//         b = b->next;

//     if (!b)
//     {
//         b = nextBlock;
//         b->size = size;
//         nextBlock += size + sizeof(Block); // Header + data
//     }

//     b->usize = size;
//     b->next = usedBlocks;
//     if (b->next)
//         b->next->prev = b;
//     b->prev = 0;
//     usedBlocks = b;

//     return (void *)b + sizeof(Block);
// }

// void mfree(void *data)
// {
//     Block *b = data - sizeof(Block);
//     if (b->prev)
//         b->prev->next = b->next;
//     b->next = freeBlocks;
//     if (b->next)
//         b->next->prev = b;
//     b->prev = 0;
//     freeBlocks = b;
// }

// unsigned int msize(void *data)
// {
//     Block *b = data - sizeof(Block);
//     return b->usize;
// }