import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cpu, Server, Wifi, WifiOff } from 'lucide-react';
import { useDfaCtx } from '../../context/DFAContext';

/**
 * Premium Navbar with Connection Status Badge
 */
export const Navbar = () => {
  const { isOnline } = useDfaCtx();

  // Navigation Links Definition
  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/create-dfa', label: 'Crear DFA' },
    { to: '/union', label: 'Hacer Unión' },
    { to: '/test-string', label: 'Probar Cadenas' }
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slatebg-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md shadow-brand-500/20">
              <Cpu size={20} className="text-white" />
            </div>
            <span className="font-sans font-bold text-lg bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              DFA Automata
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-all duration-200 hover:text-brand-400 ${
                    isActive 
                      ? 'text-brand-400 border-b-2 border-brand-500 py-1' 
                      : 'text-slate-400 py-1'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Server Status Indicators */}
          <div className="flex items-center gap-3">
            <div 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold select-none border transition-all duration-300 ${
                isOnline 
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' 
                  : 'bg-indigo-950/30 border-brand-500/30 text-brand-300'
              }`}
              title={isOnline ? 'Servidor C++ conectado' : 'Utilizando motor JavaScript local'}
            >
              {isOnline ? (
                <>
                  <Wifi size={14} className="animate-pulse" />
                  <span>Online (C++)</span>
                </>
              ) : (
                <>
                  <WifiOff size={14} />
                  <span>Modo Local</span>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Links (Rendered for small devices) */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-900 bg-slatebg-950/90 py-2.5 px-2">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `text-xs font-bold tracking-tight transition-colors ${
                isActive ? 'text-brand-400' : 'text-slate-500'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
