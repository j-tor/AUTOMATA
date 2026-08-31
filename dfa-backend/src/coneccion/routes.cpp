#include "coneccion/httplib.h"
#include "coneccion/routes.hpp"
#include "dfa_memory.hpp"
#include "dfa_model.hpp"
#include "dfa_service.hpp"
#include "coneccion/json_parser.hpp"
#include <string>
#include <sstream>
#include <iostream>

// ============================================================
// Helpers para construir modelos DFA desde JSON del frontend
// ============================================================

static DFAModel dfaDesdeJson(const std::string& json) {
    DFAModel modelo;

    std::string nombre = Json::getString(json, "name");
    modelo.asignarNombre(nombre);

    // Estados
    std::string arrEstados = Json::getBlock(json, "states");
    std::string estados[256];
    size_t cantEstados = 0;
    Json::getStringArray(arrEstados, estados, cantEstados);
    for (size_t i = 0; i < cantEstados; i++) {
        modelo.agregarEstado(estados[i]);
    }

    // Alfabeto
    std::string arrAlfabeto = Json::getBlock(json, "alphabet");
    std::string simbolos[256];
    size_t cantSimbolos = 0;
    Json::getStringArray(arrAlfabeto, simbolos, cantSimbolos);
    for (size_t i = 0; i < cantSimbolos; i++) {
        if (!simbolos[i].empty()) {
            modelo.agregarSimbolo(simbolos[i][0]);
        }
    }

    // Estado inicial
    std::string estadoInicial = Json::getString(json, "initial_state");
    modelo.asignarEstadoInicial(estadoInicial);

    // Estados de aceptacion
    std::string arrAceptacion = Json::getBlock(json, "accepting_states");
    std::string aceptacion[256];
    size_t cantAceptacion = 0;
    Json::getStringArray(arrAceptacion, aceptacion, cantAceptacion);
    for (size_t i = 0; i < cantAceptacion; i++) {
        modelo.agregarEstadoAceptacion(aceptacion[i]);
    }

    // Transiciones: array de objetos {"from":"q0","symbol":"a","to":"q1"}
    std::string arrTransiciones = Json::getBlock(json, "transitions");
    size_t pos = 0;
    while (pos < arrTransiciones.size()) {
        size_t inicio = arrTransiciones.find('{', pos);
        if (inicio == std::string::npos) break;
        size_t fin = arrTransiciones.find('}', inicio);
        if (fin == std::string::npos) break;

        std::string trans = arrTransiciones.substr(inicio, fin - inicio + 1);
        std::string desde = Json::getString(trans, "from");
        std::string hacia = Json::getString(trans, "to");
        std::string simboloStr = Json::getString(trans, "symbol");

        if (!desde.empty() && !hacia.empty() && !simboloStr.empty()) {
            int idDesde = modelo.obtenerIdEstado(desde);
            if (idDesde != -1) {
                modelo.agregarTransicion(idDesde, hacia, simboloStr[0]);
            }
        }
        pos = fin + 1;
    }

    return modelo;
}

// ============================================================
// Helpers CORS — todas las respuestas necesitan estos headers
// ============================================================

static void setCORS(httplib::Response& res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type");
}

static void respondJson(httplib::Response& res, int status, const std::string& cuerpo) {
    setCORS(res);
    res.set_content(cuerpo, "application/json");
    res.status = status;
}

namespace Routes {

void configurar() {
    DFAMemory::inicializar();

    httplib::Server servidor;

    // --- CORS preflight para todas las rutas ---
    servidor.Options(".*", [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.status = 204;
    });

    // ----------------------------------------------------------------
    // GET /api/dfa/list — Listar todos los DFAs
    // ----------------------------------------------------------------
    servidor.Get("/api/dfa/list", [](const httplib::Request&, httplib::Response& res) {
        std::string lista = DFAMemory::listarTodos();
        std::cout << "[LISTAR DFA] Solicitado por el frontend. Respuesta: " << lista << std::endl;
        respondJson(res, 200, lista);
    });

    // ----------------------------------------------------------------
    // GET /api/dfa/:id — Obtener un DFA por ID
    // ----------------------------------------------------------------
    servidor.Get(R"(/api/dfa/([^/]+))", [](const httplib::Request& req, httplib::Response& res) {
        std::string id = req.matches[1];
        std::string dfa = DFAMemory::obtener(id);
        if (dfa.empty()) {
            respondJson(res, 404, Json::error("Automata no encontrado."));
        } else {
            respondJson(res, 200, dfa);
        }
    });

    // ----------------------------------------------------------------
    // POST /api/dfa/create — Crear o actualizar un DFA
    // ----------------------------------------------------------------
    servidor.Post("/api/dfa/create", [](const httplib::Request& req, httplib::Response& res) {
        const std::string& cuerpo = req.body;
        if (cuerpo.empty()) {
            std::cout << "[CREAR DFA] ERROR: el cuerpo de la peticion llegó vacío." << std::endl;
            respondJson(res, 400, Json::error("Cuerpo vacio."));
            return;
        }
        std::cout << "[CREAR DFA] Recibido del frontend: " << cuerpo << std::endl;
        std::string guardado = DFAMemory::guardar(cuerpo);
        std::cout << "[CREAR DFA] Autómata guardado y devuelto: " << guardado << std::endl;
        respondJson(res, 200, guardado);
    });

    // ----------------------------------------------------------------
    // POST /api/dfa/validate/:id — Validar un DFA
    // ----------------------------------------------------------------
    servidor.Post(R"(/api/dfa/validate/([^/]+))", [](const httplib::Request& req, httplib::Response& res) {
        std::string id = req.matches[1];
        std::string dfaJson = DFAMemory::obtener(id);
        if (dfaJson.empty()) {
            respondJson(res, 404, Json::error("Automata no encontrado."));
            return;
        }

        DFAModel modelo = dfaDesdeJson(dfaJson);
        DFAService servicio;
        ResultadoValidacion resultado = servicio.validarDFA(modelo);

        std::string respuesta = "{";
        respuesta += "\"id\":\"" + Json::escapeString(id) + "\",";
        respuesta += "\"is_valid\":" + std::string(resultado.esValido ? "true" : "false") + ",";
        respuesta += "\"errors\":[";
        if (!resultado.esValido) {
            respuesta += "\"" + Json::escapeString(resultado.mensaje) + "\"";
        }
        respuesta += "]}";

        respondJson(res, 200, respuesta);
    });

    // ----------------------------------------------------------------
    // DELETE /api/dfa/:id — Eliminar un DFA
    // ----------------------------------------------------------------
    servidor.Delete(R"(/api/dfa/([^/]+))", [](const httplib::Request& req, httplib::Response& res) {
        std::string id = req.matches[1];
        if (DFAMemory::eliminar(id)) {
            respondJson(res, 200, Json::ok("Automata eliminado correctamente."));
        } else {
            respondJson(res, 404, Json::error("Automata no encontrado."));
        }
    });

    // ----------------------------------------------------------------
    // POST /api/dfa/union — Union de dos DFAs
    // ----------------------------------------------------------------
    servidor.Post("/api/dfa/union", [](const httplib::Request& req, httplib::Response& res) {
        const std::string& cuerpo = req.body;
        std::string id1 = Json::getString(cuerpo, "dfa1_id");
        std::string id2 = Json::getString(cuerpo, "dfa2_id");

        std::string json1 = DFAMemory::obtener(id1);
        std::string json2 = DFAMemory::obtener(id2);

        if (json1.empty() || json2.empty()) {
            respondJson(res, 404, Json::error("Uno o ambos automatas no existen."));
            return;
        }

        DFAModel modeloA = dfaDesdeJson(json1);
        DFAModel modeloB = dfaDesdeJson(json2);

        DFAService servicio;
        DFAModel unionResultado = servicio.realizarUnion(modeloA, modeloB);

        // Serializar el resultado como JSON para el frontend
        DynamicArray estadosU = unionResultado.obtenerEstados();
        DynamicArray aceptacionU = unionResultado.obtenerEstadosAceptacion();
        std::string alfabetoU = unionResultado.obtenerAlfabeto();

        // Si la union no produjo estados, los alfabetos no son compatibles
        if (estadosU.tamano() == 0 || alfabetoU.empty()) {
            respondJson(res, 400, Json::error(
                "No se puede realizar la union: los alfabetos de los automatas son diferentes."));
            return;
        }

        std::string idUnion = DFAMemory::generarId();
        std::string nombreUnion = Json::escapeString(unionResultado.obtenerNombre());

        // Construir arrays de estados
        std::string arrEstados = "[";
        for (size_t i = 0; i < estadosU.tamano(); i++) {
            if (i > 0) arrEstados += ",";
            std::ostringstream ss;
            ss << "\"(q" << estadosU.en(i) << ")\"";
            arrEstados += ss.str();
        }
        arrEstados += "]";

        // Alfabeto
        std::string arrAlfabeto = "[";
        for (size_t i = 0; i < alfabetoU.length(); i++) {
            if (i > 0) arrAlfabeto += ",";
            arrAlfabeto += "\"";
            arrAlfabeto += alfabetoU[i];
            arrAlfabeto += "\"";
        }
        arrAlfabeto += "]";

        // Estado inicial
        int idInicial = unionResultado.obtenerEstadoInicial();
        std::ostringstream ssInicial;
        ssInicial << idInicial;
        std::string estadoInicialStr = "\"(q" + ssInicial.str() + ")\"";

        // Estados de aceptacion
        std::string arrAceptacion = "[";
        for (size_t i = 0; i < aceptacionU.tamano(); i++) {
            if (i > 0) arrAceptacion += ",";
            std::ostringstream ss;
            ss << "\"(q" << aceptacionU.en(i) << ")\"";
            arrAceptacion += ss.str();
        }
        arrAceptacion += "]";

        // Transiciones: derivar del grafo interno del DFA union
        std::string arrTransiciones = "[";
        bool primeraTransicion = true;
        for (size_t i = 0; i < estadosU.tamano(); i++) {
            int idOrigen = estadosU.en(i);
            for (size_t j = 0; j < alfabetoU.length(); j++) {
                char simboloTrans = alfabetoU[j];
                int idDestino = unionResultado.obtenerTransiciones().obtenerTransicion(idOrigen, simboloTrans);
                if (idDestino == -1) continue;
                if (!primeraTransicion) arrTransiciones += ",";
                primeraTransicion = false;

                std::ostringstream ssOrigen, ssDestino;
                ssOrigen << "(q" << idOrigen << ")";
                ssDestino << "(q" << idDestino << ")";

                arrTransiciones += "{\"from\":\"" + ssOrigen.str() + "\",\"symbol\":\"";
                arrTransiciones += simboloTrans;
                arrTransiciones += "\",\"to\":\"" + ssDestino.str() + "\"}";
            }
        }
        arrTransiciones += "]";

        std::string jsonUnion = "{";
        jsonUnion += "\"id\":\"" + idUnion + "\",";
        jsonUnion += "\"name\":\"" + nombreUnion + "\",";
        jsonUnion += "\"dfa1_id\":\"" + id1 + "\",";
        jsonUnion += "\"dfa2_id\":\"" + id2 + "\",";
        jsonUnion += "\"states\":" + arrEstados + ",";
        jsonUnion += "\"alphabet\":" + arrAlfabeto + ",";
        jsonUnion += "\"initial_state\":" + estadoInicialStr + ",";
        jsonUnion += "\"accepting_states\":" + arrAceptacion + ",";
        jsonUnion += "\"transitions\":" + arrTransiciones + ",";
        jsonUnion += "\"is_valid\":true}";

        DFAMemory::guardar(jsonUnion);
        respondJson(res, 200, jsonUnion);
    });

    // ----------------------------------------------------------------
    // POST /api/dfa/test-string — Probar cadena en uno o mas DFAs
    // ----------------------------------------------------------------
    servidor.Post("/api/dfa/test-string", [](const httplib::Request& req, httplib::Response& res) {
        const std::string& cuerpo = req.body;
        std::string cadena = Json::getString(cuerpo, "string");
        std::string id1 = Json::getString(cuerpo, "dfa1_id");
        std::string id2 = Json::getString(cuerpo, "dfa2_id");
        std::string idUnion = Json::getString(cuerpo, "union_dfa_id");

        DFAService servicio;
        std::string respuesta = "{";
        bool primero = true;

        auto testearDfa = [&](const std::string& clave, const std::string& id) {
            if (id.empty()) return;
            std::string dfaJson = DFAMemory::obtener(id);
            if (dfaJson.empty()) return;

            DFAModel modelo = dfaDesdeJson(dfaJson);
            ResultadoPrueba resultado = servicio.probarCadenaDFA(modelo, cadena);

            // Mapear IDs de estado a nombres: agregarEstado asigna IDs
            // secuenciales 0..n-1 en orden de insercion, por lo que el
            // nombre del estado i es states[i] del JSON original.
            std::string arrEstados = Json::getBlock(dfaJson, "states");
            std::string nombres[256];
            size_t cantNombres = 0;
            Json::getStringArray(arrEstados, nombres, cantNombres);

            if (!primero) respuesta += ",";
            primero = false;

            respuesta += "\"" + clave + "\":{";
            respuesta += "\"accepted\":" + std::string(resultado.aceptada ? "true" : "false") + ",";
            respuesta += "\"trace\":\"" + Json::escapeString(resultado.traza) + "\",";
            respuesta += "\"path\":[";
            for (size_t i = 0; i < resultado.ruta.tamano(); i++) {
                if (i > 0) respuesta += ",";
                int idEst = resultado.ruta.en(i);
                std::string nombreEstado;
                if (idEst >= 0 && static_cast<size_t>(idEst) < cantNombres) {
                    nombreEstado = nombres[idEst];
                } else {
                    nombreEstado = "q" + std::to_string(idEst);
                }
                respuesta += "\"" + Json::escapeString(nombreEstado) + "\"";
            }
            respuesta += "]";
            respuesta += "}";
        };

        testearDfa("dfa1", id1);
        testearDfa("dfa2", id2);
        testearDfa("union", idUnion);

        respuesta += "}";
        respondJson(res, 200, respuesta);
    });

    // ----------------------------------------------------------------
    // Arrancar el servidor
    // ----------------------------------------------------------------
    servidor.listen("0.0.0.0", 8000);
}

// Las funciones del header se mantienen por compatibilidad
std::string manejarCrearDFA(const std::string&) { return ""; }
std::string manejarObtenerDFA(const std::string&) { return ""; }
std::string manejarListarDFAs() { return ""; }
std::string manejarEliminarDFA(const std::string&) { return ""; }
std::string manejarValidarDFA(const std::string&) { return ""; }
std::string manejarUnionDFA(const std::string&) { return ""; }
std::string manejarProbarCadena(const std::string&) { return ""; }

} // namespace Routes
