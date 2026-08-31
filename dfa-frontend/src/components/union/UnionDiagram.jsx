import React from 'react';
import DFADiagram from '../dfa/DFADiagram';
import { dfaToMermaid } from '../../utils/formatters';

/**
 * Union product automaton diagram wrapper
 */
export const UnionDiagram = ({ 
  unionDfa,
  title = 'Diagrama del Autómata Unión (M1 ∪ M2)'
}) => {
  const code = dfaToMermaid(unionDfa);
  return (
    <DFADiagram 
      definition={code} 
      title={title}
      className="w-full"
    />
  );
};

export default UnionDiagram;
