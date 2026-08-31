import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDFA } from '../../hooks/useDFA';
import { useUICtx } from '../../context/UIContext';
import DFADetail from '../dfa/DFADetail';
import DFADelete from '../dfa/DFADelete';

/**
 * Page wrapper loading single DFA from database by URL params
 */
export const DFADetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDFA, deleteDFA } = useDFA();
  const { showAlert } = useUICtx();

  const [dfa, setDfa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch DFA on load or ID change
  useEffect(() => {
    const loadDfa = async () => {
      setLoading(true);
      try {
        const data = await getDFA(id);
        setDfa(data);
      } catch (e) {
        showAlert('error', e.message || 'No se pudo cargar el autómata.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) loadDfa();
  }, [id, getDFA, navigate, showAlert]);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDFA(id);
      showAlert('success', `El autómata "${dfa.name}" fue eliminado.`);
      navigate('/dashboard');
    } catch (e) {
      showAlert('error', e.message || 'No se pudo eliminar el autómata.');
    } finally {
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-slate-500 italic font-semibold">
        Cargando detalles del autómata...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="flex flex-col gap-1 border-b border-slate-900 pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-100 font-sans">
          Detalle del Autómata: <span className="text-brand-400 font-mono">"{dfa?.name}"</span>
        </h2>
        <p className="text-xs font-semibold text-slate-500">
          Explora la especificación de transiciones y la visualización gráfica de este autómata.
        </p>
      </div>

      {/* Detail Component */}
      <DFADetail dfa={dfa} onDelete={handleDeleteClick} />

      {/* Delete Modal Confirmation Dialog */}
      <DFADelete 
        isOpen={deleteModalOpen}
        dfaName={dfa?.name || ''}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};

export default DFADetailPage;
