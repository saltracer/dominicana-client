
import React from 'react';
import { Button } from '@/components/ui/button';
import { Book } from '@/lib/types';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import CorsTest from '@/components/debug/CorsTest';

interface ReaderDebugPanelProps {
  book: Book | null;
  loadingStage: string;
  domCheckCounter: number;
  viewerReady: boolean;
  id: string | undefined;
  viewerRef: React.RefObject<HTMLDivElement>;
  bookRef: React.RefObject<any>;
  renditionRef: React.RefObject<any>;
  tryAlternativeLoad: () => void;
  forceRefresh: () => void;
  initializeEpubReader: (epubPath: string) => void;
}

const ReaderDebugPanel: React.FC<ReaderDebugPanelProps> = ({
  book,
  loadingStage,
  domCheckCounter,
  viewerReady,
  id,
  viewerRef,
  bookRef,
  renditionRef,
  tryAlternativeLoad,
  forceRefresh,
  initializeEpubReader
}) => {
  if (!book) return null;
  
  return (
    <Collapsible open={true} className="mb-4">
      <CollapsibleContent>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <h3 className="font-medium mb-2">Debug Information</h3>
          <div className="text-sm mb-2">
            <strong>Book ID:</strong> {book.id}<br />
            <strong>EPUB Path:</strong> <span className="break-all">{book.epubPath}</span><br />
            <strong>Loading Stage:</strong> {loadingStage}<br />
            <strong>DOM Check Counter:</strong> {domCheckCounter}<br />
            <strong>Viewer Ready State:</strong> {viewerReady ? "Ready" : "Not Ready"}<br />
            <strong>Viewer Element ID:</strong> epub-viewer-{id}<br />
            <strong>Viewer Ref Available:</strong> {viewerRef.current ? "Yes" : "No"}<br />
            <strong>Book Ref Available:</strong> {bookRef.current ? "Yes" : "No"}<br />
            <strong>Rendition Ref Available:</strong> {renditionRef.current ? "Yes" : "No"}
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={tryAlternativeLoad}
            >
              Try Alternative Loading
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Force-set viewer ready and attempt to reinitialize if we have book data
                if (book?.epubPath && viewerRef.current) {
                  initializeEpubReader(book.epubPath);
                }
              }}
            >
              Retry Initialization
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={forceRefresh}
            >
              Force Complete Refresh
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => book.epubPath && window.open(book.epubPath, '_blank')}
            >
              Open EPUB URL Directly
            </Button>
          </div>
          
          {book.epubPath && <CorsTest url={book.epubPath} />}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ReaderDebugPanel;
