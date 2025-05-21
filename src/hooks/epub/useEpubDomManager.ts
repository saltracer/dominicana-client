
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
  const domChecksAttempted = useRef(0);

  // Check for DOM element once when book data changes
  useEffect(() => {
    if (!book?.epubPath) return;
    
    // Reset viewer ready when book changes
    setViewerReady(false);
    
    const checkViewerElement = () => {
      const viewerId = `epub-viewer-${id}`;
      const viewerElement = viewerRef.current || document.getElementById(viewerId);
      
      if (viewerElement) {
        console.log("Viewer element found:", viewerElement);
        
        // Ensure the viewer element is properly prepared for rendering
        if (viewerElement.dataset?.initialized !== 'true') {
          viewerElement.dataset.initialized = 'true';
          viewerElement.dataset.viewerId = viewerId;
          
          // Clear any previous content to ensure a clean slate
          // But preserve the loading state if it's present
          const hasLoadingContent = viewerElement.querySelectorAll('.animate-spin').length > 0;
          if (!hasLoadingContent) {
            console.log("Preparing viewer element for initialization");
          }
        }
        
        setViewerReady(true);
        domPollingActive.current = false;
        return true;
      }
      
      return false;
    };
    
    // Try immediate check first
    if (checkViewerElement()) return;
    
    // Set up polling if immediate check fails
    if (!domPollingActive.current) {
      console.log("Setting up DOM polling...");
      domPollingActive.current = true;
      
      const pollInterval = setInterval(() => {
        domChecksAttempted.current++;
        
        if (checkViewerElement()) {
          clearInterval(pollInterval);
        } else if (domChecksAttempted.current > 20) {
          // After 20 attempts (10 seconds), give up polling
          console.log("DOM polling timed out - viewer element not found after multiple attempts");
          clearInterval(pollInterval);
          domPollingActive.current = false;
        } else {
          console.log(`DOM polling - viewer element still not found (attempt ${domChecksAttempted.current})`);
          setDomCheckCounter(c => c + 1);
        }
      }, 500); // Check every 500ms
      
      return () => {
        clearInterval(pollInterval);
        domPollingActive.current = false;
      };
    }
  }, [book?.epubPath, id, viewerRef]);

  return {
    viewerReady,
    setViewerReady,
    domCheckCounter
  };
};
