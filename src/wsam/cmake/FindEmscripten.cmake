# 
#  Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
#  
#  This source code is licensed under the license found in the LICENSE file in
#  the root directory of this source tree.
# 

find_program(EMSCRIPTEN_CPP_BINARY NAMES em++)
mark_as_advanced(EMSCRIPTEN_CPP_BINARY)

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(emscripten
    DEFAULT_MSG
    EMSCRIPTEN_CPP_BINARY)