# DFA Backend — C++

Backend de un **Autómata Finito Determinista (DFA)** desarrollado en **C++17**.

El sistema permite:

* Crear y guardar DFAs.
* Validar formalmente un DFA.
* Obtener y eliminar DFAs.
* Calcular la **unión de dos DFAs** mediante producto cartesiano.
* Probar cadenas y obtener el recorrido de estados mediante **δ' (delta extendida)**.
* Guardar automáticamente los DFAs en `dfas.json` para conservarlos después de reiniciar el servidor.

El backend expone una **API REST** usando `cpp-httplib` y funciona en el puerto **8000**.

## Estructura

```text
dfa-backend/
├── CMakeLists.txt
├── README.md
├── main.cpp
├── dfas.json
├── iniciar_servidor.bat
├── include/
│   ├── linked_list.hpp
│   ├── dynamic_array.hpp
│   ├── hash_table.hpp
│   ├── graph.hpp
│   ├── dfa_model.hpp
│   ├── validator.hpp
│   ├── union.hpp
│   ├── string_tester.hpp
│   ├── dfa_service.hpp
│   ├── dfa_memory.hpp
│   └── coneccion/
│       ├── httplib.h
│       ├── json_parser.hpp
│       └── routes.hpp
└── src/
    ├── linked_list.cpp
    ├── dynamic_array.cpp
    ├── hash_table.cpp
    ├── graph.cpp
    ├── dfa_model.cpp
    ├── validator.cpp
    ├── union.cpp
    ├── string_tester.cpp
    ├── dfa_service.cpp
    ├── dfa_memory.cpp
    └── coneccion/
        └── routes.cpp
```

## Requisitos

* C++17
* CMake (opcional)
* g++ (si se compila directamente)

## Compilación

### CMake

```bash
mkdir build
cd build
cmake ..
cmake --build .
```

### g++

En Windows:

```bash
g++ -std=c++17 -O2 -Iinclude -DCPPHTTPLIB_NO_EXCEPTIONS -D_WIN32_WINNT=0x0A00 main.cpp src/*.cpp src/coneccion/*.cpp -o dfa_backend.exe -lws2_32
```

También se puede ejecutar:

```bat
iniciar_servidor.bat
```

## Ejecución

Windows:

```bash
.\dfa_backend.exe
```

Linux / macOS:

```bash
./dfa_backend
```

El servidor estará disponible en:

```text
http://localhost:8000
```

## API

Base URL:

```text
http://localhost:8000/api/dfa
```

| Método | Endpoint           | Descripción                   |
| ------ | ------------------ | ----------------------------- |
| GET    | `/dfa/list`        | Lista los DFAs guardados      |
| GET    | `/dfa/{id}`        | Obtiene un DFA                |
| DELETE | `/dfa/{id}`        | Elimina un DFA                |
| POST   | `/dfa/create`      | Crea un DFA                   |
| POST   | `/dfa/validate`    | Valida un DFA                 |
| POST   | `/dfa/union`       | Une dos DFAs                  |
| POST   | `/dfa/test-string` | Prueba una cadena en los DFAs |

## Ejemplo de DFA

```json
{
  "name": "m1",
  "states": ["1", "2", "3"],
  "alphabet": ["a", "b"],
  "initial_state": "1",
  "accepting_states": ["3"],
  "transitions": [
    {"from": "1", "symbol": "a", "to": "2"},
    {"from": "2", "symbol": "b", "to": "3"}
  ]
}
```

## Prueba de cadenas

El endpoint:

```text
POST /dfa/test-string
```

permite simular una cadena y devuelve:

* Si fue aceptada.
* Número de pasos.
* Recorrido de estados.
* Cálculo de **δ'**.

Ejemplo:

```json
{
  "accepted": true,
  "steps": 2,
  "path": [
    {"state": "1", "symbol": null},
    {"state": "2", "symbol": "a"},
    {"state": "3", "symbol": "b"}
  ]
}
```

El primer estado representa:

```text
δ'(q₀, ε) = q₀
```

y los siguientes estados muestran cada símbolo consumido.

## Persistencia

Los DFAs se mantienen en memoria mientras el servidor está funcionando y se guardan automáticamente en:

```text
dfas.json
```

Por lo tanto, los autómatas **se conservan aunque el servidor se reinicie**.
