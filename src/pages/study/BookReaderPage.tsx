
import React, { useState, useRef, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Book } from '@/lib/types';
import { fetchBookById } from '@/services/booksService';
import { Loader2 } from 'lucide-react';
import useEpubViewer from '@/hooks/useEpubViewer';

// Import our reader components
import ReaderHeader from '@/components/reader/ReaderHeader';
import ReaderDebugPanel from '@/components/reader/ReaderDebugPanel';
import ReaderErrorDisplay from '@/components/reader/ReaderErrorDisplay';
import { useQuery } from '@tanstack/react-query';

const BookReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showDebug, setShowDebug] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  
  // Fetch book data using React Query
  const { data: book, isLoading: isBookLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => id ? fetchBookById(parseInt(id)) : null,
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });

  // Set a data attribute on the viewer element that we can check from the hook
  // Move this to useLayoutEffect to happen before the render cycle
  useLayoutEffect(() => {
    if (viewerRef.current && id) {
      viewerRef.current.dataset.viewerId = `epub-viewer-${id}`;
      viewerRef.current.dataset.initialized = 'true';
    }
  }, [id]);

  // Use our custom hook for the EPUB viewer functionality
  const {
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
  } = useEpubViewer({
    id,
    book,
    viewerRef
  });

  // Show loading state when fetching the book
  const isLoading = isBookLoading || loading;

  // Limit logging to prevent excessive console output
  const shouldLog = useRef(0);
  if (shouldLog.current % 10 === 0) {
    console.log("BookReaderPage render state:", {
      id,
      bookLoaded: !!book,
      isBookLoading,
      loading,
      viewerReady,
      errorState: error,
      viewerRefExists: !!viewerRef.current
    });
  }
  shouldLog.current++;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col h-[calc(100vh-180px)]">
        {/* Header with book information and controls */}
        <ReaderHeader 
          book={book}
          loading={isLoading}
          onPrevPage={prevPage}
          onNextPage={nextPage}
          onDecreaseFontSize={() => changeFontSize(false)}
          onIncreaseFontSize={() => changeFontSize(true)}
          onToggleTheme={toggleTheme}
          onToggleDebug={() => setShowDebug(!showDebug)}
          showDebug={showDebug}
        />

        {/* Debug Panel */}
        {showDebug && book && (
          <ReaderDebugPanel
            book={book}
            loadingStage={loadingStage}
            domCheckCounter={domCheckCounter}
            viewerReady={viewerReady}
            id={id}
            viewerRef={viewerRef}
            bookRef={bookRef}
            renditionRef={renditionRef}
            tryAlternativeLoad={tryAlternativeLoad}
            forceRefresh={forceRefresh}
            initializeEpubReader={initializeEpubReader}
          />
        )}
        
        {/* Reader container */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center flex-col">
            <Loader2 className="h-8 w-8 animate-spin text-dominican-burgundy mb-4" />
            <span className="text-dominican-burgundy font-medium">Loading book... ({loadingStage})</span>
          </div>
        ) : error ? (
          <ReaderErrorDisplay
            error={error}
            book={book}
            tryAlternativeLoad={tryAlternativeLoad}
            forceRefresh={forceRefresh}
            showDebug={showDebug}
            setShowDebug={setShowDebug}
          />
        ) : (
          <div 
            ref={viewerRef} 
            className="flex-1 w-full border rounded-md overflow-hidden bg-white"
            id={`epub-viewer-${id}`}
            data-testid="epub-viewer"
            data-viewer-id={`epub-viewer-${id}`}
            data-ready={viewerReady ? "true" : "false"}
            data-initialized="false"
          ></div>
        )}
      </div>
    </div>
  );
};

export default BookReaderPage;
