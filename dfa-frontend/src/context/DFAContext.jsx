import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { dfaService } from '../services/dfa-service';
import { checkBackendStatus } from '../services/api';
import { validateDFA } from '../utils/dfa-engine';

const DFAContext = createContext(null);

export const DFAProvider = ({ children }) => {
  const [dfas, setDfas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  // Checks backend health status and updates state
  const refreshBackendStatus = useCallback(async () => {
    const online = await checkBackendStatus();
    setIsOnline(online);
    return online;
  }, []);

  // Fetches list of all DFAs
  const fetchDFAs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await refreshBackendStatus();
      const list = await dfaService.getDFAList();
      // Normalize: ensure every DFA has an explicit is_valid flag.
      // Legacy DFAs may have been stored WITHOUT it (e.g. saved before the
      // union feature existed), which made the Union page ignore them
      // because it filters by `d.is_valid`. We recompute it with the
      // local validation engine when missing.
      const normalized = (list || []).map((dfa) => {
        const valid = dfa.is_valid === true || validateDFA(dfa).isValid;
        return { ...dfa, is_valid: valid };
      });

      console.log(`[DFAContext] fetchDFAs: ${normalized.length} autómata(s) recuperado(s) del backend.`);
      normalized.forEach((dfa) => {
        console.log(
          `  -> ${dfa.id ?? 'sin-id'} "${dfa.name}" | ${dfa.states?.length ?? 0} estados | is_valid=${dfa.is_valid}`
        );
      });

      setDfas(normalized);
    } catch (err) {
      console.error('[DFAContext] Error fetching DFAs:', err);
      setError(err.message || 'Error al obtener la lista de autómatas.');
    } finally {
      setLoading(false);
    }
  }, [refreshBackendStatus]);

  // Create or Update DFA
  const createDFA = useCallback(async (dfaData) => {
    setLoading(true);
    try {
      // DEBUG: muestra exactamente la carga que se manda al backend
      console.log('[DFAContext] createDFA: enviando al backend POST /dfa/create');
      console.log('[DFAContext] createDFA: payload ->', JSON.stringify(dfaData, null, 2));

      const saved = await dfaService.createDFA(dfaData);

      // DEBUG: el backend responde el autómata tal como quedó guardado (con su id)
      console.log('[DFAContext] createDFA: el backend respondió (guardado) -> ', saved);

      await fetchDFAs();

      console.log(`[DFAContext] createDFA: ¡Autómata "${saved?.name}" guardado correctamente! id=${saved?.id ?? '?'}`);
      return saved;
    } catch (err) {
      console.error('[DFAContext] Error creating DFA:', err);
      throw new Error(err.message || 'No se pudo guardar el autómata.');
    } finally {
      setLoading(false);
    }
  }, [fetchDFAs]);

  // Delete DFA
  const deleteDFA = useCallback(async (id) => {
    setLoading(true);
    try {
      await dfaService.deleteDFA(id);
      await fetchDFAs();
    } catch (err) {
      console.error('Error deleting DFA:', err);
      throw new Error(err.message || 'No se pudo eliminar el autómata.');
    } finally {
      setLoading(false);
    }
  }, [fetchDFAs]);

  // Retrieve DFA details
  const getDFA = useCallback(async (id) => {
    setLoading(true);
    try {
      return await dfaService.getDFA(id);
    } catch (err) {
      console.error(`Error loading DFA ${id}:`, err);
      throw new Error(err.message || 'Error al cargar el detalle del autómata.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch list once on mount
  useEffect(() => {
    fetchDFAs();
  }, [fetchDFAs]);

  const value = {
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

  return <DFAContext.Provider value={value}>{children}</DFAContext.Provider>;
};

export const useDfaCtx = () => {
  const context = useContext(DFAContext);
  if (!context) {
    throw new Error('useDfaCtx debe ser usado dentro de un DFAProvider');
  }
  return context;
};
