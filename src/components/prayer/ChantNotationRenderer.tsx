
import React, { useEffect, useRef, useState } from 'react';
import { ChantResource, LanguageCode } from '@/lib/liturgical/types/liturgy-types';

interface ChantNotationRendererProps {
  chant: ChantResource;
  preferredLanguage: LanguageCode;
  fallbackLanguage?: LanguageCode;
  className?: string;
}

declare global {
  interface Window {
    exsurge: any;
  }
}

const ChantNotationRenderer: React.FC<ChantNotationRendererProps> = ({ 
  chant, 
  preferredLanguage,
  fallbackLanguage = 'la',
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the appropriate GABC data based on language preferences
  const getGabcData = (): string | null => {
    if (chant.data[preferredLanguage]) {
      return chant.data[preferredLanguage];
    }
    if (fallbackLanguage && chant.data[fallbackLanguage]) {
      return chant.data[fallbackLanguage];
    }
    // If no preferred languages available, get the first available
    const firstAvailable = Object.keys(chant.data)[0];
    return firstAvailable ? chant.data[firstAvailable] : null;
  };

  // Get the appropriate description based on language preferences
  const getDescription = (): string | undefined => {
    if (!chant.description) return undefined;
    
    if (chant.description[preferredLanguage]) {
      return chant.description[preferredLanguage][0];
    }
    if (fallbackLanguage && chant.description[fallbackLanguage]) {
      return chant.description[fallbackLanguage][0];
    }
    // If no preferred languages available, get the first available
    const firstAvailable = Object.keys(chant.description)[0];
    return firstAvailable ? chant.description[firstAvailable][0] : undefined;
  };

  useEffect(() => {
    let mounted = true;

    const loadLibrary = async () => {
      if (!window.exsurge) {
        return new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/exsurge/exsurge.min.js';
          script.onload = () => {
            if (mounted) {
              resolve();
            }
          };
          script.onerror = () => {
            if (mounted) {
              reject(new Error('Failed to load Exsurge library'));
            }
          };
          document.body.appendChild(script);
        });
      }
      return Promise.resolve();
    };

    const renderChant = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const gabcData = getGabcData();
        if (!gabcData) {
          throw new Error('No GABC data available for selected language');
        }

        await loadLibrary();

        // Check mounted state after async operation
        if (!mounted) return;

        // Check again after async operation
        if (!containerRef.current) {
          setError('Container ref lost after async operation');
          return;
        }

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Check if exsurge is available
        if (!window.exsurge) {
          throw new Error('Exsurge library not loaded');
        }

        // Create a new score using exsurge
        const ctxt = new window.exsurge.ChantContext();
        ctxt.lyricTextFont = "'Crimson Text', serif";
        ctxt.lyricTextSize = 16;
        ctxt.dropCapTextFont = "'Crimson Text', serif";
        
        // Parse the GABC notation
        const mappings = window.exsurge.Gabc.createMappingsFromSource(ctxt, gabcData);
        const score = new window.exsurge.ChantScore(ctxt, mappings, true);
        
        // Perform layout
        score.performLayout(ctxt);
        score.layoutChantLines(ctxt, 1000);
        
        // Create SVG element
        const svgElement = score.createSvg(ctxt);
        
        // Append to container
        containerRef.current.innerHTML = svgElement;
        setLoading(false);
      } catch (err) {
        console.error('Error rendering chant notation:', err);
        setError(err instanceof Error ? err.message : 'Failed to render chant notation');
        setLoading(false);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    renderChant();

    return () => {
      mounted = false;
    };
  }, [chant, preferredLanguage, fallbackLanguage]);

  const description = getDescription();

  return (
    <div className={className}>
      {description && (
        <p className="text-sm text-amber-700 mb-2">{description}</p>
      )}
      <div 
        ref={containerRef}
        className="chant-notation-container bg-white p-4 rounded border border-amber-300 overflow-x-auto min-h-[100px]"
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
