#include "union.hpp"
#include <sstream>

DFAUnion::DFAUnion() {}

DFAUnion::~DFAUnion() {}

DFAModel DFAUnion::unir(const DFAModel& a, const DFAModel& b) {
    DFAModel resultado;
    resultado.asignarNombre(a.obtenerNombre() + " UNION " + b.obtenerNombre());
    
    const DynamicArray& estadosA = a.obtenerEstados();
    const DynamicArray& estadosB = b.obtenerEstados();
    const std::string& alfabetoA = a.obtenerAlfabeto();
    const std::string& alfabetoB = b.obtenerAlfabeto();
    const Graph& transicionesA = a.obtenerTransiciones();
    const Graph& transicionesB = b.obtenerTransiciones();
    int estadoInicialA = a.obtenerEstadoInicial();
    int estadoInicialB = b.obtenerEstadoInicial();
    const DynamicArray& estadosAceptacionA = a.obtenerEstadosAceptacion();
    const DynamicArray& estadosAceptacionB = b.obtenerEstadosAceptacion();
    
    if (alfabetoA.length() != alfabetoB.length()) 
    {
        return resultado;
    }
    
    for (size_t i = 0; i < alfabetoA.length(); i++) 
    {
        char simbolo = alfabetoA[i];
        bool encontrado = false;
        for (size_t j = 0; j < alfabetoB.length(); j++) 
        {
            if (alfabetoB[j] == simbolo) {
                encontrado = true;
                break;
            }
        }
        if (!encontrado) return resultado;
    }
    
    for (size_t i = 0; i < alfabetoA.length(); i++) 
    {
        resultado.agregarSimbolo(alfabetoA[i]);
    }
    
    for (size_t i = 0; i < estadosA.tamano(); i++) 
    {
        for (size_t j = 0; j < estadosB.tamano(); j++) 
        {
            int idA = estadosA.en(i);
            int idB = estadosB.en(j);
            std::ostringstream nombreEstadoCompuesto;
            nombreEstadoCompuesto << "(q" << idA << ",q" << idB << ")";
            resultado.agregarEstado(nombreEstadoCompuesto.str());
        }
    }
    
    std::ostringstream nombreEstadoInicialCompuesto;
    nombreEstadoInicialCompuesto << "(q" << estadoInicialA << ",q" << estadoInicialB << ")";
    resultado.asignarEstadoInicial(nombreEstadoInicialCompuesto.str());
    
    for (size_t i = 0; i < estadosA.tamano(); i++) 
    {
        for (size_t j = 0; j < estadosB.tamano(); j++) 
        {
            int idA = estadosA.en(i);
            int idB = estadosB.en(j);
            
            bool esAceptacionA = false;
            for (size_t k = 0; k < estadosAceptacionA.tamano(); k++) 
            {
                if (estadosAceptacionA.en(k) == idA) 
                {
                    esAceptacionA = true;
                    break;
                }
            }
            
            bool esAceptacionB = false;
            for (size_t k = 0; k < estadosAceptacionB.tamano(); k++) 
            {
                if (estadosAceptacionB.en(k) == idB) 
                {
                    esAceptacionB = true;
                    break;
                }
            }
            
            if (esAceptacionA || esAceptacionB) 
            {
                std::ostringstream nombreEstadoCompuesto;
                nombreEstadoCompuesto << "(q" << idA << ",q" << idB << ")";
                resultado.agregarEstadoAceptacion(nombreEstadoCompuesto.str());
            }
        }
    }
    
    for (size_t i = 0; i < estadosA.tamano(); i++) 
    {
        for (size_t j = 0; j < estadosB.tamano(); j++) 
        {
            int idA=estadosA.en(i);
            int idB=estadosB.en(j);
            
            for (size_t k = 0; k < alfabetoA.length(); k++) 
            {
                char simbolo = alfabetoA[k];
                int destinoA = transicionesA.obtenerTransicion(idA, simbolo);
                int destinoB= transicionesB.obtenerTransicion(idB, simbolo);
                
                std::ostringstream nombreDestino;
                nombreDestino << "(q" << destinoA << ",q" << destinoB << ")";
                
                std::ostringstream nombreOrigen;
                nombreOrigen << "(q" << idA << ",q" << idB << ")";
                
                int idOrigen = resultado.obtenerIdEstado(nombreOrigen.str());
                if (idOrigen!= -1) {
                    resultado.agregarTransicion(idOrigen, nombreDestino.str(), simbolo);
                }
            }
        }
    }
    
    return resultado;
}
