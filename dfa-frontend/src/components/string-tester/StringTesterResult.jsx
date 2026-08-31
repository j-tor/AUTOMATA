import React from 'react';
import DFADiagram from '../dfa/DFADiagram';
import { dfaToMermaid } from '../../utils/formatters';

/**
 * Grid to render topographies of DFA1, DFA2 and Union DFA side by side with synchronized state highlighting
 */
export const StringTesterResult = ({
  dfa1,
  dfa2,
  unionDfa,
  trace1,
  trace2,
  traceUnion,
  activeStep
}) => {
  // Generate Mermaid code dynamically with current active step highlighted
  const m1Code = dfa1 && trace1 ? dfaToMermaid(dfa1, trace1.path, activeStep) : '';
  const m2Code = dfa2 && trace2 ? dfaToMermaid(dfa2, trace2.path, activeStep) : '';
  const unionCode = unionDfa && traceUnion ? dfaToMermaid(unionDfa, traceUnion.path, activeStep) : '';

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* DFA 1 Diagram Card */}
      {dfa1 && (
        <DFADiagram 
          definition={m1Code} 
          title={`Topología de M1: ${dfa1.name}`}
          className="w-full"
        />
      )}

      {/* DFA 2 Diagram Card */}
      {dfa2 && (
        <DFADiagram 
          definition={m2Code} 
          title={`Topología de M2: ${dfa2.name}`}
          className="w-full"
        />
      )}

      {/* Union DFA Diagram Card */}
      {unionDfa ? (
        <DFADiagram 
          definition={unionCode} 
          title={`Topología de la Unión: ${unionDfa.name}`}
          className="w-full border-brand-500/20"
        />
      ) : (
        <div className="glass-panel p-5 flex flex-col items-center justify-center min-h-[300px] border-slate-800 text-center">
          <span className="text-sm font-semibold text-slate-500 italic max-w-xs">
            Diagrama de unión no disponible. Calcula la unión para habilitar esta visualización.
          </span>
        </div>
      )}

    </div>
  );
};

export default StringTesterResult;
