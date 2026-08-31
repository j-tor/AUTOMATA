import React, { useState, useEffect } from 'react';
import { Plus, X, ArrowRight, Play, RefreshCw, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { validateStateName, validateAlphabetSymbol, validateDFAName } from '../../utils/validators';
import { validateDFA } from '../../utils/dfa-engine';
import { dfaToMermaid } from '../../utils/formatters';
import DFADiagram from './DFADiagram';

/**
 * Interactive DFA Creation Form with Real-time Mermaid Preview
 */
export const DFAForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel 
}) => {
  // 1. Core Form States
  const [name, setName] = useState('');
  const [states, setStates] = useState([]);
  const [alphabet, setAlphabet] = useState([]);
  const [initialState, setInitialState] = useState('');
  const [acceptingStates, setAcceptingStates] = useState([]);
  const [transitions, setTransitions] = useState([]);

  // 2. Input Fields Temporary States
  const [newState, setNewState] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [inputErrors, setInputErrors] = useState({ name: '', state: '', symbol: '' });

  // 3. Validation and Preview States
  const [validationResult, setValidationResult] = useState({ isValid: false, errors: [] });
  const [mermaidCode, setMermaidCode] = useState('');

  // Initialize form with initialData if editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setStates(initialData.states || []);
      setAlphabet(initialData.alphabet || []);
      setInitialState(initialData.initial_state || '');
      setAcceptingStates(initialData.accepting_states || []);
      setTransitions(initialData.transitions || []);
    }
  }, [initialData]);

  // Regenerate required transitions list when states or alphabet changes
  useEffect(() => {
    if (states.length === 0 || alphabet.length === 0) {
      setTransitions([]);
      return;
    }

    // Keep existing transitions that are still valid
    const updatedTransitions = [];
    
    states.forEach(fromState => {
      alphabet.forEach(symbol => {
        const existing = transitions.find(t => t.from === fromState && t.symbol === symbol);
        
        if (existing && states.includes(existing.to)) {
          updatedTransitions.push(existing);
        } else {
          // Auto-default to the same state (self-loop) or initial state if defined
          updatedTransitions.push({
            from: fromState,
            symbol,
            to: initialState && states.includes(initialState) ? initialState : states[0]
          });
        }
      });
    });

    setTransitions(updatedTransitions);
  }, [states, alphabet, initialState]);

  // Update live preview & formal validation
  useEffect(() => {
    const dfaObj = {
      name,
      states,
      alphabet,
      initial_state: initialState,
      accepting_states: acceptingStates,
      transitions
    };

    const res = validateDFA(dfaObj);

    // FIX: unificar la validación del NOMBRE con la validación formal.
    // Antes el panel podía decir "Autómata Válido" (validateDFA solo exige
    // nombre no-vacío) pero handleSubmit bloqueaba el guardado en silencio
    // por reglas más estrictas de validateDFAName (longitud 3-30, sin
    // acentos, etc.). Ahora el panel muestra TODOS los motivos de bloqueo
    // y "Válido" significa realmente "listo para guardar".
    const nameVal = validateDFAName(name);
    if (!nameVal.isValid) {
      res.isValid = false;
      res.errors = [...res.errors, nameVal.message];
    }

    setValidationResult(res);

    // DEBUG: ayuda a saber por qué el botón "Crear DFA" está bloqueado
    console.log('[DFAForm] validación actual:', JSON.stringify(res));

    if (states.length > 0) {
      const code = dfaToMermaid(dfaObj);
      setMermaidCode(code);
    } else {
      setMermaidCode('');
    }
  }, [name, states, alphabet, initialState, acceptingStates, transitions]);

  // --- Handlers ---
  
  // Handle state adding
  const handleAddState = (e) => {
    e.preventDefault();
    const val = validateStateName(newState);
    if (!val.isValid) {
      setInputErrors(prev => ({ ...prev, state: val.message }));
      return;
    }

    const stateToAdd = newState.trim();
    if (states.includes(stateToAdd)) {
      setInputErrors(prev => ({ ...prev, state: `El estado "${stateToAdd}" ya existe.` }));
      return;
    }

    setStates([...states, stateToAdd]);
    setNewState('');
    setInputErrors(prev => ({ ...prev, state: '' }));
    
    // Set as initial state if it's the first one
    if (states.length === 0) {
      setInitialState(stateToAdd);
    }
  };

  // Handle state removing
  const handleRemoveState = (stateToRemove) => {
    setStates(states.filter(s => s !== stateToRemove));
    setAcceptingStates(acceptingStates.filter(s => s !== stateToRemove));
    
    if (initialState === stateToRemove) {
      setInitialState(states[0] !== stateToRemove ? states[0] || '' : '');
    }
  };

  // Handle alphabet adding
  const handleAddSymbol = (e) => {
    e.preventDefault();
    const val = validateAlphabetSymbol(newSymbol);
    if (!val.isValid) {
      setInputErrors(prev => ({ ...prev, symbol: val.message }));
      return;
    }

    const symbolToAdd = newSymbol.trim();
    if (alphabet.includes(symbolToAdd)) {
      setInputErrors(prev => ({ ...prev, symbol: `El símbolo "${symbolToAdd}" ya existe.` }));
      return;
    }

    setAlphabet([...alphabet, symbolToAdd]);
    setNewSymbol('');
    setInputErrors(prev => ({ ...prev, symbol: '' }));
  };

  // Handle alphabet removing
  const handleRemoveSymbol = (symbolToRemove) => {
    setAlphabet(alphabet.filter(s => s !== symbolToRemove));
  };

  // Toggle accepting state select status
  const handleToggleAccepting = (state) => {
    if (acceptingStates.includes(state)) {
      setAcceptingStates(acceptingStates.filter(s => s !== state));
    } else {
      setAcceptingStates([...acceptingStates, state]);
    }
  };

  // Update target state for a specific transition
  const handleTransitionTargetChange = (from, symbol, to) => {
    setTransitions(prev => 
      prev.map(t => (t.from === from && t.symbol === symbol) ? { ...t, to } : t)
    );
  };

  // Clear Form reset
  const handleClear = () => {
    setName('');
    setStates([]);
    setAlphabet([]);
    setInitialState('');
    setAcceptingStates([]);
    setTransitions([]);
    setNewState('');
    setNewSymbol('');
    setInputErrors({ name: '', state: '', symbol: '' });
  };

  // Final submit validation
  const handleSubmit = (e) => {
    e.preventDefault();
// DEBUG: este log confirma que el clic en "Crear DFA" SÍ dispara el submit
    console.log('[DFAForm] handleSubmit: CLIC recibido en el formulario.');
    const nameVal = validateDFAName(name);
    if (!nameVal.isValid) {
      setInputErrors(prev => ({ ...prev, name: nameVal.message }));
      // DEBUG: antes este bloqueo era 100% silencioso y el usuario no
      // entendía por qué "no se guardaba". Ahora queda registrado.
      console.warn('[DFAForm] handleSubmit: bloqueado por el NOMBRE ->', nameVal.message);
      return;
    }
    if (!validationResult.isValid) {
      // DEBUG: muestra por qué no se envía (antes ocurría en silencio)
      console.warn('[DFAForm] handleSubmit: bloqueado por validación formal ->', JSON.stringify(validationResult));
      return;
    }

    const dfaData = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: name.trim(),
      states,
      alphabet,
      initial_state: initialState,
      accepting_states: acceptingStates,
      transitions,
      is_valid: true
    };

    // DEBUG: muestra el payload exacto que se enviará al backend
    console.log('[DFAForm] handleSubmit: enviando ->', JSON.stringify(dfaData, null, 2));

    onSubmit(dfaData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT: Configuration Forms (7 Cols) */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        
        {/* Card 1: Basic Info */}
        <div className="glass-panel p-6 border-slate-800">
          <h3 className="text-md font-bold text-slate-200 tracking-wide border-b border-slate-800 pb-3 mb-4">
            Información Básica
          </h3>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre del Autómata</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setInputErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="Ej. Automata_Binario_01"
              className="glass-input text-sm w-full"
            />
            {inputErrors.name && (
              <span className="text-xs text-rose-400 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {inputErrors.name}
              </span>
            )}
          </div>
        </div>

        {/* Card 2: States & Alphabet */}
        <div className="glass-panel p-6 border-slate-800 space-y-6">
          <h3 className="text-md font-bold text-slate-200 tracking-wide border-b border-slate-800 pb-3 mb-4">
            Definición de Conjuntos
          </h3>

          {/* Add States */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Estados (Q)</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                placeholder="Ej. q0"
                className="glass-input text-sm flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddState(e)}
              />
              <Button 
                label="Agregar" 
                variant="secondary" 
                icon={Plus} 
                onClick={handleAddState}
                className="px-4 text-xs font-bold"
              />
            </div>
            {inputErrors.state && (
              <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                <AlertCircle size={12} /> {inputErrors.state}
              </span>
            )}
            
            {/* States chips box */}
            <div className="flex flex-wrap gap-2 pt-1">
              {states.length === 0 ? (
                <span className="text-xs font-medium text-slate-500 italic">No hay estados agregados. Mínimo 1.</span>
              ) : (
                states.map(s => (
                  <span 
                    key={s} 
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      s === initialState 
                        ? 'bg-blue-950/30 border-blue-500/50 text-blue-300' 
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{s}</span>
                    {s === initialState && <span className="text-[9px] uppercase tracking-wider text-blue-400 bg-blue-950 px-1 py-0.5 rounded font-mono">inicial</span>}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveState(s)}
                      className="hover:text-rose-400 transition-colors"
                      aria-label={`Eliminar estado ${s}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Add Alphabet */}
          <div className="space-y-3 pt-3 border-t border-slate-900">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Alfabeto (Σ)</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                placeholder="Ej. a (un solo carácter, no ε, λ, espacios)"
                maxLength={1}
                className="glass-input text-sm flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddSymbol(e)}
              />
              <Button 
                label="Agregar" 
                variant="secondary" 
                icon={Plus} 
                onClick={handleAddSymbol}
                className="px-4 text-xs font-bold"
              />
            </div>
            {inputErrors.symbol && (
              <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                <AlertCircle size={12} /> {inputErrors.symbol}
              </span>
            )}

            {/* Alphabet chips box */}
            <div className="flex flex-wrap gap-2 pt-1">
              {alphabet.length === 0 ? (
                <span className="text-xs font-medium text-slate-500 italic">No hay símbolos agregados. Mínimo 1.</span>
              ) : (
                alphabet.map(sym => (
                  <span 
                    key={sym} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    <span>{sym}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSymbol(sym)}
                      className="hover:text-rose-400 transition-colors"
                      aria-label={`Eliminar símbolo ${sym}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Initial & Accepting Selection */}
        {states.length > 0 && (
          <div className="glass-panel p-6 border-slate-800 space-y-6">
            <h3 className="text-md font-bold text-slate-200 tracking-wide border-b border-slate-800 pb-3 mb-4">
              Configurar Estados Especiales
            </h3>

            {/* Initial State Select dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado Inicial (q0)</label>
              <select
                value={initialState}
                onChange={(e) => setInitialState(e.target.value)}
                className="glass-input text-sm w-full cursor-pointer bg-slate-950"
              >
                {states.map(s => (
                  <option key={s} value={s} className="bg-slate-950 text-slate-200">{s}</option>
                ))}
              </select>
            </div>

            {/* Accepting States Checkbox Grid */}
            <div className="flex flex-col gap-3 pt-3 border-t border-slate-900">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estados de Aceptación (F)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {states.map(s => {
                  const isChecked = acceptingStates.includes(s);
                  return (
                    <div 
                      key={s} 
                      onClick={() => handleToggleAccepting(s)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                        isChecked 
                          ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300' 
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Swallowed: handled by click
                        className="rounded text-brand-500 border-slate-700 focus:ring-0 focus:ring-offset-0 pointer-events-none"
                      />
                      <span className="text-xs font-bold font-mono">{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Card 4: Transitions Grid Table */}
        {states.length > 0 && alphabet.length > 0 && (
          <div className="glass-panel p-6 border-slate-800">
            <h3 className="text-md font-bold text-slate-200 tracking-wide border-b border-slate-800 pb-3 mb-4">
              Tabla de Transiciones (δ)
            </h3>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Origen (estado)</th>
                    {alphabet.map((sym, idx) => (
                      <th key={sym} className="py-2.5 px-3 text-center">
                        <span className="block">Símbolo {idx + 1}</span>
                        <span className="block font-mono text-brand-400 normal-case">{sym}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 font-mono text-xs">
                  {states.map(state => (
                    <tr key={state} className="hover:bg-slate-900/20">
                      <td className="py-3 px-3 text-slate-300 font-bold">{state}</td>
                      {alphabet.map(sym => {
                        const trans = transitions.find(t => t.from === state && t.symbol === sym);
                        return (
                          <td key={sym} className="py-2 px-3 text-center">
                            <select
                              value={trans ? trans.to : (states.includes(initialState) ? initialState : states[0])}
                              onChange={(e) => handleTransitionTargetChange(state, sym, e.target.value)}
                              className="glass-input py-1.5 px-2 bg-slate-950 text-slate-300 w-full max-w-[150px] cursor-pointer"
                            >
                              {states.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Buttons Row */}
        <div className="flex items-center gap-4">
          <Button 
            label={initialData ? 'Guardar Cambios' : 'Crear DFA'} 
            type="submit" 
            icon={Play}
            className="flex-1"
          />
          <Button 
            label="Limpiar Todo" 
            variant="secondary" 
            onClick={handleClear}
          />
          <Button 
            label="Cancelar" 
            variant="secondary" 
            onClick={onCancel}
          />
        </div>

        {/* Mensaje de bloqueo: explica EXACTAMENTE por qué no se puede guardar */}
        {!validationResult.isValid && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-900/40 bg-rose-950/20 px-3 py-2.5">
            <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-300 font-semibold leading-relaxed">
              <p>
                No se puede guardar todavía: faltan {validationResult.errors.length} requisito(s):
              </p>
              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                {validationResult.errors.slice(0, 4).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
                {validationResult.errors.length > 4 && (
                  <li>...y {validationResult.errors.length - 4} más (ver panel derecho).</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </form>

      {/* RIGHT: Live Preview & Validation (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Card A: Real-time Visualizer */}
        <DFADiagram 
          definition={mermaidCode} 
          title="Vista Previa en Tiempo Real"
          className="w-full h-full lg:sticky lg:top-20"
        />

        {/* Card B: Formal Validator Status */}
        <div className="glass-panel p-6 border-slate-800">
          <h3 className="text-md font-bold text-slate-200 tracking-wide border-b border-slate-800 pb-3 mb-4">
            Estatus de Validación Formal
          </h3>
          
          {states.length === 0 || alphabet.length === 0 ? (
            <div className="text-slate-500 text-xs italic">
              Define al menos un estado y un símbolo del alfabeto para iniciar la validación formal.
            </div>
          ) : validationResult.isValid ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulsing-ring shrink-0" />
                <span>Autómata Determinista Válido</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                El autómata cumple con los requisitos formales: es completamente determinista y tiene un mapeo de transición completo $Q \times \Sigma \rightarrow Q$.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span>No cumple con la formalidad ({validationResult.errors.length})</span>
              </div>
              <ul className="text-xs text-rose-300 space-y-1.5 list-disc pl-4 leading-relaxed font-semibold">
                {validationResult.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DFAForm;
