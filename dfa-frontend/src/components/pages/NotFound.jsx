import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import Button from '../common/Button';

/**
 * 404 Page Component
 */
export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center space-y-6">
      
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 mb-2">
        <AlertCircle size={28} />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 font-sans">
          404 - Página No Encontrada
        </h2>
        <p className="text-sm font-semibold text-slate-500 leading-relaxed">
          Lo sentimos, la página que buscas no existe o fue trasladada a otra sección.
        </p>
      </div>

      <div className="pt-4">
        <Button 
          label="Volver al Inicio"
          icon={Home}
          onClick={() => navigate('/')}
          className="w-full text-xs py-2.5"
        />
      </div>

    </div>
  );
};

export default NotFound;
