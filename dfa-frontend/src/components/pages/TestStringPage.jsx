import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDFA } from '../../hooks/useDFA';
import { useStringTest } from '../../hooks/useStringTest';
import { useUICtx } from '../../context/UIContext';
import StringTesterForm from '../string-tester/StringTesterForm';
import TripleVerdictDisplay from '../string-tester/TripleVerdictDisplay';
import StringTesterResult from '../string-tester/StringTesterResult';
import Button from '../common/Button';
import { ArrowLeft } from 'lucide-react';

/**
 * Page component coordinating multiple DFA string simulations, verdicts and diagrams
 */
export const TestStringPage = () => {
  const location = useLocation();
  const { dfas } = useDFA();
  const { testString, loading, result, resetTest } = useStringTest();
  const { showAlert } = useUICtx();

  // Local configurations
  const [testedString, setTestedString] = useState('');
  const [selectedDfa1, setSelectedDfa1] = useState(null);
  const [selectedDfa2, setSelectedDfa2] = useState(null);
  const [selectedUnionDfa, setSelectedUnionDfa] = useState(null);

  // Synced stepping states
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Query Params pre-selection
  const queryParams = new URLSearchParams(location.search);
  const preselectedDfa1Id = queryParams.get('dfa1') || '';
  const preselectedUnionId = queryParams.get('union') || '';

  const handleTestSubmit = async (dfa1Id, dfa2Id, unionDfaId, string) => {
    try {
      // Find full dfa objects in catalog
      const d1 = dfas.find(d => d.id === dfa1Id);
      const d2 = dfas.find(d => d.id === dfa2Id);
      const du = dfas.find(d => d.id === unionDfaId);

      setSelectedDfa1(d1 || null);
      setSelectedDfa2(d2 || null);
      setSelectedUnionDfa(du || null);
      setTestedString(string);

      // Trigger service calculations
      await testString(dfa1Id, dfa2Id, unionDfaId, string);
      
      // Reset simulator pointer
      setActiveStep(0);
      setIsPlaying(false);
      
      showAlert('info', 'Simulación de trazabilidad generada. Utiliza los controles de reproducción.');
    } catch (e) {
      showAlert('error', e.message || 'No se pudo simular la cadena.');
    }
  };

  const handleClear = () => {
    resetTest();
    setTestedString('');
    setSelectedDfa1(null);
    setSelectedDfa2(null);
    setSelectedUnionDfa(null);
    setActiveStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-900 pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-100 font-sans">
          Probar Cadenas (Probador Triple)
        </h2>
        <p className="text-xs font-semibold text-slate-500">
          Valida cadenas en dos autómatas y su unión de manera paralela con trazabilidad animada.
        </p>
      </div>

      {/* Conditionally render inputs or trace animation dashboard */}
      {result ? (
        <div className="space-y-6">
          
          {/* Action Header */}
          <div className="flex justify-between items-center">
            <Button 
              label="Probar Otra Cadena"
              variant="secondary"
              icon={ArrowLeft}
              onClick={handleClear}
              className="text-xs"
            />
            <span className="font-mono text-sm text-slate-400 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-xl">
              Cadena evaluada: <strong className="text-brand-400">"{testedString}"</strong>
            </span>
          </div>

          {/* Stepping controls and side-by-side path tracer */}
          <TripleVerdictDisplay
            string={testedString}
            dfa1={selectedDfa1}
            dfa2={selectedDfa2}
            unionDfa={selectedUnionDfa}
            trace1={result.dfa1}
            trace2={result.dfa2}
            traceUnion={result.union}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />

          {/* Synchronized Graph topological visualizer */}
          <StringTesterResult
            dfa1={selectedDfa1}
            dfa2={selectedDfa2}
            unionDfa={selectedUnionDfa}
            trace1={result.dfa1}
            trace2={result.dfa2}
            traceUnion={result.union}
            activeStep={activeStep}
          />

        </div>
      ) : (
        <StringTesterForm
          dfas={dfas}
          onTest={handleTestSubmit}
          loading={loading}
          preselectedDfa1Id={preselectedDfa1Id}
          preselectedUnionId={preselectedUnionId}
        />
      )}

    </div>
  );
};

export default TestStringPage;
