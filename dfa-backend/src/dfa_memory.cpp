#include "dfa_memory.hpp"
#include "coneccion/json_parser.hpp"
#include <iostream>
#include <fstream>
#include <algorithm>
#include <string>
#include <windows.h>


static std::string almacen[CAPACIDAD_MEMORIA];
static size_t totalDFAs = 0;
static unsigned int contadorId = 0;



static const char* NOMBRE_ARCHIVO = "dfas.json";

static std::string obtenerRutaArchivo() {
    char buffer[MAX_PATH];
    DWORD len = GetModuleFileNameA(NULL, buffer, MAX_PATH);
    std::string ruta = NOMBRE_ARCHIVO;
    if (len > 0 && len < MAX_PATH) {
        ruta = buffer;
        size_t pos = ruta.find_last_of("\\/");
        if (pos != std::string::npos) {
            ruta = ruta.substr(0, pos + 1);
        }
        ruta += NOMBRE_ARCHIVO;
    }
    return ruta;
}

static std::string leerArchivo(const std::string& ruta) {
    std::ifstream archivo(ruta, std::ios::in);
    if (!archivo.is_open()) return "";
    std::string contenido((std::istreambuf_iterator<char>(archivo)),
                          std::istreambuf_iterator<char>());
    archivo.close();
    return contenido;
}

static void escribirArchivo(const std::string& ruta, const std::string& contenido) {
    std::ofstream archivo(ruta, std::ios::out | std::ios::trunc);
    if (!archivo.is_open()) {
        std::cout << "[MEMORIA] ERROR: no se pudo escribir persistencia en " << ruta << std::endl;
        return;
    }
    archivo << contenido;
    archivo.flush();
    archivo.close();
}

static unsigned int numeroDeId(const std::string& id) {
    size_t pos = id.find("dfa-");
    if (pos == std::string::npos) return 0;
    pos += 4;
    unsigned int n = 0;
    while (pos < id.size() && id[pos] >= '0' && id[pos] <= '9') {
        n = n * 10 + static_cast<unsigned int>(id[pos] - '0');
        pos++;
    }
    return n;
}

namespace DFAMemory {

void inicializar() {
    totalDFAs = 0;
    contadorId = 0;

    std::string ruta = obtenerRutaArchivo();
    std::string contenido = leerArchivo(ruta);
    if (contenido.empty()) {
        std::cout << "[MEMORIA] Sin persistencia previa (" << ruta << "). Iniciando vacío." << std::endl;
        return;
    }

    size_t pos = 0;
    unsigned int maxId = 0;
    while (pos < contenido.size()) {
        size_t inicio = contenido.find('{', pos);
        if (inicio == std::string::npos) break;

        int profundidad = 0;
        size_t fin = std::string::npos;
        for (size_t i = inicio; i < contenido.size(); i++) {
            if (contenido[i] == '{') profundidad++;
            else if (contenido[i] == '}') {
                profundidad--;
                if (profundidad == 0) { fin = i; break; }
            }
        }
        if (fin == std::string::npos) break;

        std::string objeto = contenido.substr(inicio, fin - inicio + 1);
        if (totalDFAs < CAPACIDAD_MEMORIA) {
            almacen[totalDFAs++] = objeto;
            std::string id = Json::getString(objeto, "id");
            maxId = std::max(maxId, numeroDeId(id));
        }
        pos = fin + 1;
    }

    contadorId = maxId;
    std::cout << "[MEMORIA] Persistencia cargada: " << totalDFAs
              << " autómata(s) desde " << ruta << std::endl;
}

static void persistir() {
    std::string ruta = obtenerRutaArchivo();
    escribirArchivo(ruta, listarTodos());
    std::cout << "[MEMORIA] Persistido en disco (" << ruta << ")" << std::endl;
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

    //  actualizar dfa existente
    for (size_t i = 0; i < totalDFAs; i++) {
        if (Json::getString(almacen[i], "id") == id) 
        {
            almacen[i] = dfaFinal;
            std::cout << "[MEMORIA] Autómata ACTUALIZADO: id=" << id << " (total=" << totalDFAs << ")" << std::endl;
            persistir();
            return almacen[i];
        }
    }

    // agregar dfa al final del arreglo
    if (totalDFAs >= CAPACIDAD_MEMORIA) {
        std::cout << "[MEMORIA] ERROR: almacenamiento lleno, no se pudo guardar id=" << id << std::endl;
        return Json::error("Almacenamiento lleno.");
    }
    almacen[totalDFAs] = dfaFinal;
    totalDFAs++;
    std::cout << "[MEMORIA] Autómata guardado: id=" << id << " (total=" << totalDFAs << ")" << std::endl;
    persistir();
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
            std::cout << "[MEMORIA] Autómata ELIMINADO: id=" << id << " (total=" << totalDFAs << ")" << std::endl;
            persistir();
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