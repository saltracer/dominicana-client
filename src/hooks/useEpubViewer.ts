
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Book } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import ePub from 'epubjs';

interface UseEpubViewerProps {
  id: string | undefined;
  book: Book | null;
  viewerRef: React.RefObject<HTMLDivElement>;
}

export const useEpubViewer = ({ id, book, viewerRef }: UseEpubViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<string>("initializing");
  const [viewerReady, setViewerReady] = useState(false);
  const [domCheckCounter, setDomCheckCounter] = useState(0);
  const [domPollingActive, setDomPollingActive] = useState(false);
  const renditionRef = useRef<any>(null);
  const bookRef = useRef<any>(null);

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
          if (!viewerRef.current && viewerElement) {
            viewerRef.current = viewerElement as HTMLDivElement;
          }
          
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
  }, [book?.epubPath, viewerReady, id, domPollingActive]);

  // Use useLayoutEffect to ensure DOM is ready and check viewer ref
  useLayoutEffect(() => {
    if (!book?.epubPath) return;
    
    // Generate a unique ID for this component instance to ensure we can find it
    const viewerId = `epub-viewer-${id}`;
    
    // Check for our viewerRef and also look by ID as a backup
    const viewerElement = viewerRef.current || document.getElementById(viewerId);
    
    if (viewerElement) {
      console.log("Viewer element found:", viewerElement);
      
      // If viewerRef isn't set but we found by ID, set it
      if (!viewerRef.current && viewerElement) {
        viewerRef.current = viewerElement as HTMLDivElement;
      }
      
      setViewerReady(true);
    } else {
      console.log("Viewer element not found in DOM");
      
      // If we've been waiting for the DOM for a while, retry later
      if (domCheckCounter > 8) {
        console.log("Multiple attempts to find viewer element failed, delaying...");
        setTimeout(() => {
          setDomCheckCounter(prev => prev + 1);
        }, 300);
      }
    }
  }, [domCheckCounter, id, book?.epubPath]);

  // Initialize EPUB reader when both book data and viewer are ready
  useEffect(() => {
    if (!book?.epubPath || !viewerReady || !viewerRef.current) {
      if (book?.epubPath) {
        console.log("Book data ready but viewer ref is still null:", 
          "book.epubPath:", book.epubPath, 
          "viewerReady:", viewerReady,
          "viewerRef.current:", viewerRef.current);
      }
      return;
    }

    console.log("Both book data and viewer are ready, initializing EPUB reader");
    initializeEpubReader(book.epubPath);
    
    // Clean up function to remove any existing EPUB reader instances
    return () => {
      if (bookRef.current) {
        console.log("Cleaning up EPUB instance");
        bookRef.current.destroy();
      }
    };
  }, [book, viewerReady]);

  const initializeEpubReader = (epubPath: string) => {
    if (!viewerRef.current) {
      console.error("Viewer element not found in DOM during initialization");
      setError('Viewer element not found in DOM');
      setLoading(false);
      return;
    }
    
    try {
      setLoadingStage("initializing EPUB reader");
      console.log("Initializing EPUB reader with path:", epubPath);
      console.log("Viewer ref available:", !!viewerRef.current);
      
      // Clean up any existing instances
      if (bookRef.current) {
        console.log("Cleaning up previous EPUB instance");
        bookRef.current.destroy();
      }
      
      // Create a new Book instance
      console.log("Creating EPUB.js Book instance");
      const book = ePub(epubPath);
      bookRef.current = book;
      
      // Add a listener for book open failure
      book.on('openFailed', (error: any) => {
        console.error("Failed to open EPUB:", error);
        setError(`Failed to open EPUB: ${error.message || 'Unknown error'}`);
        setLoading(false);
      });
      
      // Wait for the book to be opened
      setLoadingStage("opening book");
      book.ready.then(() => {
        console.log("EPUB book ready");
        setLoadingStage("rendering book");
        
        if (!viewerRef.current) {
          console.error("Viewer element lost during rendering");
          setError('Viewer element lost during rendering');
          setLoading(false);
          return;
        }
        
        // Render the book
        console.log("Creating rendition, viewer ref:", viewerRef.current);
        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'none'
        });
        renditionRef.current = rendition;
        
        // Log book metadata
        book.loaded.metadata.then((metadata: any) => {
          console.log("Book metadata:", metadata);
        }).catch((err: any) => {
          console.error("Error loading metadata:", err);
        });
        
        // Display the first page
        console.log("Attempting to display first page");
        rendition.display().then(() => {
          console.log("EPUB first page displayed successfully");
          setLoadingStage("complete");
          setLoading(false);
          
          toast({
            title: "Book loaded successfully",
            description: `Now reading: ${book.packaging.metadata.title}`,
          });
        }).catch((err: any) => {
          console.error("Error displaying EPUB content:", err);
          setError(`Error displaying EPUB content: ${err.message || 'Unknown error'}`);
          setLoading(false);
        });
      }).catch((err: any) => {
        console.error("Error loading EPUB:", err);
        setError(`Error loading EPUB file: ${err.message || 'Unknown error'}`);
        setLoading(false);
      });
    } catch (err) {
      console.error("Exception during EPUB initialization:", err);
      setError(`Exception during EPUB initialization: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  // Navigation functions
  const nextPage = () => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  };

  const prevPage = () => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  };

  // Font size controls
  const changeFontSize = (increase: boolean) => {
    if (!renditionRef.current) return;
    
    try {
      const currentSize = renditionRef.current.themes.fontSize();
      const newSize = increase ? 
        (parseFloat(currentSize) * 1.2) + 'px' : 
        (parseFloat(currentSize) / 1.2) + 'px';
      
      renditionRef.current.themes.fontSize(newSize);
    } catch (e) {
      console.error('Error changing font size:', e);
    }
  };

  // Toggle theme (dark/light mode)
  const toggleTheme = () => {
    if (!renditionRef.current) return;
    
    try {
      const theme = document.body.classList.contains('dark') ? 'light' : 'dark';
      
      if (theme === 'dark') {
        renditionRef.current.themes.register('dark', {
          body: { 
            color: '#ffffff !important', 
            background: '#121212 !important' 
          }
        });
        renditionRef.current.themes.select('dark');
      } else {
        renditionRef.current.themes.register('light', {
          body: { 
            color: '#000000 !important', 
            background: '#ffffff !important' 
          }
        });
        renditionRef.current.themes.select('light');
      }
    } catch (e) {
      console.error('Error toggling theme:', e);
    }
  };

  // Try an alternative approach with iframe directly if EPUB.js fails
  const tryAlternativeLoad = () => {
    if (!book?.epubPath || !viewerRef.current) return;
    
    try {
      const iframe = document.createElement('iframe');
      iframe.src = book.epubPath;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = 'none';
      
      viewerRef.current.innerHTML = '';
      viewerRef.current.appendChild(iframe);
      setLoading(false);
      setError(null);
      toast({
        title: "Alternative Loading Method",
        description: "Using direct iframe to display the EPUB content",
      });
    } catch (e) {
      console.error('Error with alternative loading method:', e);
      toast({
        title: "Error",
        description: "Failed to load with alternative method",
        variant: "destructive",
      });
    }
  };

  const forceRefresh = () => {
    // Force a complete refresh of the component
    setLoading(true);
    setError(null);
    setLoadingStage("initializing");
    
    // Clean up any existing instances
    if (bookRef.current) {
      bookRef.current.destroy();
      bookRef.current = null;
    }
    renditionRef.current = null;
    
    // Reset DOM check counter to trigger DOM checks
    setDomCheckCounter(0);
    setViewerReady(false);
    
    if (book?.epubPath) {
      // Additional heavy-handed approach to ensure the DOM is reset
      if (viewerRef.current) {
        console.log("Clearing viewer element contents");
        viewerRef.current.innerHTML = '';
      }
      
      // Force a delay to let everything settle
      setTimeout(() => {
        setDomCheckCounter(prev => prev + 1); // Trigger DOM check
      }, 300);
    }
  };

  // Set up keyboard event listeners
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!renditionRef.current) return;
      
      if (e.key === 'ArrowRight') {
        renditionRef.current.next();
      } else if (e.key === 'ArrowLeft') {
        renditionRef.current.prev();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return {
    loading,
    error,
    loadingStage,
    viewerReady,
    domCheckCounter,
    bookRef,
    renditionRef,
    initializeEpubReader,
    nextPage,
    prevPage,
    changeFontSize,
    toggleTheme,
    tryAlternativeLoad,
    forceRefresh
  };
};

export default useEpubViewer;
