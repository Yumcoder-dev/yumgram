/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 * 
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

#include "./crypto.h"
#include <stdio.h>

uint64_t gcd(uint64_t a, uint64_t b)
{
  while (a != 0 && b != 0)
  {
    while ((b & 1) == 0)
    {
      b >>= 1;
    }
    while ((a & 1) == 0)
    {
      a >>= 1;
    }
    if (a > b)
    {
      a -= b;
    }
    else
    {
      b -= a;
    }
  }
  return b == 0 ? a : b;
}

// b := string([]byte{0x17, 0xED, 0x48, 0x94, 0x1A, 0x08, 0xF9, 0x81}) // "17ED48941A08F981"
// p, q : = Factorize(b)
//              t.Log("p:", p)
//                  t.Log("q:", q)
         // assert.Equal(t, p, "1229739323") // 0X494C553B
         // assert.Equal(t, q, "1402015859") // 0X53911073
         //
int8_t * factorize(int32_t * aBytes, int length)
{
  if (length > 8)
  {
    return nullptr;
  }

  uint64_t what = 0;
  for (int i = 0; i < length; i++)
  {
    what += (uint64_t)aBytes[length - i - 1] << (i * 8);
  }

  int it = 0, i, j;
  uint64_t g = 0;
  for (i = 0; i < 3 || it < 1000; i++)
  {
    int q = ((lrand48() & 15) + 17) % what;
    uint64_t x = (long long)lrand48() % (what - 1) + 1, y = x;
    int lim = 1 << (i + 18), j;
    for (j = 1; j < lim; j++)
    {
      ++it;
      uint64_t a = x, b = x, c = q;
      while (b)
      {
        if (b & 1)
        {
          c += a;
          if (c >= what)
          {
            c -= what;
          }
        }
        a += a;
        if (a >= what)
        {
          a -= what;
        }
        b >>= 1;
      }
      x = c;
      uint64_t z = x < y ? what + x - y : x - y;
      g = gcd(z, what);
      if (g != 1)
      {
        break;
      }
      if (!(j & (j - 1)))
      {
        y = x;
      }
    }
    if (g > 1 && g < what)
    {
      break;
    }
  }
  uint64_t p = what / g;

  uint8_t* result = new uint8_t[16];

  if (p > g)
  {
    uint64_t t = p;
    p = g;
    g = t;
  }

  int index = 0;
  for (int i = 0; i < 8; i++)
  {
    unsigned char byte = p >> ((8 - i - 1) * 8) & 0xFF;
    if (byte > 0 || index > 0)
    {
      result[index] = byte;
      index++;
    }
  }

  for (i = 0; i < 8; i++)
  {
    unsigned char byte = g >> ((8 - i - 1) * 8) & 0xFF;
    if (byte > 0 || index > 0)
    {
      result[index] = byte;
      index++;
    }
  }

  return result;
}