#include "dfa_service.hpp"

DFAService::DFAService() {
}

DFAService::~DFAService() {
}

DFAModel DFAService::crearDFA(const std::string& definicion) {
    return {};
}

DFAModel DFAService::obtenerDFA(int id) {
    return {};
}

DynamicArray DFAService::listarDFAs() {
    return {};
}

bool DFAService::eliminarDFA(int id) {
    return false;
}

ResultadoValidacion DFAService::validarDFA(const DFAModel& dfa) {
    return {};
}

DFAModel DFAService::realizarUnion(const DFAModel& a, const DFAModel& b) {
    return {};
}

ResultadoPrueba DFAService::probarCadenaDFA(const DFAModel& dfa, const std::string& entrada) {
    return {};
}
