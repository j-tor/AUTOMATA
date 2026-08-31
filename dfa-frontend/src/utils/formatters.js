/**
 * Helper to convert DFA definitions into Mermaid diagram syntax.
 */

/**
 * Generates Mermaid.js string from a DFA object, with optional trace highlighting.
 * 
 * @param {Object} dfa - The DFA object
 * @param {Array} highlightedPath - The step-by-step path from a string test
 * @param {number} currentStepIndex - The current index in the path to highlight
 * @returns {string} Mermaid diagram code
 */
export const dfaToMermaid = (dfa, highlightedPath = [], currentStepIndex = -1) => {
  if (!dfa || !dfa.states || dfa.states.length === 0) {
    return 'graph LR\n  empty[Aún no hay estados]';
  }

  const lines = ['graph LR'];

  // Add styles definitions
  // Using custom HSL colors corresponding to our theme
  lines.push('  %% Styles Definitions');
  lines.push('  classDef default fill:#0f172a,stroke:#334155,stroke-width:2px,color:#f8fafc;');
  lines.push('  classDef accepting fill:#064e3b,stroke:#10b981,stroke-dasharray: 0,stroke-width:3px,color:#f8fafc;');
  lines.push('  classDef initialState stroke:#3b82f6,stroke-width:3px;');
  lines.push('  classDef active fill:#4c1d95,stroke:#a78bfa,stroke-width:4px,color:#ffffff;');
  lines.push('  classDef activeAccepting fill:#022c22,stroke:#34d399,stroke-width:4px,color:#ffffff;');

  // Determine active state from path
  let activeState = null;
  if (highlightedPath && highlightedPath.length > 0 && currentStepIndex >= 0 && currentStepIndex < highlightedPath.length) {
    activeState = highlightedPath[currentStepIndex];
  }

  // 1. Declare all states with correct shapes
  lines.push('  %% States declaration');
  dfa.states.forEach(state => {
    // Escape state names for Mermaid ID if they contain parentheses
    // e.g. (q0,q1) -> state_q0_q1["(q0, q1)"]
    const stateId = getMermaidId(state);
    const isAccepting = dfa.accepting_states.includes(state);
    
    let shapeStart = '((';
    let shapeEnd = '))';
    
    if (isAccepting) {
      shapeStart = '(((';
      shapeEnd = ')))';
    }

    lines.push(`  ${stateId}${shapeStart}"${state}"${shapeEnd}`);
  });

  // 2. Add initial state marker
  lines.push('  %% Initial state indicator');
  const startId = getMermaidId(dfa.initial_state);
  lines.push(`  __start[ ] --> ${startId}`);
  lines.push('  style __start fill:none,stroke:none,stroke-width:0px,width:0px,height:0px');

  // 3. Group transitions by (from -> to) to keep graph neat
  // Key: "fromId->toId" -> Array of symbols
  lines.push('  %% Transitions');
  const transitionGroups = {};
  
  const transitions = dfa.transitions || [];
  transitions.forEach(t => {
    const fromId = getMermaidId(t.from);
    const toId = getMermaidId(t.to);
    const key = `${fromId}->${toId}`;

    if (!transitionGroups[key]) {
      transitionGroups[key] = [];
    }
    transitionGroups[key].push(t.symbol);
  });

  // Write transitions
  Object.keys(transitionGroups).forEach(key => {
    const [fromId, toId] = key.split('->');
    const symbols = transitionGroups[key].join(', ');
    lines.push(`  ${fromId} -->|"${symbols}"| ${toId}`);
  });

  // 4. Apply style classes
  lines.push('  %% Apply styles');
  dfa.states.forEach(state => {
    const stateId = getMermaidId(state);
    const isAccepting = dfa.accepting_states.includes(state);
    const isInitial = state === dfa.initial_state;
    const isActive = state === activeState;

    if (isActive) {
      if (isAccepting) {
        lines.push(`  class ${stateId} activeAccepting;`);
      } else {
        lines.push(`  class ${stateId} active;`);
      }
    } else {
      if (isAccepting) {
        lines.push(`  class ${stateId} accepting;`);
      }
      if (isInitial && !isActive) {
        lines.push(`  class ${stateId} initialState;`);
      }
    }
  });

  return lines.join('\n');
};

/**
 * Helper to escape state name for Mermaid node identifiers.
 * E.g. "(q0,q1)" -> "node_q0_q1"
 */
export const getMermaidId = (stateName) => {
  if (!stateName) return 'null_node';
  // Replace brackets, spaces, commas with underscores and add a safe prefix
  return 'st_' + stateName.replace(/[\(\),\s\-]/g, '_');
};
