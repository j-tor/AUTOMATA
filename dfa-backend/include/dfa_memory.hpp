#pragma once
#include <string>
#include <cstddef>



static const size_t CAPACIDAD_MEMORIA = 200;

namespace DFAMemory {

    void inicializar();

    std::string guardar(const std::string& dfaJson);

    std::string listarTodos();

    std::string obtener(const std::string& id);

    bool eliminar(const std::string& id);

    bool existe(const std::string& id);

    std::string generarId();
}