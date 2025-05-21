
import { useCallback } from 'react';
import { Book } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import ePub from 'epubjs';

interface UseEpubInitializerProps {
  id: string | undefined;
  book: Book | null;
  viewerRef: React.MutableRefObject<HTMLDivElement | null>;
  bookInstanceRef: React.MutableRefObject<any>;
  renditionInstanceRef: React.MutableRefObject<any>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoadingStage: React.Dispatch<React.SetStateAction<string>>;
  setViewerReady: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define a more specific type for the EPUB.js request object
interface EpubRequest {
  withCredentials: (value: boolean) => void;
  fetch: (url: string) => Promise<Response>;
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
    
    // Ensure viewer is not emptied during initialization
    // We'll preserve any loading indicators/messages
    const loadingElements = viewerRef.current.querySelectorAll('.animate-spin, .text-dominican-burgundy');
    const hasLoadingContent = loadingElements.length > 0;
    
    try {
      setLoadingStage("preparing EPUB reader");
      console.log("Initializing EPUB reader with path:", epubPath);
      console.log("Viewer ref available:", !!viewerRef.current);
      
      // Clean up any existing instances
      if (bookInstanceRef.current) {
        console.log("Cleaning up previous EPUB instance");
        try {
          bookInstanceRef.current.destroy();
        } catch (e) {
          console.warn("Error cleaning up previous EPUB instance:", e);
        }
      }
      
      // Wait a small delay to ensure DOM is stable
      setTimeout(() => {
        try {
          // Verify viewer is still available after timeout
          if (!viewerRef.current) {
            console.error("Viewer element lost during delay");
            setError('Viewer element lost during delay');
            setLoading(false);
            return;
          }
          
          // Create a new Book instance with proper error handling
          setLoadingStage("creating EPUB.js instance");
          console.log("Creating EPUB.js Book instance");
          
          const book = ePub();
          
          // Set listener for open failed event before opening
          book.on('openFailed', (error: any) => {
            console.error("Failed to open EPUB:", error);
            setError(`Failed to open EPUB: ${error.message || 'Unknown error'}`);
            setLoading(false);
          });
          
          // Update ref safely
          bookInstanceRef.current = book;
          
          // Ensure the URL includes the token parameter
          // The issue is likely that EPUB.js is trying to fetch resources within the EPUB
          // and losing the token parameter in subsequent requests
          let processedEpubPath = epubPath;
          
          // If URL contains a token parameter, ensure it's preserved for all requests
          if (epubPath.includes('token=')) {
            console.log("URL already contains token, preserving it");
            
            // Cast request to the proper type to avoid TypeScript errors
            const request = book.request as unknown as EpubRequest;
            
            // We'll set this up in the book's request handler to ensure all requests include the token
            request.withCredentials(false);
            
            // Add hooks to the book's request system to ensure the token is maintained
            const originalFetch = request.fetch.bind(request);
            
            // Override the fetch method with our token-preserving version
            (book.request as any).fetch = function(url: string) {
              let modifiedUrl = url;
              
              // Extract token from original URL
              try {
                const originalUrl = new URL(epubPath);
                const token = originalUrl.searchParams.get('token');
                
                if (token) {
                  // If the URL already has parameters, append the token
                  if (url.includes('?')) {
                    modifiedUrl = `${url}&token=${encodeURIComponent(token)}`;
                  } else {
                    modifiedUrl = `${url}?token=${encodeURIComponent(token)}`;
                  }
                  console.log("Added token to resource URL");
                }
              } catch (e) {
                console.warn("Error processing URL for token:", e);
              }
              
              return originalFetch(modifiedUrl);
            };
          }
          
          // First open the book
          setLoadingStage("opening book");
          book.open(processedEpubPath)
            .then(() => {
              console.log("EPUB book opened successfully");
              setLoadingStage("rendering book");
              
              if (!viewerRef.current) {
                console.error("Viewer element lost after opening book");
                setError('Viewer element lost after opening book');
                setLoading(false);
                return;
              }
              
              // Now the book is open, render it
              console.log("Creating rendition, viewer ref:", viewerRef.current);
              const rendition = book.renderTo(viewerRef.current, {
                width: '100%',
                height: '100%',
                spread: 'none'
              });
              
              // Update ref safely
              renditionInstanceRef.current = rendition;
              
              // Display the first page
              console.log("Displaying first page");
              rendition.display().then(() => {
                console.log("EPUB first page displayed successfully");
                setLoadingStage("complete");
                setLoading(false);
                
                // Only show toast if successfully rendered
                toast({
                  title: "Book loaded successfully",
                  description: book.packaging && book.packaging.metadata ? 
                    `Now reading: ${book.packaging.metadata.title}` :
                    "Your book is ready",
                });
              }).catch((err: any) => {
                console.error("Error displaying EPUB content:", err);
                setError(`Error displaying content: ${err.message || 'Unknown error'}`);
                setLoading(false);
              });
            })
            .catch((err: any) => {
              console.error("Error opening EPUB:", err);
              setError(`Error opening EPUB file: ${err.message || 'Unknown error'}`);
              setLoading(false);
              
              // Clean up the failed book instance
              if (bookInstanceRef.current) {
                try {
                  bookInstanceRef.current.destroy();
                  bookInstanceRef.current = null;
                } catch (e) {
                  console.warn("Error cleaning up failed book instance:", e);
                }
              }
            });
          
        } catch (err) {
          console.error("Exception during EPUB initialization:", err);
          setError(`Exception during initialization: ${err instanceof Error ? err.message : String(err)}`);
          setLoading(false);
        }
      }, 100); // Small delay to ensure DOM stability
      
    } catch (err) {
      console.error("Exception during EPUB initialization setup:", err);
      setError(`Exception during initialization setup: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  }, [viewerRef, setLoading, setError, setLoadingStage, bookInstanceRef, renditionInstanceRef]);

  // Try an alternative approach with iframe directly if EPUB.js fails
  const tryAlternativeLoad = useCallback(() => {
    if (!book?.epubPath || !viewerRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      setLoadingStage("trying alternative loading method");
      
      const iframe = document.createElement('iframe');
      iframe.src = book.epubPath;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = 'none';
      
      // Preserve viewer by just adding the iframe
      viewerRef.current.innerHTML = '';
      viewerRef.current.appendChild(iframe);
      setLoading(false);
      
      toast({
        title: "Alternative Loading Method",
        description: "Using direct iframe to display the EPUB content",
      });
    } catch (e) {
      console.error('Error with alternative loading method:', e);
      setError(`Error with alternative loading: ${e instanceof Error ? e.message : String(e)}`);
      setLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to load with alternative method",
        variant: "destructive",
      });
    }
  }, [book?.epubPath, viewerRef, setLoading, setError, setLoadingStage]);

  const forceRefresh = useCallback(() => {
    // Force a complete refresh of the component
    setLoading(true);
    setError(null);
    setLoadingStage("initializing");
    
    // Clean up any existing instances
    if (bookInstanceRef.current) {
      try {
        bookInstanceRef.current.destroy();
        bookInstanceRef.current = null;
      } catch (e) {
        console.warn("Error cleaning up during force refresh:", e);
      }
    }
    
    // Reset rendition ref
    renditionInstanceRef.current = null;
    
    // Reset viewer ready state
    setViewerReady(false);
    
    if (book?.epubPath) {
      // Put a placeholder in the viewer rather than clearing it completely
      if (viewerRef.current) {
        console.log("Resetting viewer element with loading placeholder");
        viewerRef.current.innerHTML = `
          <div class="flex flex-col items-center justify-center h-full">
            <div class="h-8 w-8 animate-spin text-dominican-burgundy mb-4"></div>
            <span class="text-dominican-burgundy font-medium">Preparing to reload book...</span>
          </div>
        `;
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
