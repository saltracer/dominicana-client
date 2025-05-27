
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
      if (!containerRef.current || !gabc) {
        setLoading(false);  
        return;
      }

      try {
        setLoading(true);
        setError(null);
console.log("Trying to render a chant");
        // Clear previous content
        containerRef.current.innerHTML = '';

        // Check if exsurge is available
        if (!window.exsurge) {
          throw new Error('Exsurge library not loaded');
        }
console.log("Exsurge is loaded");
        // Create a new score using exsurge
        //const score = new window.exsurge.ChantScore();
        
        // Set up rendering context
        const ctxt = new window.exsurge.ChantContext();
        ctxt.lyricTextFont = "'Crimson Text', serif";
        ctxt.lyricTextSize = 16;
        ctxt.dropCapTextFont = "'Crimson Text', serif";
        console.log("Setting up the context", ctxt);
        console.log('Parsing the GABC notation:', gabc)
        // Parse the GABC notation
        const mappings = window.exsurge.Gabc.createMappingsFromSource(ctxt, gabc);
        const score = new window.exsurge.ChantScore(ctxt, mappings, true);
        
        console.log("Parsed the GABC notation", score);
        // Perform layout
        score.performLayout(ctxt);
        score.layoutChantLines(ctxt, 1000);
        console.log("Layout complete");
        // Create SVG element
        const svgElement = score.createSvg(ctxt);
        console.log("SVG element created");
        // Append to container
        console.log("Applying the SVG element to the container", containerRef.current);
        containerRef.current.appendChild(svgElement);
        console.log("SVG element appended");
        setLoading(false); //Setting loading to false after a successful render
      
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
      script.src = '/exsurge/exsurge.min.js';
      script.onload = () => {
        console.log('Exsurge loaded successfully');
        renderChant();  
      };
      script.onerror = () => {
        console.error('Failed to load Exsurge script');
        setError('Failed to load chant notation library');
        setLoading(false);
      };
      console.log('Appending script:', script.src);
      document.head.appendChild(script);
    } else {
      console.log('Exsurge already loaded');
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
