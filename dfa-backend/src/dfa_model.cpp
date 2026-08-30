#include "dfa_model.hpp"

DFAModel::DFAModel() {
}

DFAModel::~DFAModel() {
}

void DFAModel::asignarNombre(const std::string& nombre) {
}

std::string DFAModel::obtenerNombre() const {
    return "";
}

int DFAModel::agregarEstado(const std::string& nombreEstado) {
    return -1;
}

void DFAModel::agregarSimbolo(char simbolo) {
}

void DFAModel::agregarTransicion(int desde, const std::string& hacia, char simbolo) {
}

void DFAModel::asignarEstadoInicial(const std::string& nombreEstado) {
}

void DFAModel::agregarEstadoAceptacion(const std::string& nombreEstado) {
}

DynamicArray DFAModel::obtenerEstados() const {
    return {};
}

std::string DFAModel::obtenerAlfabeto() const {
    return "";
}

Graph DFAModel::obtenerTransiciones() const {
    return {};
}

int DFAModel::obtenerEstadoInicial() const {
    return -1;
}

DynamicArray DFAModel::obtenerEstadosAceptacion() const {
    return {};
}

int DFAModel::obtenerIdEstado(const std::string& nombreEstado) const {
    return -1;
}
