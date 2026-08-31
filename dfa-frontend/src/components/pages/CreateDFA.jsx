import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDFA } from '../../hooks/useDFA';
import { useUICtx } from '../../context/UIContext';
import DFAForm from '../dfa/DFAForm';
import DFAValidator from '../dfa/DFAValidator';

/**
 * Page component for creating a new DFA and displaying validation feedback
 */
export const CreateDFA = () => {
  const navigate = useNavigate();
  const { createDFA } = useDFA();
  const { showAlert } = useUICtx();
  const [savedDfa, setSavedDfa] = useState(null);

  const handleSubmit = async (dfaData) => {
    console.log('[CreateDFA] handleSubmit recibido, enviando a createDFA():', dfaData?.name);
    try {
      const saved = await createDFA(dfaData);
      console.log('[CreateDFA] createDFA() resolvió satisfactoriamente:', saved);
      setSavedDfa(saved);
      showAlert('success', `El autómata "${saved.name}" fue creado y validado correctamente.`);
    } catch (e) {
      console.error('[CreateDFA] createDFA() lanzó error:', e);
      showAlert('error', e.message || 'No se pudo guardar el autómata.');
    }
  };

  const handleCreateAnother = () => {
    setSavedDfa(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-900 pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-100 font-sans">
          Diseñar Autómata Finito Determinista
        </h2>
        <p className="text-xs font-semibold text-slate-500">
          Registra un nuevo autómata formal paso a paso.
        </p>
      </div>

      {/* Conditionally render Form or Validator Feedback Screen */}
      {savedDfa ? (
        <div className="max-w-2xl mx-auto py-6">
          <DFAValidator
            isValid={true}
            errors={[]}
            onGoToDashboard={() => navigate('/dashboard')}
            onCreateAnother={handleCreateAnother}
            onEdit={() => navigate(`/dfa/${savedDfa.id}`)}
          />
        </div>
      ) : (
        <DFAForm 
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard')}
        />
      )}

    </div>
  );
};

export default CreateDFA;
