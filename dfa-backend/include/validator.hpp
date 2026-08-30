//header validador dfa 
#pragma once

#include "dfa_model.hpp"

#include <string>

struct ResultadoValidacion {
    bool esValido;
    std::string mensaje;
};

namespace Validator {
    bool esCompleto(const DFAModel& dfa);
    bool esDeterministico(const DFAModel& dfa);
    bool estadosAlcanzables(const DFAModel& dfa);
    ResultadoValidacion validar(const DFAModel& dfa);
}
