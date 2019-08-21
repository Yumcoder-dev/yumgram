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
cmake -B $folder
make -C $folder 
cp $folder/bin/crypto.wasm ../../../public/assets/wasm