import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Play, ArrowLeft, GitMerge } from 'lucide-react';
import Button from '../common/Button';
import UnionDiagram from './UnionDiagram';

/**
 * Renders statistical summary and diagram of the computed Union DFA
 */
export const UnionResult = ({ 
  unionDfa,
  onReset 
}) => {
  const navigate = useNavigate();

  if (!unionDfa) return null;

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Button 
          label="Nueva Unión"
          variant="secondary"
          icon={ArrowLeft}
          onClick={onReset}
          className="w-full sm:w-auto text-xs"
        />
        <Button 
          label="Probar Cadenas en esta Unión"
          icon={Play}
          onClick={() => navigate(`/test-string?union=${unionDfa.id}`)}
          className="w-full sm:w-auto text-xs"
        />
      </div>

      {/* Grid: Stats and Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Stats (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Success message & Specs */}
          <div className="glass-panel p-6 border-slate-800 space-y-4">
            
            <div className="flex items-center gap-3 border-b border-slate-900 pb-4 mb-2">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
                <GitMerge size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Unión Calculada</h4>
                <p className="text-xs text-slate-500 font-semibold">Producto Autómata completado.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Product State summary */}
              <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                <span className="text-slate-400 font-medium">Nombre del Autómata</span>
                <span className="font-bold text-slate-200 font-mono">{unionDfa.name}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                <span className="text-slate-400 font-medium">Estados Compuestos (|Q|)</span>
                <span className="font-bold text-slate-200 font-mono">{unionDfa.states?.length} estados</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                <span className="text-slate-400 font-medium">Estados de Aceptación (|F|)</span>
                <span className="font-bold text-emerald-400 font-mono">{unionDfa.accepting_states?.length} estados</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                <span className="text-slate-400 font-medium">Alfabeto (Σ)</span>
                <span className="font-bold text-brand-400 font-mono">[{unionDfa.alphabet?.join(', ')}]</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                <span className="text-slate-400 font-medium">Estado Inicial</span>
                <span className="font-bold text-blue-400 font-mono">{unionDfa.initial_state}</span>
              </div>

            </div>
          </div>

          {/* Explanation Text */}
          <div className="glass-panel p-6 border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-slate-300">¿Cómo se calcula el producto?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              El autómata resultante es el **producto cartesiano** de los estados de M₁ y M₂. Cada estado se denota como (q₁, q₂).
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Las transiciones se computan de forma simultánea: δ_union((q₁, q₂), a) = (δ₁(q₁, a), δ₂(q₂, a)).
              Un estado compuesto (q₁, q₂) es de aceptación si q₁ es final en M₁ o q₂ es final en M₂, representando matemáticamente la unión de sus lenguajes formales: L(M_union) = L(M₁) ∪ L(M₂).
            </p>
          </div>

        </div>

        {/* RIGHT: Visual (7 Cols) */}
        <div className="lg:col-span-7">
          <UnionDiagram unionDfa={unionDfa} />
        </div>

      </div>

    </div>
  );
};

export default UnionResult;
