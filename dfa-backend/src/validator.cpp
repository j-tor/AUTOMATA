#include "validator.hpp"

namespace Validator {

bool esCompleto(const DFAModel& dfa) {
    const DynamicArray& estados = dfa.obtenerEstados();
    const std::string& alfabeto = dfa.obtenerAlfabeto();
    const Graph& transiciones = dfa.obtenerTransiciones();
    
    for (size_t i = 0; i < estados.tamano(); i++) 
    {
        int idEstado= estados.en(i);
        for (size_t j = 0; j < alfabeto.length(); j++) 
        {
            char simbolo=alfabeto[j];
            if (transiciones.obtenerTransicion(idEstado, simbolo)== -1) 
            {
                return false;
            }
        }
    }
    return true;
}

bool esDeterministico(const DFAModel& dfa) {
    (void)dfa;
    return true;
}

bool estadosAlcanzables(const DFAModel& dfa) {
    const DynamicArray& estados = dfa.obtenerEstados();
    const Graph& transiciones = dfa.obtenerTransiciones();
    const std::string& alfabeto = dfa.obtenerAlfabeto();
    
    for (size_t i = 0; i < estados.tamano(); i++) 
    {
        int idEstado= estados.en(i);
        for (size_t j = 0; j < alfabeto.length(); j++) 
        {
            char simbolo=alfabeto[j];
            int destino= transiciones.obtenerTransicion(idEstado,simbolo);
            if (destino!= -1 && !estados.contiene(destino)) 
            {
                return false;
            }
        }
    }
    return true;
}

ResultadoValidacion validar(const DFAModel& dfa) {
    ResultadoValidacion resultado;
    const DynamicArray& estados = dfa.obtenerEstados();
    int estadoInicial = dfa.obtenerEstadoInicial();
    const std::string& alfabeto = dfa.obtenerAlfabeto();
    const DynamicArray& estadosAceptacion = dfa.obtenerEstadosAceptacion();
    
    if (estados.estaVacio()) 
    {
        resultado.esValido = false;
        resultado.mensaje = "Error: No hay estados.";
        return resultado;
    }
    
    if (estadoInicial== -1 || !estados.contiene(estadoInicial)) 
    {
        resultado.esValido =false;
        resultado.mensaje ="Error: Estado inicial invalido.";
        return resultado;
    }
    
    if (alfabeto.length() == 0) 
    {
        resultado.esValido = false;
        resultado.mensaje ="Error: Alfabeto vacio.";
        return resultado;
    }
    
    for (size_t i = 0; i < estadosAceptacion.tamano(); i++) 
    {
        if (!estados.contiene(estadosAceptacion.en(i))) 
        {
            resultado.esValido =false;
            resultado.mensaje ="Error: Estado de aceptacion invalido.";
            return resultado;
        }
    }
    
    if (!esCompleto(dfa)) 
    {
        resultado.esValido = false;
        resultado.mensaje ="Error: Funcion de transicion incompleta.";
        return resultado;
    }
    
    if (!estadosAlcanzables(dfa)) 
    {
        resultado.esValido =false;
        resultado.mensaje="Error: Hay transiciones a estados inexistentes.";
        return resultado;
    }
    
    resultado.esValido = true;
    resultado.mensaje= "DFA valido.";
    return resultado;
}

}
