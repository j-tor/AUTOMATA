import React from 'react';
import { CheckCircle2, AlertOctagon, Edit3, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

/**
 * Renders validation feedback for DFA creation or manual validation trigger
 */
export const DFAValidator = ({ 
  isValid, 
  errors = [], 
  onEdit, 
  onCreateAnother, 
  onGoToDashboard 
}) => {
  return (
    <div className={`glass-panel p-6 border ${isValid ? 'border-emerald-800/80 bg-emerald-950/10' : 'border-rose-800/80 bg-rose-950/10'}`}>
      
      {/* Header Status */}
      <div className="flex items-center gap-3 border-b pb-4 mb-4 border-slate-800">
        {isValid ? (
          <>
            <CheckCircle2 className="text-emerald-400 shrink-0 pulsing-ring" size={24} />
            <div>
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">¡DFA Válido y Guardado!</h4>
              <p className="text-xs text-slate-400">El autómata fue almacenado con éxito.</p>
            </div>
          </>
        ) : (
          <>
            <AlertOctagon className="text-rose-400 shrink-0" size={24} />
            <div>
              <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider">Validación Formal Fallida</h4>
              <p className="text-xs text-slate-400">Corrige los siguientes errores antes de guardar.</p>
            </div>
          </>
        )}
      </div>

      {/* Errors list if invalid */}
      {!isValid && errors.length > 0 && (
        <div className="mb-6">
          <ul className="space-y-2 text-xs text-rose-300 font-semibold list-disc pl-5">
            {errors.map((err, idx) => (
              <li key={idx} className="leading-relaxed">{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons based on status */}
      <div className="flex flex-wrap gap-3 pt-2">
        {isValid ? (
          <>
            <Button 
              label="Ver en Dashboard" 
              onClick={onGoToDashboard} 
              icon={ArrowRight} 
              className="text-xs px-4"
            />
            <Button 
              label="Crear Otro" 
              variant="secondary" 
              onClick={onCreateAnother} 
              className="text-xs px-4"
            />
          </>
        ) : (
          <Button 
            label="Editar Autómata" 
            onClick={onEdit} 
            icon={Edit3} 
            className="text-xs px-4"
          />
        )}
      </div>

    </div>
  );
};

export default DFAValidator;
