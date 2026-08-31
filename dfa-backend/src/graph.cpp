#include "graph.hpp"

Graph::Graph() : head(nullptr), cantidadNodos_(0), cantidadAristas_(0) {}

Graph::~Graph() {
    limpiar();
}

void Graph::agregarNodo(int idNodo) 
{
    if (tieneNodo(idNodo)) 
    {
        return;
    }
    ListaAdyacencia* nueva = new ListaAdyacencia(idNodo);
    nueva->siguiente = head;
    head = nueva;
    cantidadNodos_++;
}

void Graph::agregarArista(int desde, int hacia, char simbolo){
    ListaAdyacencia* nodo = head;
    while (nodo != nullptr)
     {
        if (nodo->idNodo == desde) 
        {
            Arista* nueva = new Arista(hacia, simbolo);
            nueva->siguiente = nodo->aristas;
            nodo->aristas = nueva;
            cantidadAristas_++;
            return;
        }
        nodo = nodo->siguiente;
    }
}

bool Graph::tieneNodo(int idNodo) const {
    ListaAdyacencia* nodo =head;
    while (nodo != nullptr) 
    {
        if (nodo->idNodo == idNodo) 
        {
            return true;
        }
        nodo = nodo->siguiente;
    }
    return false;
}

int Graph::obtenerTransicion(int desde, char simbolo) const {
    ListaAdyacencia* nodo = head;
    while (nodo != nullptr) 
    {
        if (nodo->idNodo== desde) 
        {
            Arista* arista= nodo->aristas;
            while (arista !=nullptr) 
            {
                if (arista->simbolo== simbolo) return arista->hacia;
                arista = arista->siguiente;
            }
            return -1;
        }
        nodo = nodo->siguiente;
    }
    return -1;
}

size_t Graph::cantidadNodos() const {
    return cantidadNodos_;
}

size_t Graph::cantidadAristas() const {
    return cantidadAristas_;
}

void Graph::limpiar() {
    while (head != nullptr) 
    {
        Arista* arista= head->aristas;
        while (arista != nullptr) 
        {
            Arista* temp =arista;
            arista =arista->siguiente;
            delete temp;
        }
        ListaAdyacencia* temp = head;
        head =head->siguiente;
        delete temp;
    }
    cantidadNodos_= 0;
    cantidadAristas_ = 0;
}
