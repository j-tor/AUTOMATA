# DFA Backend (C++)

Sistema de Autómatas Finitos Deterministas (DFA) construido en C++17 y CMake.

## Estructura del Proyecto

```text
dfa-backend/
├── CMakeLists.txt
├── README.md
├── main.cpp
├── include/
│   ├── linked_list.hpp     # Estructuras manuales
│   ├── dynamic_array.hpp
│   ├── hash_table.hpp
│   ├── graph.hpp
│   ├── dfa_model.hpp       # Núcleo del DFA
│   ├── validator.hpp
│   ├── union.hpp
│   ├── dfa_service.hpp     # Servicios / lógica de negocio
│   ├── string_tester.hpp
│   ├── dfa_memory.hpp      # Almacenamiento en memoria
│   └── coneccion/          # API (httplib), rutas y JSON
├── src/
│   ├── linked_list.cpp
│   ├── dynamic_array.cpp
│   ├── hash_table.cpp
│   ├── graph.cpp
│   ├── dfa_model.cpp
│   ├── validator.cpp
│   ├── union.cpp
│   ├── dfa_service.cpp
│   ├── string_tester.cpp
│   ├── dfa_memory.cpp
│   └── coneccion/
│       └── routes.cpp
```

Se optó por una estructura plana en `include/` y `src/` (sin subcarpetas por
módulo) para mantener el proyecto simple y fácil de navegar. El nombre de
cada archivo ya indica su responsabilidad (estructuras de datos, núcleo DFA,
servicios o API), por lo que no se necesita anidamiento adicional.

## Instrucciones de Compilación

1. Crear un directorio de compilación `build`:
   ```bash
   mkdir build
   cd build
   ```

2. Generar los archivos de compilación con CMake:
   ```bash
   cmake ..
   ```

3. Compilar el proyecto:
   ```bash
   cmake --build .
   ```

## Instrucciones de Ejecución

Ejecutar la aplicación principal:

```bash
./dfa_backend     # En Linux/macOS
.\dfa_backend.exe # En Windows
```
