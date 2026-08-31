import React, { useEffect } from 'react';
import { XCircle } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Confirmation Modal with Backdrop Blur
 */
export const Modal = ({
  isOpen,
  title,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onClose,
  onConfirm,
  isDanger = false,
  children
}) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slatebg-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg glass-panel p-6 overflow-hidden shadow-2xl border border-slate-800/80 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-xl font-bold text-slate-100 tracking-tight">
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-rose-400 transition-colors focus:outline-none"
            aria-label="Cerrar modal"
          >
            <XCircle size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="my-5 text-slate-300 text-sm leading-relaxed">
          {children}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button 
            label={cancelLabel} 
            variant="secondary" 
            onClick={onClose}
            className="px-4 py-2 text-sm"
          />
          <Button 
            label={confirmLabel} 
            variant={isDanger ? 'danger' : 'primary'} 
            onClick={onConfirm}
            className="px-4 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
