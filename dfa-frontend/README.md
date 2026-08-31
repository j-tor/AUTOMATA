# DFA Frontend — AUTOMATA

Frontend desarrollado con **React + Vite** para interactuar con el backend C++ del sistema de **Autómatas Finitos Deterministas (DFA)**.

Permite crear, visualizar, unir autómatas y probar cadenas mostrando el recorrido paso a paso mediante **δ' (delta extendida)**.

## Requisitos

* Node.js 20+
* Backend C++ ejecutándose en `http://localhost:8000`

## Instalación y ejecución

```bash
cd dfa-frontend
npm install
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

El frontend utiliza la API del backend:

```text
http://localhost:8000/api/dfa
```

Si el backend utiliza otro host o puerto, se puede modificar la configuración en:

```text
src/services/api.js
```

## Funcionalidades

| Ruta           | Función                                 |
| -------------- | --------------------------------------- |
| `/`            | Página principal                        |
| `/dashboard`   | Lista y administra los DFAs guardados   |
| `/create`      | Crea y valida un DFA                    |
| `/union`       | Calcula la unión de dos DFAs            |
| `/test-string` | Prueba cadenas y muestra δ' paso a paso |

### Crear DFA

Permite definir:

* Estados
* Alfabeto
* Estado inicial
* Estados de aceptación
* Transiciones

El DFA se valida antes de guardarse.

### Unión de autómatas

Calcula:

```text
L(M1) ∪ L(M2)
```

utilizando el **producto cartesiano** de los dos DFAs.

El resultado se guarda como un nuevo autómata.

También es posible realizar la unión de un DFA consigo mismo:

```text
L(M) ∪ L(M) = L(M)
```

### Prueba de cadenas

Permite seleccionar dos DFAs y probar una cadena en:

* DFA 1
* DFA 2
* DFA de unión

Muestra el recorrido de estados mediante **δ'**.

Ejemplo:

```text
δ'(1, ε) = 1
δ(1, 'a') = 2
δ(2, 'b') = 3

Resultado: Cadena RECHAZADA
```

La simulación incluye:

* Play / Pause
* Reset
* Slider de pasos
* Resaltado de estados
* Recorrido de la cadena

## Persistencia

Los DFAs creados desde el frontend se guardan en el backend y se almacenan en:

```text
dfa-backend/dfas.json
```

Por lo tanto, los autómatas permanecen disponibles después de recargar la aplicación o reiniciar el servidor.

## Estructura principal

```text
dfa-frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.js
│   └── utils/
│       ├── dfa-engine.js
│       ├── validators.js
│       └── formatters.js
├── package.json
└── vite.config.js
```

## Tecnologías

* React 18
* Vite
* Tailwind CSS
* Axios
* Lucide React
* Mermaid.js

## Scripts

```bash
npm run dev       # Desarrollo
npm run build     # Generar versión de producción
npm run preview   # Previsualizar producción
npx oxlint src/   # Revisar código
```

## Arquitectura

```text
┌──────────────────────┐
│   React + Vite       │
│   localhost:5173     │
└──────────┬───────────┘
           │ REST API
           ▼
┌──────────────────────┐
│   DFA Backend C++    │
│   localhost:8000     │
└──────────┬───────────┘
           │
           ▼
      ┌──────────┐
      │ dfas.json│
      └──────────┘
```
