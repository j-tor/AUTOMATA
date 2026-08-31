import { useState, useCallback } from 'react';
import { unionService } from '../services/union-service';
import { useDfaCtx } from '../context/DFAContext';

export const useUnion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const { fetchDFAs } = useDfaCtx();

  const createUnion = useCallback(async (dfa1Id, dfa2Id) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await unionService.createUnion(dfa1Id, dfa2Id);
      setResult(response);
      // Refresh global list of DFAs so the unioned DFA shows up in the dashboard
      await fetchDFAs();
      return response;
    } catch (err) {
      console.error('Error in union operation:', err);
      const errMsg = err.message || 'Error al realizar la unión de los autómatas.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  }, [fetchDFAs]);

  return {
    loading,
    error,
    result,
    createUnion,
    setResult
  };
};
