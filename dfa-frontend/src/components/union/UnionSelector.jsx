import React, { useState, useEffect } from 'react';
import { HelpCircle, Play, RefreshCw, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import { validateDFA } from '../../utils/dfa-engine';

/**
 * Selector component for choosing 2 valid DFAs to compute product automaton union
 */
export const UnionSelector = ({ 
  dfas, 
  onUnion, 
  loading,
  preselectedDfa1Id = ''
}) => {
  const [dfa1, setDfa1] = useState('');
  const [dfa2, setDfa2] = useState('');
  const [error, setError] = useState('');

  // Get only valid DFAs for union operation.
  // Un autómata es "válido" si explícitamente trae is_valid:true, o si
  // cumple la validación formal del motor local (compatibilidad con DFAs
  // antiguos que se guardaron sin el campo is_valid).
  const validDfas = dfas.filter(d => {
    if (d.is_valid === true) return true;
    return validateDFA(d).isValid;
  });

  // DEBUG: informa cuántos autómatas válidos hay realmente disponibles
  useEffect(() => {
    console.log(`[UnionSelector] ${validDfas.length} de ${dfas.length} autómata(s) son válidos para la unión.`);
  }, [validDfas.length, dfas.length]);

  // Pre-select dfa1 if passed as query parameter
  useEffect(() => {
    if (preselectedDfa1Id && validDfas.some(d => d.id === preselectedDfa1Id)) {
      setDfa1(preselectedDfa1Id);
    } else if (validDfas.length > 0 && !dfa1) {
      setDfa1(validDfas[0].id);
    }
  }, [preselectedDfa1Id, validDfas, dfa1]);

  // Set default selection for dfa2
  useEffect(() => {
    if (!dfa2 && validDfas.length > 0) {
      // Por defecto elige un autómata DISTINTO si existe; si solo hay uno,
      // se selecciona él mismo para permitir la unión consigo mismo.
      const other = validDfas.find(d => d.id !== dfa1);
      setDfa2(other ? other.id : (dfa1 || validDfas[0].id));
    }
  }, [validDfas, dfa1, dfa2]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!dfa1 || !dfa2) {
      setError('Por favor, selecciona dos autómatas.');
      return;
    }

    // Se permite dfa1 === dfa2: unir un autómata consigo mismo es válido
    // (L(M) ∪ L(M) = L(M)) y el backend lo soporta sin problemas.
    onUnion(dfa1, dfa2);
  };

  return (
    <div className="glass-panel p-6 border-slate-800">
      <h3 className="text-md font-bold text-slate-200 tracking-wide border-b border-slate-800 pb-3 mb-5">
        Seleccionar Autómatas para la Unión (L(M1) ∪ L(M2))
      </h3>

      {validDfas.length < 1 ? (
        <div className="flex flex-col items-center gap-3 text-center py-6 text-amber-400">
          <AlertTriangle size={32} className="text-amber-500/80 mb-1" />
          <p className="text-sm font-bold">Se requiere al menos 1 autómata válido creado.</p>
          <span className="text-xs text-slate-500 max-w-sm">
            Puedes unir un autómata consigo mismo (L(M) ∪ L(M) = L(M)). Ve al Dashboard o Crear DFA para registrar autómatas formales antes de realizar una unión.
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* DFA 1 Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primer Autómata (M1)</label>
              <select
                value={dfa1}
                onChange={(e) => {
                  setDfa1(e.target.value);
                  setError('');
                }}
                className="glass-input text-sm w-full cursor-pointer bg-slate-950"
              >
                {validDfas.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.states?.length} estados)</option>
                ))}
              </select>
            </div>

            {/* DFA 2 Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Segundo Autómata (M2)</label>
              <select
                value={dfa2}
                onChange={(e) => {
                  setDfa2(e.target.value);
                  setError('');
                }}
                className="glass-input text-sm w-full cursor-pointer bg-slate-950"
              >
                {validDfas.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.states?.length} estados)</option>
                ))}
              </select>
            </div>
          </div>

          {/* Validation Feedback */}
          {error && (
            <div className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 pt-1">
              <AlertTriangle size={14} />
              <span>{error}</span>
            </div>
          )}

          <div className="border-t border-slate-900 pt-4 flex justify-end">
            <Button 
              label="Calcular Producto Unión"
              type="submit"
              loading={loading}
              icon={Play}
              className="w-full sm:w-auto px-6 py-2.5 text-xs"
            />
          </div>

        </form>
      )}

    </div>
  );
};

export default UnionSelector;
