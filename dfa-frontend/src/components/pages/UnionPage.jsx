import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDFA } from '../../hooks/useDFA';
import { useUnion } from '../../hooks/useUnion';
import { useUICtx } from '../../context/UIContext';
import UnionSelector from '../union/UnionSelector';
import UnionResult from '../union/UnionResult';

/**
 * Page component that coordinates selecting two DFAs and computing their Union
 */
export const UnionPage = () => {
  const location = useLocation();
  const { dfas, loading: dfasLoading } = useDFA();
  const { createUnion, loading: unionLoading, result, setResult } = useUnion();
  const { showAlert } = useUICtx();

  // Extract optional query parameters e.g. /union?dfa1=xyz
  const queryParams = new URLSearchParams(location.search);
  const preselectedDfa1Id = queryParams.get('dfa1') || '';

  const handleUnionSubmit = async (dfa1Id, dfa2Id) => {
    try {
      const response = await createUnion(dfa1Id, dfa2Id);
      showAlert('success', `La unión "${response.name}" fue generada con éxito.`);
    } catch (e) {
      showAlert('error', e.message || 'No se pudo realizar la unión.');
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-900 pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-100 font-sans">
          Unión de Autómatas Finitos
        </h2>
        <p className="text-xs font-semibold text-slate-500">
          Une los lenguajes de dos autómatas deterministas mediante el autómata producto.
        </p>
      </div>

      {/* Conditionally render Selector or Results */}
      {result ? (
        <UnionResult 
          unionDfa={result} 
          onReset={handleReset} 
        />
      ) : (
        <UnionSelector 
          dfas={dfas} 
          onUnion={handleUnionSubmit} 
          loading={unionLoading || dfasLoading}
          preselectedDfa1Id={preselectedDfa1Id}
        />
      )}

    </div>
  );
};

export default UnionPage;
