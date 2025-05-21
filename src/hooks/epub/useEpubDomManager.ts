
import { useState, useEffect } from 'react';
import { Book } from '@/lib/types';

interface UseEpubDomManagerProps {
  id: string | undefined;
  book: Book | null;
  viewerRef: React.RefObject<HTMLDivElement>;
}

export const useEpubDomManager = ({ id, book, viewerRef }: UseEpubDomManagerProps) => {
  const [viewerReady, setViewerReady] = useState(false);
  const [domCheckCounter, setDomCheckCounter] = useState(0);
  const [domPollingActive, setDomPollingActive] = useState(false);

  // Add additional check for DOM readiness with a polling mechanism
  useEffect(() => {
    if (!book?.epubPath || viewerReady) return;

    // Start polling for DOM element if we have the book data but viewer isn't ready
    if (!domPollingActive) {
      setDomPollingActive(true);
      
      const pollInterval = setInterval(() => {
        console.log("DOM polling check...");
        const viewerId = `epub-viewer-${id}`;
        const viewerElement = viewerRef.current || document.getElementById(viewerId);
        
        if (viewerElement) {
          console.log("DOM polling successful - viewer element found!");
          // We don't need to modify viewerRef.current as it's read-only
          // Instead we just use the reference we have
          
          clearInterval(pollInterval);
          setViewerReady(true);
          setDomPollingActive(false);
        } else {
          console.log("DOM polling - viewer element still not found");
          setDomCheckCounter(prev => prev + 1);
        }
      }, 300); // Check every 300ms
      
      // Clean up interval
      return () => {
        clearInterval(pollInterval);
        setDomPollingActive(false);
      };
    }
  }, [book?.epubPath, viewerReady, id, domPollingActive, viewerRef]);

  // Use useEffect (not useLayoutEffect) to ensure we don't cause recursive state updates
  // This fixes the "Maximum update depth exceeded" error
  useEffect(() => {
    if (!book?.epubPath) return;
    
    // Generate a unique ID for this component instance to ensure we can find it
    const viewerId = `epub-viewer-${id}`;
    
    // Check for our viewerRef and also look by ID as a backup
    const viewerElement = viewerRef.current || document.getElementById(viewerId);
    
    if (viewerElement) {
      console.log("Viewer element found:", viewerElement);
      
      // Only set viewer as ready if it's not already set
      if (!viewerReady) {
        setViewerReady(true);
      }
    } else {
      console.log("Viewer element not found in DOM");
      
      // If we've been waiting for the DOM for a while, retry later
      // But only update state if needed to avoid update loops
      if (domCheckCounter > 8 && !viewerReady) {
        console.log("Multiple attempts to find viewer element failed, delaying...");
        // Use setTimeout to break the update cycle
        const timer = setTimeout(() => {
          setDomCheckCounter(prev => prev + 1);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }
  }, [domCheckCounter, id, book?.epubPath, viewerRef, viewerReady]);

  return {
    viewerReady,
    setViewerReady,
    domCheckCounter,
    setDomCheckCounter
  };
};
