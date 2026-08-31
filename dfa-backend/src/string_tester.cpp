#include "string_tester.hpp"
#include <sstream>

StringTester::StringTester() {}

StringTester::~StringTester() {}

ResultadoPrueba StringTester::evaluarCadena(const DFAModel& dfa, const std::string& entrada) {
    ResultadoPrueba resultado;
    resultado.aceptada = false;
    resultado.traza = "";
    
    int estadoActual = dfa.obtenerEstadoInicial();
    if (estadoActual== -1) 
    {
        resultado.traza = "Error: No hay estado inicial.";
        return resultado;
    }
    
    std::ostringstream traza;
    traza << "Estado inicial: " << estadoActual << "\n";
    
    const Graph& transiciones = dfa.obtenerTransiciones();
    const DynamicArray& estadosAceptacion = dfa.obtenerEstadosAceptacion();
    
    for (size_t i = 0; i < entrada.length(); i++) 
    {
        char simbolo = entrada[i];
        int proximoEstado = transiciones.obtenerTransicion(estadoActual, simbolo);
        
        if (proximoEstado == -1) 
        {
            traza << "Simbolo '" << simbolo << "'en posicion " << i << ": no hay transicion.\n";
            resultado.traza = traza.str();
            resultado.aceptada =false;
            return resultado;
        }
        
        traza << "Simbolo '" << simbolo << "' -> Estado " << proximoEstado << "\n";
        estadoActual = proximoEstado;
    }
    
    bool esAceptacion = false;
    for (size_t i = 0; i < estadosAceptacion.tamano(); i++)
    {
        if (estadosAceptacion.en(i) == estadoActual) 
        {
            esAceptacion = true;
            break;
        }
    }
    
    if (esAceptacion) 
    {
        traza << "Estado final " << estadoActual << " es ACEPTACION.\n";
        resultado.aceptada = true;
    } else {
        traza << "Estado final " << estadoActual << " NO es aceptacion.\n";
        resultado.aceptada =false;
    }
    
    resultado.traza = traza.str();
    return resultado;
}
