
import { useState, useEffect, useRef } from 'react';
import { Book } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { useEpubDomManager } from './epub/useEpubDomManager';
import { useEpubInitializer } from './epub/useEpubInitializer';
import { useEpubControls } from './epub/useEpubControls';

interface UseEpubViewerProps {
  id: string | undefined;
  book: Book | null;
  viewerRef: React.RefObject<HTMLDivElement>;
}

export const useEpubViewer = ({ id, book, viewerRef }: UseEpubViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<string>("initializing");
  
  // Use mutable refs that we can safely assign values to
  const bookInstanceRef = useRef<any>(null);
  const renditionInstanceRef = useRef<any>(null);
  
  // Track initialization attempts
  const initAttempted = useRef(false);
  const initTimerId = useRef<number | null>(null);

  // Split the functionality into separate hooks
  const { 
    viewerReady, 
    setViewerReady, 
    domCheckCounter,
  } = useEpubDomManager({ id, book, viewerRef });

  const {
    initializeEpubReader,
    tryAlternativeLoad,
    forceRefresh
  } = useEpubInitializer({
    id,
    book,
    viewerRef: viewerRef as React.MutableRefObject<HTMLDivElement | null>,
    bookInstanceRef,
    renditionInstanceRef,
    setLoading,
    setError,
    setLoadingStage,
    setViewerReady
  });
  
  const {
    nextPage,
    prevPage,
    changeFontSize,
    toggleTheme
  } = useEpubControls({ renditionInstanceRef });
  
  // Reset initialization state when book changes
  useEffect(() => {
    if (book?.id) {
      console.log("New book detected, resetting initialization state");
      initAttempted.current = false;
      
      // Clear any existing initialization timer
      if (initTimerId.current !== null) {
        clearTimeout(initTimerId.current);
        initTimerId.current = null;
      }
      
      // Reset error state
      setError(null);
    }
    
    // Clean up function
    return () => {
      if (initTimerId.current !== null) {
        clearTimeout(initTimerId.current);
      }
    };
  }, [book?.id]);
  
  // Initialize EPUB reader once when both book data and viewer are ready
  useEffect(() => {
    // Skip if any required data is missing or if we've already attempted initialization
    if (!book?.epubPath || !viewerReady || !viewerRef.current || initAttempted.current) {
      return;
    }

    console.log("Both book data and viewer are ready, scheduling initialization");
    
    // Debounce initialization to prevent race conditions
    if (initTimerId.current !== null) {
      clearTimeout(initTimerId.current);
    }
    
    // Set initialization flag to prevent multiple attempts
    initAttempted.current = true;
    
    // Validate that the EPUB URL has the required token parameter
    if (book.epubPath.includes('supabase.co/storage') && !book.epubPath.includes('token=')) {
      console.warn("EPUB URL does not contain the token parameter, may fail to load");
    }
    
    // Use setTimeout to ensure DOM stability before initializing
    initTimerId.current = window.setTimeout(() => {
      console.log("Initializing EPUB reader after delay with path:", book.epubPath);
      initializeEpubReader(book.epubPath);
      initTimerId.current = null;
    }, 200);
    
    // Clean up function
    return () => {
      if (initTimerId.current !== null) {
        clearTimeout(initTimerId.current);
        initTimerId.current = null;
      }
      
      if (bookInstanceRef.current) {
        console.log("Cleaning up EPUB instance on unmount");
        try {
          bookInstanceRef.current.destroy();
        } catch (e) {
          console.error("Error cleaning up EPUB instance:", e);
        }
      }
    };
  }, [book?.epubPath, viewerReady, initializeEpubReader, viewerRef]);

  // Set up keyboard event listeners
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!renditionInstanceRef.current) return;
      
      if (e.key === 'ArrowRight') {
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        prevPage();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [nextPage, prevPage]);

  return {
    loading,
    error,
    loadingStage,
    viewerReady,
    domCheckCounter,
    bookRef: bookInstanceRef,
    renditionRef: renditionInstanceRef,
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
