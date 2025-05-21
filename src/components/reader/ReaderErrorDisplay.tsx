
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bug, BookOpen } from 'lucide-react';
import { Book as BookType } from '@/lib/types';

interface ReaderErrorDisplayProps {
  error: string | null;
  book: BookType | null;
  tryAlternativeLoad: () => void;
  forceRefresh: () => void;
  showDebug: boolean;
  setShowDebug: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReaderErrorDisplay: React.FC<ReaderErrorDisplayProps> = ({
  error,
  book,
  tryAlternativeLoad,
  forceRefresh,
  showDebug,
  setShowDebug
}) => {
  if (!error) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-md p-6">
        <BookOpen className="h-12 w-12 text-dominican-burgundy mb-4 mx-auto" />
        <h3 className="font-garamond text-xl font-bold text-dominican-burgundy mb-2">Unable to Load Book</h3>
        <p className="text-gray-700 mb-4">{error}</p>
        <Button asChild className="mb-2">
          <Link to="/study/library">Return to Library</Link>
        </Button>
        {book?.epubPath && (
          <div className="mt-4">
            <p className="text-gray-700 mb-2">You can try these troubleshooting options:</p>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" onClick={tryAlternativeLoad}>
                Try Alternative Loading Method
              </Button>
              <Button variant="outline" onClick={forceRefresh}>
                Force Complete Refresh
              </Button>
              <Button variant="outline" onClick={() => book.epubPath && window.open(book.epubPath, '_blank')}>
                Open EPUB URL Directly
              </Button>
              <Button variant="outline" onClick={() => setShowDebug(!showDebug)}>
                <Bug className="mr-2" size={16} />
                {showDebug ? "Hide" : "Show"} Debug Tools
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderErrorDisplay;
