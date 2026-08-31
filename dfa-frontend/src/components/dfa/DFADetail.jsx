import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Link, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Button from '../common/Button';
import DFADiagram from './DFADiagram';
import { dfaToMermaid } from '../../utils/formatters';

/**
 * Detailed View Component for a Single DFA
 */
export const DFADetail = ({ 
  dfa, 
  onDelete 
}) => {
  const navigate = useNavigate();
  const [mermaidCode, setMermaidCode] = useState('');

  useEffect(() => {
    if (dfa) {
      setMermaidCode(dfaToMermaid(dfa));
    }
  }, [dfa]);

  if (!dfa) {
    return (
      <div className="glass-panel p-8 text-center text-slate-500 italic">
        Cargando detalles del autómata...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Button 
          label="Volver al Dashboard"
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate('/dashboard')}
          className="w-full sm:w-auto text-xs"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            label="Probar Cadena"
            icon={Play}
            onClick={() => navigate(`/test-string?dfa1=${dfa.id}`)}
            className="flex-1 sm:flex-none text-xs"
          />
          <Button 
            label="Hacer Unión"
            variant="secondary"
            icon={Link}
            onClick={() => navigate(`/union?dfa1=${dfa.id}`)}
            className="flex-1 sm:flex-none text-xs"
          />
          <Button 
            label="Eliminar"
            variant="danger"
            icon={Trash2}
            onClick={() => onDelete(dfa.id, dfa.name)}
            className="flex-1 sm:flex-none text-xs"
          />
        </div>
      </div>

      {/* Main Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Structural Specs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Specifications Summary */}
          <div className="glass-panel p-6 border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="text-md font-bold text-slate-200 tracking-wide">
                Especificación Formal
              </h3>
              <div 
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                  dfa.is_valid 
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                }`}
              >
                {dfa.is_valid ? <CheckCircle size={10} /> : <XCircle size={10} />}
                <span>{dfa.is_valid ? 'Formal' : 'Inválido'}</span>
              </div>
            </div>

            <div className="space-y-4 text-sm font-sans">
              {/* States Q */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Estados (Q)</label>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {dfa.states?.map(s => (
                    <span 
                      key={s} 
                      className={`px-2 py-1 rounded border ${
                        s === dfa.initial_state 
                          ? 'bg-blue-950/20 border-blue-500/40 text-blue-300' 
                          : dfa.accepting_states?.includes(s) 
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      {s}
                      {s === dfa.initial_state && ' (I)'}
                      {dfa.accepting_states?.includes(s) && ' (F)'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Alphabet */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Alfabeto (Σ)</label>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {dfa.alphabet?.map(sym => (
                    <span key={sym} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-brand-400 font-bold">
                      {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* Initial State */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Estado Inicial</label>
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/30 px-2 py-1 rounded border border-blue-900/40">
                    {dfa.initial_state}
                  </span>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Estados Finales</label>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/40">
                    {dfa.accepting_states?.join(', ') || 'Ninguno'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Transition Function Table */}
          <div className="glass-panel p-6 border-slate-800">
            <h3 className="text-md font-bold text-slate-200 tracking-wide border-b border-slate-800 pb-3 mb-4">
              Tabla de Transiciones (δ)
            </h3>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Origen (estado)</th>
                    {dfa.alphabet?.map((sym, idx) => (
                      <th key={sym} className="py-2.5 px-3 text-center">
                        <span className="block">Símbolo {idx + 1}</span>
                        <span className="block font-mono text-brand-400 normal-case">{sym}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 font-mono text-xs text-slate-300">
                  {dfa.states?.map(state => {
                    const isAccepting = dfa.accepting_states?.includes(state);
                    const isInitial = state === dfa.initial_state;

                    return (
                      <tr key={state} className="hover:bg-slate-900/10">
                        <td className="py-3.5 px-3 font-bold text-slate-200">
                          <span className={isInitial ? 'text-blue-400' : isAccepting ? 'text-emerald-400' : ''}>
                            {state}
                          </span>
                          {isInitial && <span className="text-[9px] ml-1 text-blue-500 font-sans font-bold">(I)</span>}
                          {isAccepting && <span className="text-[9px] ml-1 text-emerald-500 font-sans font-bold">(F)</span>}
                        </td>
                        {dfa.alphabet?.map(sym => {
                          const trans = dfa.transitions?.find(t => t.from === state && t.symbol === sym);
                          const target = trans ? trans.to : '-';
                          const isTargetAccepting = dfa.accepting_states?.includes(target);
                          const isTargetInitial = target === dfa.initial_state;

                          return (
                            <td key={sym} className="py-3.5 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded ${
                                isTargetInitial 
                                  ? 'bg-blue-950/20 text-blue-400 border border-blue-900/30' 
                                  : isTargetAccepting 
                                    ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' 
                                    : 'text-slate-400'
                              }`}>
                                {target}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT: Visual Rendering (7 Cols) */}
        <div className="lg:col-span-7">
          <DFADiagram 
            definition={mermaidCode} 
            title={`Topología del Autómata: ${dfa.name}`}
            className="w-full h-full"
          />
        </div>

      </div>

    </div>
  );
};

export default DFADetail;
