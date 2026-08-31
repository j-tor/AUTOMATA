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

    const DynamicArray& obtenerEstados() const;
    const std::string& obtenerAlfabeto() const;
    const Graph& obtenerTransiciones() const;
    int obtenerEstadoInicial() const;
    const DynamicArray& obtenerEstadosAceptacion() const;

    int obtenerIdEstado(const std::string& nombreEstado) const;

private:
    std::string nombre;
    HashTable nombresEstados;
    DynamicArray estados;
    std::string alfabeto;
    Graph transiciones;
    int estadoInicial;
    DynamicArray estadosAceptacion;
};
