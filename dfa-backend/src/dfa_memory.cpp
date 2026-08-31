#include "dfa_memory.hpp"
#include "coneccion/json_parser.hpp"


static std::string almacen[CAPACIDAD_MEMORIA];
static size_t totalDFAs = 0;
static unsigned int contadorId = 0;

namespace DFAMemory {

void inicializar() {
    totalDFAs = 0;
    contadorId = 0;
}

std::string generarId() {
    return "dfa-" + std::to_string(++contadorId);
}

std::string guardar(const std::string& dfaJson) {
    // Determinar el id 
    std::string id = Json::getString(dfaJson, "id");
    if (id.empty()) 
    {
        id = generarId();
    }

    // El guardar el id inyectado
    std::string dfaFinal = dfaJson;
    if (Json::getString(dfaJson, "id").empty()) 
    {
        dfaFinal = "{\"id\":\"" + id + "\"," + dfaJson.substr(1);
    }

    // Si  actualizar dfa existente
    for (size_t i = 0; i < totalDFAs; i++) {
        if (Json::getString(almacen[i], "id") == id) 
        {
            almacen[i] = dfaFinal;
            return almacen[i];
        }
    }

    // agregar dfa al final del arreglo
    if (totalDFAs >= CAPACIDAD_MEMORIA) {
        return Json::error("Almacenamiento lleno.");
    }
    almacen[totalDFAs] = dfaFinal;
    totalDFAs++;
    return dfaFinal;
}

std::string listarTodos() {
    std::string resultado = "[";
    for (size_t i = 0; i < totalDFAs; i++) 
    {
        if (i > 0) resultado += ",";
        resultado += almacen[i];
    }
    resultado += "]";
    return resultado;
}

std::string obtener(const std::string& id) {
    for (size_t i = 0; i < totalDFAs; i++) 
    {
        if (Json::getString(almacen[i], "id") == id) 
        {
            return almacen[i];
        }
    }
    return "";
}

bool eliminar(const std::string& id) {
    for (size_t i = 0; i < totalDFAs; i++) {
        if (Json::getString(almacen[i], "id") == id) {
            for (size_t j = i; j < totalDFAs - 1; j++) 
            {
                almacen[j] = almacen[j + 1];
            }
            almacen[totalDFAs - 1] = "";
            totalDFAs--;
            return true;
        }
    }
    return false;
}

bool existe(const std::string& id) {
    for (size_t i = 0; i < totalDFAs; i++) {
        if (Json::getString(almacen[i], "id") == id) return true;
    }
    return false;
}

} 