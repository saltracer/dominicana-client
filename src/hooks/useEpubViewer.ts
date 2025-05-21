
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
  
  // Use mutable refs that we can safely reassign
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
      if (bookInstanceRef.current) {
        console.log("Cleaning up EPUB instance");
        bookInstanceRef.current.destroy();
      }
    };
  }, [book, viewerReady, initializeEpubReader]);

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
