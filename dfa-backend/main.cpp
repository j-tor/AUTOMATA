#include "coneccion/routes.hpp"
#include <iostream>

int main() {
    std::cout << "Servidor DFA iniciando en http://localhost:8000 ..." << std::endl;
    Routes::configurar();
    return 0;
}
