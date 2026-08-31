import React from 'react';
import Modal from '../common/Modal';
import { AlertCircle } from 'lucide-react';

/**
 * DFA Delete Confirmation Dialog Component
 */
export const DFADelete = ({ 
  isOpen, 
  dfaName, 
  onClose, 
  onConfirm 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title="Confirmar Eliminación"
      confirmLabel="Eliminar permanentemente"
      cancelLabel="Cancelar"
      onClose={onClose}
      onConfirm={onConfirm}
      isDanger={true}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
        <div className="space-y-1">
          <p className="font-bold text-slate-200 text-sm">
            ¿Estás seguro de que deseas eliminar el autómata "{dfaName}"?
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Esta acción es permanente y no se puede deshacer. Se eliminarán todas las configuraciones asociadas, transiciones y registros guardados.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default DFADelete;
