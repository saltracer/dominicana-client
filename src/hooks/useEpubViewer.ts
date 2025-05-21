
import { useState, useEffect, useRef } from 'react';
import { Book } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import ePub from 'epubjs';
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
    viewerRef,
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
  
  // Initialize EPUB reader once when both book data and viewer are ready
  // Use a ref to track if initialization has been attempted
  const initAttempted = useRef(false);
  
  useEffect(() => {
    // Reset initialization attempt flag when book changes
    if (book?.id) {
      initAttempted.current = false;
    }
  }, [book?.id]);
  
  useEffect(() => {
    // Only attempt initialization once per book
    if (!book?.epubPath || !viewerReady || !viewerRef.current || initAttempted.current) {
      return;
    }

    console.log("Both book data and viewer are ready, initializing EPUB reader");
    initAttempted.current = true;
    initializeEpubReader(book.epubPath);
    
    // Clean up function to remove any existing EPUB reader instances
    return () => {
      if (bookInstanceRef.current) {
        console.log("Cleaning up EPUB instance");
        try {
          bookInstanceRef.current.destroy();
        } catch (e) {
          console.error("Error cleaning up EPUB instance:", e);
        }
      }
    };
  }, [book, viewerReady, initializeEpubReader, viewerRef]);

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
