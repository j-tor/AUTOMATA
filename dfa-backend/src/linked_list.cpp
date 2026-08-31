#include "linked_list.hpp"

LinkedList::LinkedList() : head(nullptr), longitud(0) {}

LinkedList::~LinkedList() {
    limpiar();
}

void LinkedList::agregarAlFinal(int valor) {
    Nodo* nuevoNodo = new Nodo(valor);
    if (head == nullptr) 
    {
        head = nuevoNodo;
        longitud++;
        return;
    }
    Nodo* actual = head;
    while (actual->siguiente != nullptr) 
    {
        actual = actual->siguiente;
    }
    actual->siguiente = nuevoNodo;
    longitud++;
}

void LinkedList::agregarAlInicio(int valor) {
    Nodo* nuevoNodo = new Nodo(valor);
    nuevoNodo->siguiente = head;
    head = nuevoNodo;
    longitud++;
}

bool LinkedList::remover(int valor) {
    if (head == nullptr) return false;
    if (head->valor == valor) {
        Nodo* temp = head;
        head = head->siguiente;
        delete temp;
        longitud--;
        return true;
    }
    Nodo* anterior = head;
    Nodo* actual = head->siguiente;
    while (actual != nullptr) 
    {
        if (actual->valor == valor) {
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

bool LinkedList::contiene(int valor) const {
    Nodo* actual = head;
    while (actual != nullptr) 
    {
        if (actual->valor == valor) return true;
        actual = actual->siguiente;
    }
    return false;
}

size_t LinkedList::tamano() const {
    return longitud;
}

void LinkedList::limpiar() {
    while (head !=nullptr) 
    {
        Nodo* temp = head;
        head =head->siguiente;
        delete temp;
    }
    longitud = 0;
}
