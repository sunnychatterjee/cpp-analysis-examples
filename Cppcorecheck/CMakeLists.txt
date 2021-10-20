cmake_minimum_required(VERSION 3.20.5)
project(CppCoreCheck)

add_library (${PROJECT_NAME}
  CppCoreCheck.cpp
)

set_target_properties(${PROJECT_NAME}
  PROPERTIES
    CXX_STANDARD 20
    CXX_STANDARD_REQUIRED ON
    CXX_EXTENSIONS OFF
)