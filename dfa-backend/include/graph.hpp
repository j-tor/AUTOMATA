//header graph 
#pragma once

#include <cstddef>

class Graph {
public:
    Graph();
    ~Graph();

    void agregarNodo(int idNodo);
    void agregarArista(int desde, int hacia, char simbolo);
    bool tieneNodo(int idNodo) const;
    int obtenerTransicion(int desde, char simbolo) const;
    size_t cantidadNodos() const;
    size_t cantidadAristas() const;
    void limpiar();

private:
    struct Arista {
        int hacia;
        char simbolo;
        Arista* siguiente;
        Arista(int h, char s) : hacia(h), simbolo(s), siguiente(nullptr) {}
    };

    struct ListaAdyacencia {
        int idNodo;
        Arista* aristas;
        ListaAdyacencia* siguiente;
        ListaAdyacencia(int id)
            : idNodo(id), aristas(nullptr), siguiente(nullptr) {}
    };

    ListaAdyacencia* cabeza_;
    size_t cantidadNodos_;
    size_t cantidadAristas_;
};
