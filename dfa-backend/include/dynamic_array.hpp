//header dynamic array
#pragma once

#include <cstddef>

class DynamicArray {
public:
    DynamicArray();
    ~DynamicArray();

    void agregarAlFinal(int valor);
    void eliminarEn(size_t indice);
    int en(size_t indice) const;
    bool contiene(int valor) const;
    size_t tamano() const;
    bool estaVacio() const;
    void limpiar();

private:
    int* datos_;
    size_t tamano_;
    size_t capacidad_;

    void redimensionar(size_t nuevaCapacidad);
};
