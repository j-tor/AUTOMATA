//header routes 
#pragma once

#include <string>

namespace Routes {
    void configurar();
    std::string manejarCrearDFA(const std::string& cuerpo);
    std::string manejarObtenerDFA(const std::string& cuerpo);
    std::string manejarListarDFAs();
    std::string manejarEliminarDFA(const std::string& cuerpo);
    std::string manejarValidarDFA(const std::string& cuerpo);
    std::string manejarUnionDFA(const std::string& cuerpo);
    std::string manejarProbarCadena(const std::string& cuerpo);
}
