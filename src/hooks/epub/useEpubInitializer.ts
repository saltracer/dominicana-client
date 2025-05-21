
import { useCallback } from 'react';
import { Book } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import ePub from 'epubjs';

interface UseEpubInitializerProps {
  id: string | undefined;
  book: Book | null;
  viewerRef: React.RefObject<HTMLDivElement>;
  bookInstanceRef: React.RefObject<any>;
  renditionInstanceRef: React.RefObject<any>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoadingStage: React.Dispatch<React.SetStateAction<string>>;
  setViewerReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useEpubInitializer = ({
  id,
  book,
  viewerRef,
  bookInstanceRef,
  renditionInstanceRef,
  setLoading,
  setError,
  setLoadingStage,
  setViewerReady
}: UseEpubInitializerProps) => {

  const initializeEpubReader = useCallback((epubPath: string) => {
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
      if (bookInstanceRef.current) {
        console.log("Cleaning up previous EPUB instance");
        bookInstanceRef.current.destroy();
      }
      
      // Create a new Book instance
      console.log("Creating EPUB.js Book instance");
      const book = ePub(epubPath);
      
      // Ensure the ref is properly initialized before assignment
      if (bookInstanceRef && bookInstanceRef.current) {
        bookInstanceRef.current = book;
      } else {
        console.error('Book instance ref not properly initialized');
        setError('Failed to initialize EPUB reader');
        setLoading(false);
        return;
      } // This is actually correct, but we need to ensure the ref is properly initialized
      
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
        
        // Only assign to ref.current if it exists
        if (renditionInstanceRef && renditionInstanceRef.current !== null) {
          renditionInstanceRef.current = rendition;
        }
        
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
  }, [viewerRef, setLoading, setError, setLoadingStage, bookInstanceRef, renditionInstanceRef]);

  // Try an alternative approach with iframe directly if EPUB.js fails
  const tryAlternativeLoad = useCallback(() => {
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
  }, [book?.epubPath, viewerRef, setLoading, setError]);

  const forceRefresh = useCallback(() => {
    // Force a complete refresh of the component
    setLoading(true);
    setError(null);
    setLoadingStage("initializing");
    
    // Clean up any existing instances
    if (bookInstanceRef.current) {
      bookInstanceRef.current.destroy();
      bookInstanceRef.current = undefined;
    }
    if (renditionInstanceRef.current) {
      renditionInstanceRef.current = undefined;
    }
    
    // Reset viewer ready state
    setViewerReady(false);
    
    if (book?.epubPath) {
      // Additional heavy-handed approach to ensure the DOM is reset
      if (viewerRef.current) {
        console.log("Clearing viewer element contents");
        viewerRef.current.innerHTML = '';
      }
      
      // Force a delay to let everything settle
      setTimeout(() => {
        if (viewerRef.current && book.epubPath) {
          console.log("Forcing new initialization after refresh delay");
          initializeEpubReader(book.epubPath);
        }
      }, 500);
    }
  }, [book, viewerRef, setLoading, setError, setLoadingStage, setViewerReady, bookInstanceRef, renditionInstanceRef, initializeEpubReader]);

  return {
    initializeEpubReader,
    tryAlternativeLoad,
    forceRefresh
  };
};
