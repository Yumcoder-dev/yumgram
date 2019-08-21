#include <stdlib.h>
// #include <cinttypes>

#ifdef __cplusplus
extern "C"
{
#endif
    typedef unsigned long int uint64_t;
    typedef unsigned char uint8_t;
    typedef signed int int32_t;
    typedef unsigned int uint32_t;
    uint64_t getRand(){
        return lrand48();
    }

    int32_t factorize(uint8_t *aBytes, uint32_t length);

#ifdef __cplusplus
}
#endif