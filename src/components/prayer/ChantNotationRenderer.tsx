
import React, { useEffect, useRef, useState } from 'react';

interface ChantNotationRendererProps {
  gabc: string;
  description?: string;
  className?: string;
}

declare global {
  interface Window {
    exsurge: any;
  }
}

const ChantNotationRenderer: React.FC<ChantNotationRendererProps> = ({ 
  gabc, 
  description, 
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const renderChant = async () => {
      if (!containerRef.current || !gabc) return;

      try {
        setLoading(true);
        setError(null);

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Check if exsurge is available
        if (!window.exsurge) {
          throw new Error('Exsurge library not loaded');
        }

        // Create a new score using exsurge
        const score = new window.exsurge.ChantScore();
        
        // Parse the GABC notation
        const chantMapping = new window.exsurge.ChantMapping();
        chantMapping.mapText(gabc);
        
        // Add the mapping to the score
        score.appendFromChantMapping(chantMapping);
        
        // Set up rendering context
        const ctxt = new window.exsurge.ChantContext();
        ctxt.lyricTextFont = "'Crimson Text', serif";
        ctxt.lyricTextSize = 16;
        ctxt.dropCapTextFont = "'Crimson Text', serif";
        
        // Perform layout
        score.performLayout(ctxt);
        
        // Create SVG element
        const svgElement = score.createSvg(ctxt);
        
        // Append to container
        containerRef.current.appendChild(svgElement);
        
      } catch (err) {
        console.error('Error rendering chant notation:', err);
        setError(err instanceof Error ? err.message : 'Failed to render chant notation');
      } finally {
        setLoading(false);
      }
    };

    // Load exsurge if not already loaded
    if (!window.exsurge) {
      const script = document.createElement('script');
      script.src = '/src/lib/exsurge/exsurge.min.js';
      script.onload = () => renderChant();
      script.onerror = () => {
        setError('Failed to load chant notation library');
        setLoading(false);
      };
      document.head.appendChild(script);
    } else {
      renderChant();
    }
  }, [gabc]);

  if (loading) {
    return (
      <div className={`p-4 text-center text-amber-700 ${className}`}>
        Loading chant notation...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 text-center text-red-600 ${className}`}>
        <p className="text-sm">Unable to display chant notation</p>
        {description && <p className="text-xs mt-1">{description}</p>}
        <details className="text-xs mt-2">
          <summary>Error details</summary>
          <p className="mt-1 font-mono">{error}</p>
        </details>
      </div>
    );
  }

  return (
    <div className={className}>
      {description && (
        <p className="text-sm text-amber-700 mb-2">{description}</p>
      )}
      <div 
        ref={containerRef}
        className="chant-notation-container bg-white p-4 rounded border border-amber-300 overflow-x-auto"
        style={{ minHeight: '100px' }}
      />
    </div>
  );
};

export default ChantNotationRenderer;
