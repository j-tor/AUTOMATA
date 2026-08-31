#include "dfa_service.hpp"

DFAService::DFAService() {}

DFAService::~DFAService() {}

DFAModel DFAService::crearDFA(const std::string& definicion) {
    DFAModel dfa;
    dfa.asignarNombre("DFA_" + definicion);
    return dfa;
}

DFAModel DFAService::obtenerDFA(int id) {
    (void)id;
    DFAModel dfa;
    return dfa;
}

DynamicArray DFAService::listarDFAs() {
    DynamicArray lista;
    return lista;
}

bool DFAService::eliminarDFA(int id) {
    (void)id;
    return false;
}

ResultadoValidacion DFAService::validarDFA(const DFAModel& dfa) {
    return Validator::validar(dfa);
}

DFAModel DFAService::realizarUnion(const DFAModel& a, const DFAModel& b) {
    DFAUnion unionador;
    return unionador.unir(a, b);
}

ResultadoPrueba DFAService::probarCadenaDFA(const DFAModel& dfa, const std::string& entrada) {
    StringTester tester;
    return tester.evaluarCadena(dfa, entrada);
}
