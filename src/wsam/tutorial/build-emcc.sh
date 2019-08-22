# 
#  Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
#  
#  This source code is licensed under the license found in the LICENSE file in
#  the root directory of this source tree.
# 

# emsdk should be install 
# https://emscripten.org/docs/getting_started/downloads.html
# emsdk is based on node 8, so ENV set only for current build 
source ~/dev/emsdk/emsdk_env.sh

folder='./build'
mkdir -p build/bin

em++ funcs.cc fib.cc -s ONLY_MY_CODE=1 -s EXPORTED_FUNCTIONS='['_fib', '_arrFunc', '_callJsFuncFromC', '_put', '_get', '_getLong']' -s ERROR_ON_UNDEFINED_SYMBOLS=0 -O3 -Wall -o $folder/bin/tutorial.wasm
cp $folder/bin/tutorial.wasm ../../../public/assets/wasm