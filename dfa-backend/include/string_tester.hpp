#pragma once
#include "dfa_model.hpp"
#include <string>

struct ResultadoPrueba {
    bool aceptada;
    std::string traza;
};

class StringTester {
public:
    StringTester();
    ~StringTester();

    ResultadoPrueba evaluarCadena(const DFAModel& dfa, const std::string& entrada);
};
