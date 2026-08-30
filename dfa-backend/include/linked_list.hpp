#pragma once
#include <cstddef>

class LinkedList {
public:
    LinkedList();
    LinkedList(const LinkedList& otro);
    LinkedList& operator=(const LinkedList& otro);
    ~LinkedList();

    void agregarAlFinal(int valor);
    void agregarAlInicio(int valor);
    bool remover(int valor);
    bool contiene(int valor) const;
    size_t tamano() const;
    void limpiar();

private:
    struct Nodo {
        int valor;
        Nodo* siguiente;
        Nodo(int v) : valor(v), siguiente(nullptr) {}
    };

    Nodo* cabeza;
    size_t longitud;
};
