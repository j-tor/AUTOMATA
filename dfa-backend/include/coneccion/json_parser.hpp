#pragma once
#include <string>

// ============================================================
// Parser y Builder JSON minimal y manual
// Solo soporta el subconjunto que necesita el sistema DFA
// ============================================================

namespace Json {

// Extrae el valor de un campo string:  "campo": "valor"
// Devuelve "" si el campo no existe o su valor no es un string JSON ("...")
inline std::string getString(const std::string& json, const std::string& campo) {
    std::string clave = "\"" + campo + "\"";
    size_t pos = json.find(clave);
    if (pos == std::string::npos) return "";

    pos = json.find(':', pos + clave.size());
    if (pos == std::string::npos) return "";

    // Saltar espacios y blancos entre ':' y el valor
    pos++;
    while (pos < json.size() && (json[pos] == ' ' || json[pos] == '\t')) pos++;

    // El valor debe iniciar con comilla doble para ser un string.
    if (pos >= json.size() || json[pos] != '"') return "";

    size_t inicio = pos + 1;
    size_t fin = json.find('"', inicio);
    while (fin != std::string::npos && json[fin - 1] == '\\') {
        fin = json.find('"', fin + 1);
    }
    if (fin == std::string::npos) return "";

    return json.substr(inicio, fin - inicio);
}

// Extrae el bloque completo (array u objeto) de un campo
inline std::string getBlock(const std::string& json, const std::string& campo) {
    std::string clave = "\"" + campo + "\"";
    size_t pos = json.find(clave);
    if (pos == std::string::npos) return "";

    pos = json.find(':', pos + clave.size());
    if (pos == std::string::npos) return "";

    // Saltar espacios
    while (pos < json.size() && (json[pos] == ':' || json[pos] == ' ')) pos++;

    char apertura = json[pos];
    char cierre = (apertura == '[') ? ']' : '}';
    int profundidad = 0;
    size_t inicio = pos;

    for (size_t i = pos; i < json.size(); i++) {
        if (json[i] == apertura) profundidad++;
        else if (json[i] == cierre) {
            profundidad--;
            if (profundidad == 0) {
                return json.substr(inicio, i - inicio + 1);
            }
        }
    }
    return "";
}

// Extrae todos los strings de un array JSON: ["a","b","c"]
inline void getStringArray(const std::string& arrayJson, std::string resultado[], size_t& cantidad) {
    cantidad = 0;
    size_t pos = 0;
    while (pos < arrayJson.size()) {
        size_t inicio = arrayJson.find('"', pos);
        if (inicio == std::string::npos) break;
        inicio++;
        size_t fin = arrayJson.find('"', inicio);
        if (fin == std::string::npos) break;
        if (cantidad < 256) {
            resultado[cantidad++] = arrayJson.substr(inicio, fin - inicio);
        }
        pos = fin + 1;
    }
}

// Construye un string JSON escapando caracteres especiales
inline std::string escapeString(const std::string& s) {
    std::string resultado;
    for (char c : s) {
        if (c == '"')  resultado += "\\\"";
        else if (c == '\\') resultado += "\\\\";
        else if (c == '\n') resultado += "\\n";
        else if (c == '\r') resultado += "\\r";
        else resultado += c;
    }
    return resultado;
}

// Construye un array JSON desde un arreglo de strings
inline std::string buildStringArray(const std::string arr[], size_t cantidad) {
    std::string resultado = "[";
    for (size_t i = 0; i < cantidad; i++) {
        if (i > 0) resultado += ",";
        resultado += "\"" + escapeString(arr[i]) + "\"";
    }
    resultado += "]";
    return resultado;
}

// Respuesta de error estándar
inline std::string error(const std::string& mensaje) {
    return "{\"error\":\"" + escapeString(mensaje) + "\"}";
}

// Respuesta de éxito simple
inline std::string ok(const std::string& mensaje) {
    return "{\"success\":true,\"message\":\"" + escapeString(mensaje) + "\"}";
}

} // namespace Json
