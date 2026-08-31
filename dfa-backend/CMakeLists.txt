cmake_minimum_required(VERSION 3.14)
project(dfa_backend VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)

# Archivos fuente principales (recursivo para detectar src/coneccion)
file(GLOB_RECURSE SOURCES "src/*.cpp")

# Ejecutable principal
add_executable(dfa_backend main.cpp ${SOURCES})
