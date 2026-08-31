import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Trash2, CheckCircle, XCircle, Plus } from 'lucide-react';
import Button from '../common/Button';

/**
 * Renders list of all DFAs inside a searchable glassmorphic table
 */
export const DFAList = ({ 
  dfas, 
  onDelete 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter DFAs by search query
  const filteredDfas = dfas.filter(dfa => 
    dfa.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel p-6 border-slate-800 space-y-4">
      
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar autómata por nombre..."
            className="glass-input pl-10 text-sm w-full py-2"
          />
        </div>

        {/* Add New DFA Button */}
        <Button 
          label="Crear Nuevo DFA"
          icon={Plus}
          onClick={() => navigate('/create-dfa')}
          className="w-full sm:w-auto px-4 py-2 text-xs font-bold"
        />

      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-900 bg-slate-950/20">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-950/40">
              <th className="py-3.5 px-4 font-bold">Nombre</th>
              <th className="py-3.5 px-4 font-bold text-center">Estados (Q)</th>
              <th className="py-3.5 px-4 font-bold text-center">Alfabeto (Σ)</th>
              <th className="py-3.5 px-4 font-bold text-center">¿Válido?</th>
              <th className="py-3.5 px-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 font-sans text-xs">
            {filteredDfas.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 italic font-medium">
                  {searchTerm ? 'No se encontraron autómatas que coincidan.' : 'Aún no se han creado autómatas.'}
                </td>
              </tr>
            ) : (
              filteredDfas.map(dfa => (
                <tr key={dfa.id} className="hover:bg-slate-900/10 transition-colors">
                  
                  {/* Name */}
                  <td className="py-4 px-4 font-semibold text-slate-200">
                    <div className="flex flex-col gap-0.5">
                      <span>{dfa.name}</span>
                      {dfa.is_union && (
                        <span className="text-[9px] w-fit font-mono font-bold text-indigo-400 bg-indigo-950/50 px-1 py-0.5 rounded border border-indigo-900/40">
                          unión
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* State Count */}
                  <td className="py-4 px-4 text-center text-slate-300 font-mono font-semibold">
                    {dfa.states?.length || 0}
                  </td>
                  
                  {/* Alphabet Count */}
                  <td className="py-4 px-4 text-center text-slate-300 font-mono font-semibold">
                    {dfa.alphabet?.length || 0}
                  </td>
                  
                  {/* Validation badge */}
                  <td className="py-4 px-4 text-center">
                    {dfa.is_valid ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-1 rounded-full">
                        <CheckCircle size={12} /> Sí
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-rose-400 bg-rose-950/20 border border-rose-900/30 px-2.5 py-1 rounded-full">
                        <XCircle size={12} /> No
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <Button 
                        label="Ver"
                        variant="secondary"
                        icon={Eye}
                        onClick={() => navigate(`/dfa/${dfa.id}`)}
                        className="px-3 py-1.5 text-[10px]"
                      />
                      <Button 
                        label="Eliminar"
                        variant="danger"
                        icon={Trash2}
                        onClick={() => onDelete(dfa.id, dfa.name)}
                        className="px-3 py-1.5 text-[10px]"
                      />
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default DFAList;
