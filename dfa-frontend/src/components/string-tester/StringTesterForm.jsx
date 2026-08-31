import React, { useState, useEffect } from 'react';
import { Play, Sparkles, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import { useUnion } from '../../hooks/useUnion';

/**
 * Form to choose DFAs and input string to test
 */
export const StringTesterForm = ({ 
  dfas, 
  onTest, 
  loading,
  preselectedDfa1Id = '',
  preselectedUnionId = ''
}) => {
  const [dfa1Id, setDfa1Id] = useState('');
  const [dfa2Id, setDfa2Id] = useState('');
  const [unionId, setUnionId] = useState('');
  const [inputString, setInputString] = useState('');
  const [error, setError] = useState('');
  const [alphabetError, setAlphabetError] = useState('');

  const { createUnion, loading: unionLoading } = useUnion();

  const validDfas = dfas.filter(d => d.is_valid);

  // Initialize selections from query parameters or default
  useEffect(() => {
    if (preselectedUnionId) {
      const unionDfa = validDfas.find(d => d.id === preselectedUnionId);
      if (unionDfa) {
        setUnionId(preselectedUnionId);
        // Solo sobreescribe si la unión guardada conoce sus DFAs origen
        // (las uniones antiguas no traen dfa1_id/dfa2_id).
        if (unionDfa.dfa1_id) setDfa1Id(unionDfa.dfa1_id);
        if (unionDfa.dfa2_id) setDfa2Id(unionDfa.dfa2_id);
        return;
      }
    }

    if (preselectedDfa1Id && validDfas.some(d => d.id === preselectedDfa1Id)) {
      setDfa1Id(preselectedDfa1Id);
    } else if (validDfas.length > 0 && !dfa1Id) {
      setDfa1Id(validDfas[0].id);
    }
  }, [preselectedDfa1Id, preselectedUnionId, validDfas, dfa1Id]);

  // Set default DFA 2 selection
  useEffect(() => {
    if (dfa1Id && !dfa2Id && validDfas.length > 0) {
      // Prefiere un autómata distinto; si solo hay uno, usa él mismo
      // (probar M contra sí mismo es un caso válido).
      const other = validDfas.find(d => d.id !== dfa1Id);
      setDfa2Id(other ? other.id : dfa1Id);
    }
  }, [validDfas, dfa1Id, dfa2Id]);

  // Dynamically find the Union DFA matching the current selection
  useEffect(() => {
    if (dfa1Id && dfa2Id) {
      const d1 = validDfas.find(d => d.id === dfa1Id);
      const d2 = validDfas.find(d => d.id === dfa2Id);
      // Busca una unión existente por IDs origen (uniones nuevas) o por
      // el nombre "A UNION B" (uniones antiguas guardadas sin esos campos).
      const existingUnion = validDfas.find(d =>
        (d.dfa1_id === dfa1Id && d.dfa2_id === dfa2Id) ||
        (d.dfa2_id === dfa1Id && d.dfa1_id === dfa2Id) ||
        (d1 && d2 && d.name === `${d1.name} UNION ${d2.name}`)
      );
      setUnionId(existingUnion ? existingUnion.id : '');
    } else {
      setUnionId('');
    }
  }, [dfa1Id, dfa2Id, validDfas]);

  // Get active alphabets for live string validation
  const getCombinedAlphabet = () => {
    const symbols = new Set();
    const d1 = validDfas.find(d => d.id === dfa1Id);
    const d2 = validDfas.find(d => d.id === dfa2Id);
    
    if (d1?.alphabet) d1.alphabet.forEach(s => symbols.add(s));
    if (d2?.alphabet) d2.alphabet.forEach(s => symbols.add(s));
    
    return Array.from(symbols);
  };

  // Validate characters as the user types
  const handleStringChange = (val) => {
    setInputString(val);
    setAlphabetError('');

    if (val === '') return;

    const alphabet = getCombinedAlphabet();
    const alphabetSet = new Set(alphabet);

    for (let char of val) {
      if (!alphabetSet.has(char)) {
        setAlphabetError(`El carácter "${char}" no pertenece al alfabeto combinado [${alphabet.join(', ')}].`);
        return;
      }
    }
  };

  // Auto calculate union on the fly
  const handleAutoCreateUnion = async () => {
    if (!dfa1Id || !dfa2Id) return;
    try {
      const union = await createUnion(dfa1Id, dfa2Id);
      setUnionId(union.id);
    } catch (e) {
      setError('No se pudo crear la unión automática.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!dfa1Id || !dfa2Id) {
      setError('Por favor, selecciona al menos dos autómatas.');
      return;
    }

    // dfa1Id === dfa2Id está permitido: probar el mismo autómata en ambas
    // columnas y su unión consigo mismo (L(M) ∪ L(M) = L(M)).

    if (alphabetError) {
      setError('Corrige el error del alfabeto en la cadena.');
      return;
    }

    onTest(dfa1Id, dfa2Id, unionId || null, inputString);
  };

  const combinedAlphabet = getCombinedAlphabet();

  return (
    <div className="glass-panel p-6 border-slate-800">
      <h3 className="text-md font-bold text-slate-200 tracking-wide border-b border-slate-800 pb-3 mb-5">
        Configurar Prueba de Cadena
      </h3>

      {validDfas.length < 1 ? (
        <div className="text-center py-6 text-amber-400 flex flex-col items-center gap-3">
          <AlertTriangle size={32} className="text-amber-500/80 mb-1" />
          <p className="text-sm font-bold">Se requiere al menos 1 autómata válido para usar el probador triple.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* DFA Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* DFA 1 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Autómata 1 (M1)</label>
              <select
                value={dfa1Id}
                onChange={(e) => {
                  setDfa1Id(e.target.value);
                  setError('');
                }}
                className="glass-input text-sm w-full cursor-pointer bg-slate-950"
              >
                {validDfas.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.states?.length} estados)</option>
                ))}
              </select>
            </div>

            {/* DFA 2 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Autómata 2 (M2)</label>
              <select
                value={dfa2Id}
                onChange={(e) => {
                  setDfa2Id(e.target.value);
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

          {/* Union Auto-Generation Alert / Badge */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-400 block">Autómata Unión Relacionado (M1 ∪ M2)</span>
              {unionId ? (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <Sparkles size={12} /> Autómata unión detectado en el sistema
                </span>
              ) : (
                <span className="text-[11px] font-bold text-slate-500 italic">
                  Aún no se ha calculado la unión para estos dos autómatas.
                </span>
              )}
            </div>
            
            {!unionId && dfa1Id && dfa2Id && (
              <Button 
                label="Crear Unión Automática"
                variant="secondary"
                icon={Sparkles}
                onClick={handleAutoCreateUnion}
                loading={unionLoading}
                className="text-[10px] px-3 py-1.5"
              />
            )}
          </div>

          {/* Input String Field */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-900">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Cadena a Probar (w)
              </label>
              {combinedAlphabet.length > 0 && (
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                  Alfabeto combinado: [{combinedAlphabet.join(', ')}]
                </span>
              )}
            </div>
            <input 
              type="text"
              value={inputString}
              onChange={(e) => handleStringChange(e.target.value)}
              placeholder="Ej. 01010"
              className="glass-input text-sm w-full font-mono font-semibold"
            />
            
            {/* Live Input Warning alerts */}
            {alphabetError && (
              <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 mt-1">
                <AlertTriangle size={12} /> {alphabetError}
              </span>
            )}
            {error && (
              <span className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 mt-1">
                <AlertTriangle size={12} /> {error}
              </span>
            )}
          </div>

          <div className="flex justify-end">
            <Button 
              label="Probar Cadena (Veredicto Triple)"
              type="submit"
              loading={loading}
              disabled={!!alphabetError || !dfa1Id || !dfa2Id}
              icon={Play}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold"
            />
          </div>

        </form>
      )}

    </div>
  );
};

export default StringTesterForm;
