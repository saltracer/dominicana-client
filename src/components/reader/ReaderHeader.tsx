
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Book } from '@/lib/types';

interface ReaderHeaderProps {
  book: Book | null;
  loading: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onDecreaseFontSize: () => void;
  onIncreaseFontSize: () => void;
  onToggleTheme: () => void;
  onToggleDebug: () => void;
  showDebug: boolean;
}

const ReaderHeader: React.FC<ReaderHeaderProps> = ({
  book,
  loading,
  onPrevPage,
  onNextPage,
  onDecreaseFontSize,
  onIncreaseFontSize,
  onToggleTheme,
  onToggleDebug,
  showDebug
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/study/library">
            <ArrowLeft className="mr-1" size={16} /> Back to Library
          </Link>
        </Button>
        
        {!loading && book && (
          <div className="ml-2">
            <h2 className="font-garamond text-xl font-bold text-dominican-burgundy">{book.title}</h2>
            <p className="text-sm text-gray-600">{book.author}</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onPrevPage}
          title="Previous page"
        >
          <ArrowLeft size={16} />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onNextPage}
          title="Next page"
        >
          <ArrowLeft size={16} className="rotate-180" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onDecreaseFontSize}
          title="Decrease font size"
        >
          A-
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onIncreaseFontSize}
          title="Increase font size"
        >
          A+
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onToggleTheme}
          title="Toggle light/dark mode"
        >
          <Settings size={16} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleDebug}
          title="Toggle debug panel"
        >
          <Bug size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ReaderHeader;
