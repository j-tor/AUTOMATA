import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Reusable Premium Alert Toast Component
 */
export const Alert = ({
  type = 'success',
  message,
  onClose
}) => {
  // Styles configuration based on alert type
  const config = {
    success: {
      bg: 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200',
      icon: <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
    },
    error: {
      bg: 'bg-rose-950/40 border-rose-800/80 text-rose-200',
      icon: <AlertCircle className="text-rose-400 shrink-0" size={20} />
    },
    warning: {
      bg: 'bg-amber-950/40 border-amber-800/80 text-amber-200',
      icon: <AlertTriangle className="text-amber-400 shrink-0" size={20} />
    },
    info: {
      bg: 'bg-sky-950/40 border-sky-800/80 text-sky-200',
      icon: <Info className="text-sky-400 shrink-0" size={20} />
    }
  };

  const { bg, icon } = config[type] || config.success;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-4 border rounded-xl backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${bg}`}>
      {icon}
      <span className="text-sm font-medium tracking-wide">{message}</span>
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-4 hover:opacity-80 transition-opacity focus:outline-none"
          aria-label="Cerrar alerta"
        >
          <X size={16} className="text-current" />
        </button>
      )}
    </div>
  );
};

export default Alert;
