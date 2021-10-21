cmake_minimum_required(VERSION 3.20.5)

add_library (CodeQL
  CodeQL.cpp
)

set_target_properties(CodeQL
  PROPERTIES
    CXX_STANDARD 20
    CXX_STANDARD_REQUIRED ON
    CXX_EXTENSIONS OFF
)