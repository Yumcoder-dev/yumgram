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

    extern int js_add(int, int);
    int callJsFuncFromC(int a, int b);

    unsigned int put(unsigned int offset, unsigned int value);
    unsigned int get(unsigned int offset);
    int fib(int x);

    unsigned int arrFunc(uint8_t *input, int count);

#ifdef __cplusplus
}
#endif
#endif