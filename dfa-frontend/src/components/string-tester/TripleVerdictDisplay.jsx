import React, { useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';

/**
 * Renders the triple verdict details and synchronizes stepping animations
 */
export const TripleVerdictDisplay = ({
  string,
  dfa1,
  dfa2,
  unionDfa,
  trace1,
  trace2,
  traceUnion,
  activeStep,
  setActiveStep,
  isPlaying,
  setIsPlaying
}) => {
  const stepsCount = string.length;

  // Auto-play stepping logic
  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setActiveStep(current => {
          if (current >= stepsCount) {
            setIsPlaying(false);
            return current;
          }
          return current + 1;
        });
      }, 1000); // 1 step per second
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, stepsCount, setActiveStep, setIsPlaying]);

  // Stepping actions
  const handlePrev = () => {
    setIsPlaying(false);
    setActiveStep(curr => Math.max(curr - 1, 0));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setActiveStep(curr => Math.min(curr + 1, stepsCount));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep(0);
  };

  const handleTogglePlay = () => {
    if (activeStep >= stepsCount) {
      setActiveStep(0);
    }
    setIsPlaying(!isPlaying);
  };

    // Helper: extrae el nombre de estado sin importar si path usa
  // objetos {state,symbol} (backend nuevo) o strings (formato legacy).
  const stepState = (p) => (p && typeof p === 'object' ? (p.state ?? p.symbol ?? '?') : (p ?? '?'));
  const stepSymbol = (p, idx) => {
    if (p && typeof p === 'object') return p.symbol ?? null;
    return idx > 0 ? string[idx - 1] : null;
  };

  // Helpers to resolve current "Estado Actual" text from a trace.
  const currentStepLabel = (trace) => {
    if (!trace || !trace.path) return '—';
    const p = trace.path[activeStep];
    if (!p) return 'Rechazo';
    return stepState(p);
  };

  // Helper to render path step text
  const renderPathFlow = (trace, activeIdx) => {
    if (!trace || !trace.path) return null;
    const path = trace.path;
    
    return (
      <div className="flex flex-wrap items-center gap-1 font-mono text-[11px] p-3 bg-slate-950/60 rounded-xl border border-slate-900 overflow-x-auto select-none">
        {path.map((state, idx) => {
          const isPassed = idx < activeIdx;
          const isActive = idx === activeIdx;
          const symbolConsumed = stepSymbol(state, idx);

          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <div className="flex flex-col items-center shrink-0 mx-0.5">
                  <span className={`text-[9px] font-bold ${isPassed ? 'text-brand-400' : 'text-slate-600'}`}>
                    {symbolConsumed}
                  </span>
                  <ChevronRight 
                    size={12} 
                    className={isPassed ? 'text-brand-500' : 'text-slate-700'} 
                  />
                </div>
              )}
              <span 
                className={`px-2 py-1 rounded font-bold transition-all duration-300 border ${
                  isActive 
                    ? 'bg-brand-950 border-brand-500 text-brand-300 pulsing-ring ring-1 ring-brand-500/30 scale-105 shadow-md shadow-brand-500/10' 
                    : isPassed 
                      ? 'bg-slate-900/60 border-slate-800 text-slate-400' 
                      : 'bg-slate-950/20 border-slate-950/40 text-slate-700'
                }`}
              >
                {stepState(state)}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Helper: renders the explicit δ (delta extendido) notation text, e.g.
  //   δ(1, a) = 2   /   δ((q0), b) = (q5)
  // step 0 shows the initial configuration δ'(q0, ε) = q0.
  const renderDeltaNotation = (trace, label) => {
    if (!trace || !trace.path) return null;
    const path = trace.path;
    const totalTransitions = path.length - 1;

    const passed = (i) => i > 0 && i < activeStep;        // transición ya recorrida
    const active = (i) => i === activeStep && i > 0 && i <= totalTransitions; // en curso
    const pending = (i) => i > activeStep && i <= totalTransitions; // por venir

    return (
      <div className="mt-3">
        <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">δ — Delta Extendido ({label})</span>
          {activeStep === totalTransitions && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              trace.accepted
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
            }`}>
              {trace.accepted ? 'ACEPTADA' : 'RECHAZADA'}
            </span>
          )}
        </div>

        <div className="font-mono text-[11px] space-y-0.5 select-none">
          {/* Configuración inicial: δ'(q₀, ε) = q₀ */}
          {trace.path[0] !== undefined && (
            <div className={`flex items-center gap-1.5 ${activeStep === 0 ? 'text-brand-300 font-bold' : 'text-slate-400'}`}>
              <span>δ&apos;(</span><span className="font-bold">{stepState(path[0])}</span><span>, ε) = </span><span className="font-bold">{stepState(path[0])}</span>
              <span className={`ml-auto text-[9px] ${activeStep === 0 ? 'text-brand-400' : 'text-slate-600'}`}>Paso 0</span>
            </div>
          )}

          {/* Transiciones: δ(qᵢ₋₁, símbolo) = qᵢ  para i = 1..totalTransitions */}
          {Array.from({ length: totalTransitions }, (_, i) => {
            const idx = i + 1;
            const fromSt = stepState(path[idx - 1]);
            const toSt = stepState(path[idx]);
            const sym = stepSymbol(path[idx], idx);
            const cls = passed(idx) ? 'text-emerald-400' : active(idx) ? 'text-brand-300 font-bold animate-pulse' : pending(idx) ? 'text-slate-600' : 'text-slate-500';
            return (
              <div key={idx} className={`flex items-center gap-1.5 ${cls}`}>
                <span>δ(</span>
                <span className="font-bold">{fromSt}</span>
                <span>, &#39;{sym ?? '?'}&#39;) = </span>
                <span className="font-bold">{toSt}</span>
              </div>
            );
          })}

          {/* Veredicto Final al terminar */}
          {activeStep === totalTransitions && (
            <div className={`flex items-center gap-1.5 pt-1 mt-1 border-t border-slate-900/60 ${trace.accepted ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span>Veredicto:</span>
              <span className="font-bold">{trace.accepted ? 'Cadena ACEPTADA' : 'Cadena RECHAZADA'}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 border-slate-800 space-y-6">
      
      {/* Simulation Playback controls */}
      <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Simulador de Trazabilidad</span>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Paso:</span>
            <span className="font-bold text-brand-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
              {activeStep} / {stepsCount}
            </span>
            {activeStep > 0 && (
              <>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Leyendo:</span>
                <span className="font-bold text-slate-200 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                  "{string.substring(0, activeStep)}"
                </span>
              </>
            )}
          </div>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all active:scale-95"
            title="Reiniciar simulación"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            onClick={handlePrev}
            disabled={activeStep === 0}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            title="Paso anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <Button 
            label={isPlaying ? 'Pausa' : 'Reproducir'}
            icon={isPlaying ? Pause : Play}
            onClick={handleTogglePlay}
            variant={isPlaying ? 'secondary' : 'primary'}
            className="px-4 py-2 text-xs"
          />
          <button 
            onClick={handleNext}
            disabled={activeStep === stepsCount}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            title="Paso siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Range Slider */}
        <div className="w-full md:w-48 flex items-center gap-3">
          <input 
            type="range"
            min={0}
            max={stepsCount}
            value={activeStep}
            onChange={(e) => {
              setIsPlaying(false);
              setActiveStep(parseInt(e.target.value, 10));
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
        </div>

      </div>

      {/* Triple Verdict Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* DFA 1 */}
        {trace1 && (
          <div className="glass-panel p-5 border-slate-800 bg-slate-900/10 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                <span className="text-xs font-bold text-slate-400">Autómata 1 ({dfa1?.name})</span>
                {activeStep === stepsCount && (
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    trace1.accepted 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                  }`}>
                    {trace1.accepted ? 'Aceptada' : 'Rechazada'}
                  </span>
                )}
              </div>
              
              {/* Path Flow */}
                            {renderPathFlow(trace1, activeStep)}
              {renderDeltaNotation(trace1, 'M1')}
            </div>

            {/* Verdict details */}
            <div className="mt-4 pt-3 border-t border-slate-950/40 text-[10px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Estado Actual:</span>
                                <span className="font-mono font-bold text-slate-300">{currentStepLabel(trace1)}</span>
              </div>
              {activeStep === stepsCount && (
                <div className="flex justify-between">
                  <span>Veredicto Final:</span>
                  <span className={`font-bold ${trace1.accepted ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trace1.accepted ? 'ACEPTADA' : 'RECHAZADA'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DFA 2 */}
        {trace2 && (
          <div className="glass-panel p-5 border-slate-800 bg-slate-900/10 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                <span className="text-xs font-bold text-slate-400">Autómata 2 ({dfa2?.name})</span>
                {activeStep === stepsCount && (
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    trace2.accepted 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                  }`}>
                    {trace2.accepted ? 'Aceptada' : 'Rechazada'}
                  </span>
                )}
              </div>
              
              {/* Path Flow */}
                            {renderPathFlow(trace2, activeStep)}
              {renderDeltaNotation(trace2, 'M2')}
            </div>

            {/* Verdict details */}
            <div className="mt-4 pt-3 border-t border-slate-950/40 text-[10px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Estado Actual:</span>
                                <span className="font-mono font-bold text-slate-300">{currentStepLabel(trace2)}</span>
              </div>
              {activeStep === stepsCount && (
                <div className="flex justify-between">
                  <span>Veredicto Final:</span>
                  <span className={`font-bold ${trace2.accepted ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trace2.accepted ? 'ACEPTADA' : 'RECHAZADA'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* UNION DFA */}
        {traceUnion && (
          <div className="glass-panel p-5 border-slate-800 bg-slate-900/10 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                <span className="text-xs font-bold text-slate-400">Unión (M1 ∪ M2)</span>
                {activeStep === stepsCount && (
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    traceUnion.accepted 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                  }`}>
                    {traceUnion.accepted ? 'Aceptada' : 'Rechazada'}
                  </span>
                )}
              </div>
              
              {/* Path Flow */}
                            {renderPathFlow(traceUnion, activeStep)}
              {renderDeltaNotation(traceUnion, 'Unión')}
            </div>

            {/* Verdict details */}
            <div className="mt-4 pt-3 border-t border-slate-950/40 text-[10px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Estado Actual:</span>
                                <span className="font-mono font-bold text-slate-300">{currentStepLabel(traceUnion)}</span>
              </div>
              {activeStep === stepsCount && (
                <div className="flex flex-col gap-1 mt-1 pt-1 border-t border-slate-900/60">
                  <div className="flex justify-between">
                    <span>Aceptada por M1:</span>
                    <span className={trace1?.accepted ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {trace1?.accepted ? 'SÍ' : 'NO'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aceptada por M2:</span>
                    <span className={trace2?.accepted ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {trace2?.accepted ? 'SÍ' : 'NO'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-900/40 pt-1 mt-1 text-[11px]">
                    <span className="text-slate-400">Unión (M1 ∪ M2):</span>
                    <span className={`font-bold ${traceUnion.accepted ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {traceUnion.accepted ? 'ACEPTADA' : 'RECHAZADA'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default TripleVerdictDisplay;
