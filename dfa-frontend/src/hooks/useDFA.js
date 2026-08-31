import { useDfaCtx } from '../context/DFAContext';

export const useDFA = () => {
  const { 
    dfas, 
    loading, 
    error,
    isOnline, 
    fetchDFAs, 
    createDFA, 
    deleteDFA, 
    getDFA,
    refreshBackendStatus 
  } = useDfaCtx();

  return {
    dfas,
    loading,
    error,
    isOnline,
    fetchDFAs,
    createDFA,
    deleteDFA,
    getDFA,
    refreshBackendStatus
  };
};
