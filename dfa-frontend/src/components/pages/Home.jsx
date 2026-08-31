import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Layout, GitMerge, FileText, Cpu, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

/**
 * Landing Page explaining DFA theory and linking to core modules
 */
export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-12">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-xl shadow-brand-500/20 mb-4 pulsing-ring">
          <Cpu size={28} className="text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-slate-300 bg-clip-text text-transparent">
          SISTEMA DE AUTÓMATAS FINITOS
        </h1>
        <p className="text-lg text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
          Diseña, valida y ejecuta autómatas finitos deterministas de forma visual e interactiva. Realiza operaciones complejas como la unión de lenguajes formales mediante el autómata producto.
        </p>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Card 1: Create DFA */}
        <div className="glass-panel p-6 border-slate-800 glass-panel-hover flex flex-col justify-between min-h-[220px]">
          <div className="space-y-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-brand-950/40 border border-brand-500/30 text-brand-400">
              <Plus size={20} />
            </div>
            <h3 className="text-md font-bold text-slate-200">Crear DFA</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Define estados, alfabeto y transiciones de forma interactiva con validación formal y diagramas en tiempo real.
            </p>
          </div>
          <Button 
            label="Comenzar a Crear" 
            onClick={() => navigate('/create-dfa')} 
            className="w-full text-xs mt-4 py-2"
          />
        </div>

        {/* Card 2: View DFAs */}
        <div className="glass-panel p-6 border-slate-800 glass-panel-hover flex flex-col justify-between min-h-[220px]">
          <div className="space-y-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-400">
              <Layout size={20} />
            </div>
            <h3 className="text-md font-bold text-slate-200">Ver Dashboard</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Explora y gestiona los autómatas guardados. Revisa especificaciones, tablas de transiciones y topología de red.
            </p>
          </div>
          <Button 
            label="Ver Catálogo" 
            variant="secondary"
            onClick={() => navigate('/dashboard')} 
            className="w-full text-xs mt-4 py-2"
          />
        </div>

        {/* Card 3: Union */}
        <div className="glass-panel p-6 border-slate-800 glass-panel-hover flex flex-col justify-between min-h-[220px]">
          <div className="space-y-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <GitMerge size={20} />
            </div>
            <h3 className="text-md font-bold text-slate-200">Hacer Unión</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Combina dos autómatas válidos para generar su autómata producto, uniendo los lenguajes formales definidos.
            </p>
          </div>
          <Button 
            label="Calcular Unión" 
            variant="secondary"
            onClick={() => navigate('/union')} 
            className="w-full text-xs mt-4 py-2"
          />
        </div>

      </div>

      {/* Theoretical Context section */}
      <div className="glass-panel p-8 border-slate-800 space-y-5 animate-in fade-in duration-1000">
        <div className="flex items-center gap-3 border-b border-slate-850 pb-4 mb-2">
          <FileText className="text-brand-400 shrink-0" size={22} />
          <h3 className="text-lg font-bold text-slate-200">¿Qué es un Autómata Finito Determinista (DFA)?</h3>
        </div>
        
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium">
          <p>
            En la teoría de la computación, un **DFA** (por sus siglas en inglés, *Deterministic Finite Automaton*) es un modelo matemático de computación que consta de un conjunto finito de estados y transiciones. Se utiliza para decidir si una cadena pertenece a un lenguaje formal o no.
          </p>
          <p>
            Formalmente, un autómata finito determinista se define como una tupla de 5 elementos:
            M = (Q, Σ, δ, q₀, F)
          </p>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-3 pt-2 text-slate-400 font-semibold font-mono text-xs">
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-brand-500 shrink-0 mt-0.5" />
              <span>Q: Conjunto finito de estados</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-brand-500 shrink-0 mt-0.5" />
              <span>Σ: Alfabeto (símbolos de entrada)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-brand-500 shrink-0 mt-0.5" />
              <span>δ: Función de transición (Q x Σ → Q)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-brand-500 shrink-0 mt-0.5" />
              <span>q0: Estado inicial (q0 ∈ Q)</span>
            </li>
            <li className="flex items-start gap-2 col-span-1 sm:col-span-2">
              <CheckCircle size={14} className="text-brand-500 shrink-0 mt-0.5" />
              <span>F: Conjunto de estados de aceptación (F ⊆ Q)</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default Home;
