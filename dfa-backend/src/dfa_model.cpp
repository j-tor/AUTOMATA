#include "dfa_model.hpp"

DFAModel::DFAModel() : nombre(""), estadoInicial(-1) {}

DFAModel::~DFAModel() {}

void DFAModel::asignarNombre(const std::string& n){
    nombre = n;
}

std::string DFAModel::obtenerNombre() const {
    return nombre;
}

int DFAModel::agregarEstado(const std::string& nombreEstado) {
    if (nombresEstados.contiene(nombreEstado)) 
    {
        return nombresEstados.obtener(nombreEstado);
    }
    int nuevoId = static_cast<int>(estados.tamano());
    nombresEstados.insertar(nombreEstado, nuevoId);
    estados.agregarAlFinal(nuevoId);
    transiciones.agregarNodo(nuevoId);
    return nuevoId;
}

void DFAModel::agregarSimbolo(char simbolo) 
{
    if (simbolo == ' ' || simbolo == '-' || simbolo == '\0') 
    {
        return;
    }
    for (size_t i = 0; i < alfabeto.length(); i++) 
    {
        if (alfabeto[i]== simbolo) 
            return;
    }
    alfabeto += simbolo;
}

void DFAModel::agregarTransicion(int desde, const std::string& hacia, char simbolo) {
    int haciaId = obtenerIdEstado(hacia);
    if (haciaId== -1) 
    {
        return;
    }
    transiciones.agregarArista(desde, haciaId, simbolo);
}

void DFAModel::asignarEstadoInicial(const std::string& nombreEstado) 
{
    int idEstado= obtenerIdEstado(nombreEstado);
    if (idEstado != -1) 
    {
        estadoInicial = idEstado;
    }
}

void DFAModel::agregarEstadoAceptacion(const std::string& nombreEstado) {
    int idEstado = obtenerIdEstado(nombreEstado);
    if (idEstado== -1) 
    {
        return;
    }
    if (!estadosAceptacion.contiene(idEstado)) 
    {
        estadosAceptacion.agregarAlFinal(idEstado);
    }
}

const DynamicArray& DFAModel::obtenerEstados() const {
    return estados;
}

const std::string& DFAModel::obtenerAlfabeto() const {
    return alfabeto;
}

const Graph& DFAModel::obtenerTransiciones() const {
    return transiciones;
}

int DFAModel::obtenerEstadoInicial() const {
    return estadoInicial;
}

const DynamicArray& DFAModel::obtenerEstadosAceptacion() const {
    return estadosAceptacion;
}

int DFAModel::obtenerIdEstado(const std::string& nombreEstado) const {
    return nombresEstados.obtener(nombreEstado);
}
