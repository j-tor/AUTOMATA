//Header union dfa
#pragma once

#include "dfa_model.hpp"

class DFAUnion {
public:
    DFAUnion();
    ~DFAUnion();

    DFAModel unir(const DFAModel& a, const DFAModel& b);
};
