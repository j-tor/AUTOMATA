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
    static const size_t capacidadMaxima = 10000;
    int datos[capacidadMaxima];
    size_t longitud;
};
