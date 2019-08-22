# 
#  Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
#  
#  This source code is licensed under the license found in the LICENSE file in
#  the root directory of this source tree.
# 

cmake_minimum_required(VERSION 3.12)
project("tutorial" VERSION 0.1.0)

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
  _callJsFuncFromC
  _put
  _get
  _getLong
)

set(SOME_LIST a b c d)
list(JOIN exports "," exportedFuncs)

set(EXECUTABLE_OUTPUT_PATH ${CMAKE_SOURCE_DIR}/build/bin)
set(LIBRARY_OUTPUT_PATH ${EXECUTABLE_OUTPUT_PATH})

set(CMAKE_C_COMPILER emcc)
set(CMAKE_CXX_COMPILER em++)

# --memory-init-file 0 --llvm-lto 1
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O0 -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s ONLY_MY_CODE=1 -s EXPORTED_FUNCTIONS=[${exportedFuncs}] -s WASM=1 -s ENVIRONMENT=web")

add_executable(${PROJECT_NAME}.js ${src})
# add_library(${PROJECT_NAME} SHARED ${src})