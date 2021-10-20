cmake_minimum_required(VERSION 3.20.5)
project(CodeQL)

add_library (${PROJECT_NAME}
  CodeQL.cpp
)

set_target_properties(${PROJECT_NAME}
  PROPERTIES
    CXX_STANDARD 20
    CXX_STANDARD_REQUIRED ON
    CXX_EXTENSIONS OFF
)