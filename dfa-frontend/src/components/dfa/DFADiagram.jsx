import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';
import { Download, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import Button from '../common/Button';

// Initialize mermaid once outside component lifecycle
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Outfit, Inter, sans-serif',
  themeVariables: {
    background: 'transparent',
    primaryColor: '#8b5cf6', // Violet
    primaryTextColor: '#f8fafc',
    lineColor: '#475569',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a'
  }
});

/**
 * Renders DFA using Mermaid.js with error handling & zooming
 */
export const DFADiagram = ({ 
  definition, 
  title = 'Diagrama del Autómata',
  className = '' 
}) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!definition || definition.trim() === '') {
      setSvg('');
      setError(false);
      return;
    }

    const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
    setError(false);

    const renderGraph = async () => {
      try {
        // Clean container of old styles/svgs to avoid duplicate IDs
        const container = document.getElementById('mermaid-temp-render-box');
        if (container) container.innerHTML = '';

        const { svg: svgHtml } = await mermaid.render(uniqueId, definition);
        setSvg(svgHtml);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(true);
        
        // Reset mermaid internal state error flags if any
        try {
          const badSvg = document.getElementById(uniqueId);
          if (badSvg) badSvg.remove();
        } catch (e) {}
      }
    };

    renderGraph();
  }, [definition]);

  // Download SVG file handler
  const downloadSvg = () => {
    if (!svg) return;
    try {
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_diagram.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error downloading SVG:', e);
    }
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.15, 2));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.15, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className={`glass-panel p-5 flex flex-col items-center justify-between border border-slate-800 ${className}`}>
      
      {/* Invisible box for mermaid to do background rendering */}
      <div id="mermaid-temp-render-box" className="hidden" />

      {/* Header controls */}
      <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <h4 className="text-sm font-bold text-slate-300 tracking-wide">{title}</h4>
        
        {svg && !error && (
          <div className="flex items-center gap-2">
            <button 
              onClick={handleZoomOut}
              className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
              title="Alejar"
            >
              <ZoomOut size={16} />
            </button>
            <button 
              onClick={handleResetZoom}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors px-1"
              title="Restaurar zoom"
            >
              {(zoom * 100).toFixed(0)}%
            </button>
            <button 
              onClick={handleZoomIn}
              className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
              title="Acercar"
            >
              <ZoomIn size={16} />
            </button>
            <div className="h-4 w-px bg-slate-800 mx-1" />
            <button 
              onClick={downloadSvg}
              className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
              title="Descargar SVG"
            >
              <Download size={16} />
              <span className="text-xs font-semibold hidden sm:inline">Exportar</span>
            </button>
          </div>
        )}
      </div>

      {/* Diagram Area */}
      <div className="w-full flex items-center justify-center min-h-[260px] bg-slate-950/40 rounded-xl border border-slate-900/60 p-4 overflow-auto">
        {error ? (
          <div className="flex flex-col items-center gap-2 text-rose-400 text-sm">
            <RefreshCw size={24} className="animate-spin text-rose-500/60 mb-2" />
            <p className="font-bold">Error al generar la estructura del diagrama.</p>
            <span className="text-xs text-slate-500">Asegúrate de definir estados y transiciones válidas.</span>
          </div>
        ) : svg ? (
          <div 
            ref={containerRef}
            className="flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <span className="text-sm text-slate-500 font-medium">No hay datos suficientes para graficar el autómata.</span>
        )}
      </div>

      {/* Legend */}
      {svg && !error && (
        <div className="w-full mt-4 flex flex-wrap gap-4 items-center justify-center text-xs text-slate-400 border-t border-slate-900/60 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-blue-500/50 bg-slate-900" />
            <span>Inicio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-slate-600 bg-slate-900" />
            <span>Estado normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full border border-emerald-500 bg-emerald-950/20" style={{ boxShadow: '0 0 0 2px #0f172a inset' }} />
            <span>Aceptación</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full border border-brand-400 bg-brand-950" />
            <span>Paso Activo</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default DFADiagram;
