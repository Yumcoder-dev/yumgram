cmake_minimum_required(VERSION 3.12)
project("hello_world" VERSION 0.1.0)

set(CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/../cmake")
include(FindEmscripten)

set(CMAKE_CXX_STANDARD 14)

set(src 
   fib.cc
   #main.cc
   funcs.cc
)

set(exports 
  _fib
  _arrFunc
  _memFunc
)

set(SOME_LIST a b c d)
list(JOIN exports "," exportedFuncs)

set(EXECUTABLE_OUTPUT_PATH ${CMAKE_SOURCE_DIR}/build/bin)
set(LIBRARY_OUTPUT_PATH ${EXECUTABLE_OUTPUT_PATH})

set(CMAKE_C_COMPILER emcc)
set(CMAKE_CXX_COMPILER em++)

# --memory-init-file 0 --llvm-lto 1
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O0  -s ONLY_MY_CODE=1 -s EXPORTED_FUNCTIONS=[${exportedFuncs}] -s WASM=1 -s ENVIRONMENT=web")

add_executable(${PROJECT_NAME}.js ${src})
# add_library(${PROJECT_NAME} SHARED ${src})