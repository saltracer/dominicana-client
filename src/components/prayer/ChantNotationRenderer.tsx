
import React, { useEffect, useRef, useState } from 'react';
import { LiturgyService } from '@/lib/liturgical/services/liturgy-service';
import { ChantResource } from '@/lib/liturgical/types/liturgy-types';

interface ChantNotationRendererProps {
  chant: ChantResource;
  preferences: any;
  className?: string;
}

declare global {
  interface Window {
    exsurge: any;
  }
}

const ChantNotationRenderer: React.FC<ChantNotationRendererProps> = ({ 
  chant, 
  preferences,
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const renderChant = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the GABC data for the user's preferred language
        const gabcLines = LiturgyService.renderContent(chant.data, preferences);
        const gabc = gabcLines.join('');
        
        if (!gabc || !containerRef.current) {
          setError('No chant data available');
          setLoading(false);
          return;
        }

        // Load exsurge library if not already loaded
        if (!window.exsurge) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/exsurge/exsurge.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Exsurge library'));
            document.head.appendChild(script);
          });
        }

        if (!mounted) return;

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
        const mappings = window.exsurge.Gabc.createMappingsFromSource(ctxt, gabc);
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
      }
    };

    renderChant();

    return () => {
      mounted = false;
    };
  }, [chant, preferences]);

  const description = chant.description ? LiturgyService.renderContent(chant.description, preferences) : [];

  return (
    <div className={className}>
      {description.length > 0 && (
        <p className="text-sm text-amber-700 mb-2">{description[0]}</p>
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
