#pragma once
#include <cstddef>
#include <string>

class HashTable {
public:
    HashTable();
    HashTable(const HashTable& otro);
    HashTable& operator=(const HashTable& otro);
    ~HashTable();

    void insertar(const std::string& clave, int valor);
    int obtener(const std::string& clave) const;
    bool remover(const std::string& clave);
    bool contiene(const std::string& clave) const;
    size_t tamano() const;
    void limpiar();

private:
    struct Entrada {
        std::string clave;
        int valor;
        Entrada* siguiente;
        Entrada(const std::string& c, int v)
            : clave(c), valor(v), siguiente(nullptr) {}
    };

    static const size_t CANTIDAD_BALDES = 53;
    Entrada* baldes[CANTIDAD_BALDES];
    size_t longitud;

    size_t hash(const std::string& clave) const;
};
