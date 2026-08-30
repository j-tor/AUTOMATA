#include "dynamic_array.hpp"

DynamicArray::DynamicArray():longitud(0) {}

DynamicArray::~DynamicArray(){}

void DynamicArray::agregarAlFinal(int valor){
    if (longitud >= capacidadMaxima) return;
    
    datos[longitud] = valor;
    longitud++;
}

void DynamicArray::eliminarEn(size_t indice)  {
    if (indice >= longitud) return;
    for (size_t i = indice; i < longitud - 1; i++) 
    {
        datos[i] = datos[i + 1];
    }
    longitud-- ;
}

int DynamicArray::en(size_t indice) const {
    if (indice >= longitud) return -1;
    return datos[indice];
}

bool DynamicArray::contiene(int valor) const{
    for (size_t i = 0; i < longitud; i++) 
    {
        if (datos[i] == valor) return true;
    }
    return false;
}

size_t DynamicArray::tamano() const{
    return longitud;
}

bool DynamicArray::estaVacio()const{
    return longitud == 0;
}

void DynamicArray::limpiar(){
    longitud = 0;
}
