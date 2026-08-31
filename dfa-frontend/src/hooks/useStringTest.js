import { useState, useCallback } from 'react';
import { stringService } from '../services/string-service';

export const useStringTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const testString = useCallback(async (dfa1Id, dfa2Id, unionId, string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await stringService.testString(dfa1Id, dfa2Id, unionId, string);
      setResult(response);
      return response;
    } catch (err) {
      console.error('Error during string test:', err);
      const errMsg = err.message || 'Error al validar la cadena de caracteres.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetTest = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    result,
    testString,
    resetTest
  };
};
