
import { useState, useEffect, useRef } from 'react';
import { Book } from '@/lib/types';

interface UseEpubDomManagerProps {
  id: string | undefined;
  book: Book | null;
  viewerRef: React.RefObject<HTMLDivElement>;
}

export const useEpubDomManager = ({ id, book, viewerRef }: UseEpubDomManagerProps) => {
  const [viewerReady, setViewerReady] = useState(false);
  const [domCheckCounter, setDomCheckCounter] = useState(0);
  const domPollingActive = useRef(false);

  // Check for DOM element once when book data changes
  useEffect(() => {
    if (!book?.epubPath || viewerReady) return;
    
    const viewerId = `epub-viewer-${id}`;
    const viewerElement = viewerRef.current || document.getElementById(viewerId);
    
    if (viewerElement) {
      console.log("Initial check: Viewer element found:", viewerElement);
      setViewerReady(true);
    } else if (!domPollingActive.current) {
      // Only set up polling if we haven't found the element yet and polling isn't active
      console.log("Initial check: Viewer element not found, setting up polling");
      setDomCheckCounter(c => c + 1);
    }
  }, [book?.epubPath, id, viewerRef, viewerReady]);

  // Use a separate effect for polling to avoid recursive updates
  useEffect(() => {
    if (!book?.epubPath || viewerReady || domPollingActive.current) return;
    
    console.log("Setting up DOM polling...");
    domPollingActive.current = true;
    
    const pollInterval = setInterval(() => {
      const viewerId = `epub-viewer-${id}`;
      const viewerElement = viewerRef.current || document.getElementById(viewerId);
      
      if (viewerElement) {
        console.log("DOM polling successful - viewer element found!");
        clearInterval(pollInterval);
        setViewerReady(true);
        domPollingActive.current = false;
      } else {
        console.log("DOM polling - viewer element still not found");
        // We don't update the counter here to avoid causing render loops
      }
    }, 500); // Check every 500ms
    
    return () => {
      clearInterval(pollInterval);
      domPollingActive.current = false;
    };
  }, [book?.epubPath, viewerReady, id, viewerRef, domCheckCounter]);

  // Reset viewer ready state when book changes
  useEffect(() => {
    setViewerReady(false);
  }, [id, book]);

  return {
    viewerReady,
    setViewerReady,
    domCheckCounter,
    setDomCheckCounter
  };
};
