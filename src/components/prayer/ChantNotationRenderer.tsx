
import React, { useEffect, useRef, useState, useCallback } from 'react';

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
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const renderChant = useCallback(async () => {
    if (!containerRef.current || !gabc) return;

    try {
      setLoading(true);
      setError(null);
      
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Check if exsurge is available
      if (!window.exsurge) {
        throw new Error('Exsurge library not loaded');
      }

      // Clear previous content
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      // Set up rendering context
      const ctxt = new window.exsurge.ChantContext();
      ctxt.lyricTextFont = "'Crimson Text', serif";
      ctxt.lyricTextSize = 16;
      ctxt.dropCapTextFont = "'Crimson Text', serif";

      // Parse the GABC notation
      const mappings = window.exsurge.Gabc.createMappingsFromSource(ctxt, gabc);
      const score = new window.exsurge.ChantScore(ctxt, mappings, true);
      
      // Perform layout with current container width
      score.performLayout(ctxt);
      const containerWidth = containerRef.current?.offsetWidth;
      //console.log("Performing layout: Container width is:", containerWidth);
      score.layoutChantLines(ctxt, containerWidth || 1000);
      
      // Create and append SVG element
      const svgElement = score.createSvg(ctxt);
      if (containerRef.current) {
        containerRef.current.innerHTML = svgElement;
      }
      
    } catch (err) {
      console.error('Error rendering chant notation:', err);
      setError(err instanceof Error ? err.message : 'Failed to render chant notation');
    } finally {
      setLoading(false);
    }
  }, [gabc]);

  // Load exsurge and set up initial render
  useEffect(() => {
    let mounted = true;
    let script: HTMLScriptElement | null = null;

    const loadLibrary = async () => {
      if (!window.exsurge) {
        return new Promise<void>((resolve) => {
          script = document.createElement('script');
          script.src = '/exsurge/exsurge.min.js';
          script.onload = () => {
            if (mounted) {
              setLibraryLoaded(true);
              resolve();
            }
          };
          script.onerror = () => {
            if (mounted) {
              setError('Failed to load Exsurge library');
              setLoading(false);
            }
          };
          document.head.appendChild(script);
        });
      }
      return Promise.resolve();
    };

    const initialize = async () => {
      try {
        await loadLibrary();
        if (mounted) {
          await renderChant();
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };

    initialize();

    // Set up ResizeObserver
    if (containerRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize && containerRef.current) {
            renderChant();
          }
        }
      });

      resizeObserverRef.current.observe(containerRef.current);
    }

    return () => {
      mounted = false;
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (script && script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [gabc, renderChant]);

  if (loading) {
    return (
      <div ref={containerRef} className={className}>
        {description && (
          <p className="text-sm text-amber-700 mb-2">{description}</p>
        )}
        <div className="chant-notation-container p-4 rounded overflow-x-auto min-h-[100px] flex items-center justify-center">
          <div className="text-amber-700">Loading chant notation...</div>
        </div>
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
        className="chant-notation-container p-4 rounded overflow-x-auto min-h-[100px]"
      >
        {loading && (
          <div className="text-center text-amber-700">
            Loading chant notation...
          </div>
        )}
      </div>
      {error && (
        <div className="text-red-600 mt-2">
          <p>Unable to display chant notation</p>
          <details className="text-sm mt-1">
            <summary>Error details</summary>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default ChantNotationRenderer;
