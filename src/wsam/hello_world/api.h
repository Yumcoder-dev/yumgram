#ifndef FIB
#define FIB

#include <cinttypes>

#ifdef __cplusplus
extern "C"
{
#endif

    typedef struct
    {
        uint8_t a;
        uint32_t b;
        uint32_t c;
    } replyMemFunc;

    int fib(int x);
    uint8_t *arrFunc(uint8_t *input, int count);
    uint8_t *memFunc();

#ifdef __cplusplus
}
#endif
#endif