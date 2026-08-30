// Header: Lógica de negocio del DFA
#pragma once

#include "dfa_model.hpp"
#include "validator.hpp"
#include "union.hpp"
#include "string_tester.hpp"
#include "dynamic_array.hpp"

class DFAService {
public:
    DFAService();
    ~DFAService();

    DFAModel crearDFA(const std::string& definicion);
    DFAModel obtenerDFA(int id);
    DynamicArray listarDFAs();
    bool eliminarDFA(int id);

    ResultadoValidacion validarDFA(const DFAModel& dfa);
    DFAModel realizarUnion(const DFAModel& a, const DFAModel& b);
    ResultadoPrueba probarCadenaDFA(const DFAModel& dfa, const std::string& entrada);
};
