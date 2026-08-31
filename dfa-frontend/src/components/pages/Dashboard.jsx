import React, { useState } from 'react';
import { useDFA } from '../../hooks/useDFA';
import { useUICtx } from '../../context/UIContext';
import DFAList from '../dfa/DFAList';
import DFADelete from '../dfa/DFADelete';

/**
 * Dashboard listing all DFAs with search filtering and deletion trigger
 */
export const Dashboard = () => {
  const { dfas, loading, deleteDFA } = useDFA();
  const { showAlert } = useUICtx();

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dfaToDelete, setDfaToDelete] = useState({ id: '', name: '' });

  const handleDeleteClick = (id, name) => {
    setDfaToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDFA(dfaToDelete.id);
      showAlert('success', `El autómata "${dfaToDelete.name}" fue eliminado correctamente.`);
    } catch (e) {
      showAlert('error', e.message || 'No se pudo eliminar el autómata.');
    } finally {
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-900 pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-100 font-sans">
          Dashboard de Autómatas
        </h2>
        <p className="text-xs font-semibold text-slate-500">
          Visualiza, administra y haz operaciones en tu conjunto de DFAs.
        </p>
      </div>

      {/* Main List */}
      {loading && dfas.length === 0 ? (
        <div className="glass-panel p-8 text-center text-slate-500 italic font-semibold">
          Cargando catálogo de autómatas...
        </div>
      ) : (
        <DFAList dfas={dfas} onDelete={handleDeleteClick} />
      )}

      {/* Delete Confirmation Modal Wrapper */}
      <DFADelete 
        isOpen={deleteModalOpen}
        dfaName={dfaToDelete.name}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};

export default Dashboard;
