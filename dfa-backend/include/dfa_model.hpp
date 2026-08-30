// Header: Clase DFA con componentes
#pragma once

#include "dynamic_array.hpp"
#include "hash_table.hpp"
#include "graph.hpp"

#include <string>

class DFAModel {
public:
    DFAModel();
    ~DFAModel();

    void asignarNombre(const std::string& nombre);
    std::string obtenerNombre() const;

    int agregarEstado(const std::string& nombreEstado);
    void agregarSimbolo(char simbolo);
    void agregarTransicion(int desde, const std::string& hacia, char simbolo);
    void asignarEstadoInicial(const std::string& nombreEstado);
    void agregarEstadoAceptacion(const std::string& nombreEstado);

    DynamicArray obtenerEstados() const;
    std::string obtenerAlfabeto() const;
    Graph obtenerTransiciones() const;
    int obtenerEstadoInicial() const;
    DynamicArray obtenerEstadosAceptacion() const;

    int obtenerIdEstado(const std::string& nombreEstado) const;

private:
    std::string nombre_;
    HashTable nombresEstados_;   // nombre -> id
    DynamicArray estados_;       // ids de estados
    std::string alfabeto_;       // símbolos
    Graph transiciones_;         // grafo de transiciones (id, simbolo) -> id
    int estadoInicial_;
    DynamicArray estadosAceptacion_;
};
