#include "hash_table.hpp"

HashTable::HashTable() : longitud(0) {
    for (size_t i = 0; i < capacidadTabla; i++) {
        tabla[i] = nullptr;
    }
}

HashTable::~HashTable() {
    limpiar();
}

size_t HashTable::hash(const std::string& clave) const {
    size_t h = 0;
    for (size_t i = 0; i < clave.length(); i++) {
        h = (h * 31 + static_cast<unsigned char>(clave[i])) % capacidadTabla;
    }
    return h;
}

void HashTable::insertar(const std::string& clave, int valor) {
    size_t indice = hash(clave);
    Entrada* actual = tabla[indice];
    while (actual != nullptr) {
        if (actual->clave == clave) {
            actual->valor = valor;
            return;
        }
        actual = actual->siguiente;
    }
    Entrada* nueva = new Entrada(clave, valor);
    nueva->siguiente = tabla[indice];
    tabla[indice] = nueva;
    longitud++;
}

int HashTable::obtener(const std::string& clave) const {
    size_t indice = hash(clave);
    Entrada* actual = tabla[indice];
    while (actual != nullptr) {
        if (actual->clave == clave) return actual->valor;
        actual = actual->siguiente;
    }
    return -1;
}

bool HashTable::remover(const std::string& clave) {
    size_t indice = hash(clave);
    if (tabla[indice] == nullptr) return false;
    
    if (tabla[indice]->clave == clave) {
        Entrada* temp = tabla[indice];
        tabla[indice] = tabla[indice]->siguiente;
        delete temp;
        longitud--;
        return true;
    }
    
    Entrada* anterior = tabla[indice];
    Entrada* actual = tabla[indice]->siguiente;
    while (actual != nullptr) {
        if (actual->clave == clave) {
            anterior->siguiente = actual->siguiente;
            delete actual;
            longitud--;
            return true;
        }
        anterior = actual;
        actual = actual->siguiente;
    }
    return false;
}

bool HashTable::contiene(const std::string& clave) const {
    return obtener(clave) != -1;
}

size_t HashTable::tamano() const {
    return longitud;
}

void HashTable::limpiar() {
    for (size_t i = 0; i < capacidadTabla; i++) {
        while (tabla[i] != nullptr) {
            Entrada* temp = tabla[i];
            tabla[i] = tabla[i]->siguiente;
            delete temp;
        }
    }
    longitud = 0;
}
