/**
 * Client-Side DFA Logic Engine
 */

/**
 * Validates a DFA structure based on formal automata theory.
 * A DFA is valid if:
 * 1. It has a name.
 * 2. It has at least one state.
 * 3. It has at least one alphabet symbol.
 * 4. The initial state exists in the states list.
 * 5. All accepting states exist in the states list.
 * 6. The transition table is complete (exactly one transition for each state-symbol pair)
 *    and points only to existing states.
 * 
 * @param {Object} dfa 
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateDFA = (dfa) => {
  const errors = [];

  if (!dfa) {
    return { isValid: false, errors: ['El DFA es nulo o indefinido.'] };
  }

  // 1. Name validation
  if (!dfa.name || typeof dfa.name !== 'string' || dfa.name.trim() === '') {
    errors.push('El nombre del DFA es obligatorio.');
  }

  // 2. States validation
  const states = dfa.states || [];
  if (states.length === 0) {
    errors.push('El autómata debe contener al menos un estado.');
  }

  // Check for duplicate states
  const uniqueStates = new Set(states);
  if (uniqueStates.size !== states.length) {
    errors.push('El conjunto de estados contiene nombres duplicados.');
  }

  // 3. Alphabet validation
  const alphabet = dfa.alphabet || [];
  if (alphabet.length === 0) {
    errors.push('El alfabeto debe contener al menos un símbolo.');
  }

  const uniqueAlphabet = new Set(alphabet);
  if (uniqueAlphabet.size !== alphabet.length) {
    errors.push('El alfabeto contiene símbolos duplicados.');
  }

  // Check invalid symbols (empty, spaces, special chars)
  alphabet.forEach(symbol => {
    if (!symbol || symbol.trim() === '' || symbol.length > 1) {
      errors.push(`Símbolo del alfabeto inválido: "${symbol}". Debe ser un único carácter.`);
    }
    if (['ε', 'λ', ' ', '-', ','].includes(symbol)) {
      errors.push(`El símbolo "${symbol}" no está permitido (símbolos reservados: ε, λ, espacios, guiones).`);
    }
  });

  // 4. Initial state validation
  const initialState = dfa.initial_state;
  if (!initialState) {
    errors.push('El estado inicial es obligatorio.');
  } else if (!uniqueStates.has(initialState)) {
    errors.push(`El estado inicial "${initialState}" no existe en el conjunto de estados.`);
  }

  // 5. Accepting states validation
  const acceptingStates = dfa.accepting_states || [];
  acceptingStates.forEach(state => {
    if (!uniqueStates.has(state)) {
      errors.push(`El estado de aceptación "${state}" no existe en el conjunto de estados.`);
    }
  });

  // 6. Transition matrix completeness & determinism
  const transitions = dfa.transitions || [];
  
  // Track transition counts for checking completeness and determinism
  // Key: "fromState|symbol" -> Array of target states
  const transitionMap = {};
  
  transitions.forEach((trans, index) => {
    const { from, symbol, to } = trans;
    
    if (!uniqueStates.has(from)) {
      errors.push(`Línea ${index + 1}: El estado de origen "${from}" no pertenece al autómata.`);
    }
    if (!uniqueAlphabet.has(symbol)) {
      errors.push(`Línea ${index + 1}: El símbolo "${symbol}" no pertenece al alfabeto.`);
    }
    if (!uniqueStates.has(to)) {
      errors.push(`Línea ${index + 1}: El estado de destino "${to}" no pertenece al autómata.`);
    }

    const key = `${from}|${symbol}`;
    if (!transitionMap[key]) {
      transitionMap[key] = [];
    }
    transitionMap[key].push(to);
  });

  // Check complete mapping (each state must have exactly one transition for each symbol)
  states.forEach(state => {
    alphabet.forEach(symbol => {
      const key = `${state}|${symbol}`;
      const targets = transitionMap[key] || [];

      if (targets.length === 0) {
        errors.push(`Falta transición definida desde el estado "${state}" con el símbolo "${symbol}".`);
      } else if (targets.length > 1) {
        errors.push(`Transición duplicada/no-determinista desde el estado "${state}" con el símbolo "${symbol}" (hacia: ${targets.join(', ')}).`);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Computes the product automaton for the UNION (L(M1) U L(M2)) of two DFAs.
 * Assumes they share the alphabet (or uses the union of alphabets).
 * 
 * @param {Object} dfa1 
 * @param {Object} dfa2 
 * @returns {Object} Combined DFA object
 */
export const computeUnion = (dfa1, dfa2) => {
  // Validate both inputs first
  const val1 = validateDFA(dfa1);
  const val2 = validateDFA(dfa2);
  
  if (!val1.isValid || !val2.isValid) {
    throw new Error('Ambos autómatas deben ser válidos antes de hacer la unión.');
  }

  // Combined alphabet: Union of both alphabets
  const alphabet = Array.from(new Set([...dfa1.alphabet, ...dfa2.alphabet]));

  // Helper map for fast lookup of transitions in original DFAs
  // Key: "from|symbol" -> target state
  const buildTransMap = (dfa) => {
    const map = {};
    dfa.transitions.forEach(t => {
      map[`${t.from}|${t.symbol}`] = t.to;
    });
    return map;
  };

  const map1 = buildTransMap(dfa1);
  const map2 = buildTransMap(dfa2);

  // States in product automaton: Q1 x Q2
  // Formatted as "(qA,qB)"
  const states = [];
  const acceptingStates = [];
  const transitions = [];

  // Generate Cartesian Product States
  dfa1.states.forEach(q1 => {
    dfa2.states.forEach(q2 => {
      const compoundState = `(${q1},${q2})`;
      states.push(compoundState);

      // Union condition: accepted by M1 OR accepted by M2
      const isAccepting1 = dfa1.accepting_states.includes(q1);
      const isAccepting2 = dfa2.accepting_states.includes(q2);
      if (isAccepting1 || isAccepting2) {
        acceptingStates.push(compoundState);
      }
    });
  });

  // Generate Transitions for each compound state and each symbol
  states.forEach(compoundState => {
    // Parse compoundState e.g. "(q0,q1)" -> "q0" and "q1"
    // Regex matches contents between parenthesis separated by comma
    const match = compoundState.match(/^\(([^,]+),([^,]+)\)$/);
    if (!match) return;
    
    const q1 = match[1];
    const q2 = match[2];

    alphabet.forEach(symbol => {
      // Find transitions, falling back to trap state or self-loop if symbol not in one DFA's alphabet
      // Since they are validated and alphabets are standard, they should exist
      const to1 = map1[`${q1}|${symbol}`] || q1; 
      const to2 = map2[`${q2}|${symbol}`] || q2;

      transitions.push({
        from: compoundState,
        symbol,
        to: `(${to1},${to2})`
      });
    });
  });

  const unionDFA = {
    id: `union-${dfa1.id}-${dfa2.id}`,
    name: `${dfa1.name}_U_${dfa2.name}`,
    states,
    alphabet,
    initial_state: `(${dfa1.initial_state},${dfa2.initial_state})`,
    accepting_states: acceptingStates,
    transitions,
    is_valid: true,
    is_union: true,
    dfa1_id: dfa1.id,
    dfa2_id: dfa2.id
  };

  return unionDFA;
};

/**
 * Traces step-by-step execution path of a string through a DFA.
 * 
 * @param {Object} dfa 
 * @param {string} string 
 * @returns {Object} Trace results
 */
export const testString = (dfa, string) => {
  const alphabetSet = new Set(dfa.alphabet);
  
  // Verify characters belong to alphabet
  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    if (!alphabetSet.has(char)) {
      return {
        accepted: false,
        path: [dfa.initial_state],
        symbols: [],
        error: `El carácter "${char}" en la posición ${i + 1} no pertenece al alfabeto del autómata.`
      };
    }
  }

  // Create transition map for O(1) step lookup
  const transMap = {};
  dfa.transitions.forEach(t => {
    transMap[`${t.from}|${t.symbol}`] = t.to;
  });

  let currentState = dfa.initial_state;
  const path = [currentState];
  const symbols = [];

  for (let i = 0; i < string.length; i++) {
    const symbol = string[i];
    const nextState = transMap[`${currentState}|${symbol}`];

    if (nextState === undefined) {
      // Should not happen if DFA is fully validated and complete, but acting as safeguard
      return {
        accepted: false,
        path,
        symbols,
        error: `No hay transición definida desde el estado "${currentState}" con el símbolo "${symbol}".`
      };
    }

    currentState = nextState;
    path.push(currentState);
    symbols.push(symbol);
  }

  const accepted = dfa.accepting_states.includes(currentState);

  return {
    accepted,
    path,
    symbols,
    finalState: currentState
  };
};
