
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Book } from '@/lib/types';
import { fetchBookById } from '@/services/booksService';
import { Loader2, ArrowLeft, Settings, Book as BookIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const BookReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Fetch book details
    const getBookDetails = async () => {
      setLoading(true);
      try {
        if (!id) {
          setError('No book ID provided');
          setLoading(false);
          return;
        }

        const bookData = await fetchBookById(parseInt(id));
        if (!bookData) {
          setError('Book not found');
          setLoading(false);
          return;
        }

        if (!bookData.epubPath) {
          setError('This book does not have an EPUB version available');
          setLoading(false);
          return;
        }

        setBook(bookData);
        
        // Load the EPUB directly in the iframe
        if (viewerRef.current && bookData.epubPath) {
          viewerRef.current.src = bookData.epubPath;
          
          // Add load event listener to hide loader when iframe loads
          viewerRef.current.onload = () => {
            console.log("EPUB loaded in iframe");
            setLoading(false);
          };
          
          // Add error event listener
          viewerRef.current.onerror = () => {
            console.error("Failed to load EPUB in iframe");
            setError('Failed to load EPUB file. Please try again later.');
            setLoading(false);
          };
        }
      } catch (err) {
        console.error('Error loading book:', err);
        setError('Error loading book: ' + (err instanceof Error ? err.message : String(err)));
        setLoading(false);
      }
    };

    getBookDetails();
  }, [id]);

  // Simple font size controls for iframe content
  const changeFontSize = (increase: boolean) => {
    if (!viewerRef.current) return;
    
    try {
      viewerRef.current.contentWindow?.postMessage({
        action: 'changeFontSize',
        value: increase ? 'increase' : 'decrease'
      }, '*');
    } catch (e) {
      console.error('Error changing font size:', e);
    }
  };

  // Toggle theme for iframe content
  const toggleTheme = () => {
    if (!viewerRef.current) return;
    
    try {
      viewerRef.current.contentWindow?.postMessage({
        action: 'toggleTheme'
      }, '*');
    } catch (e) {
      console.error('Error toggling theme:', e);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col h-[calc(100vh-180px)]">
        {/* Header with book information */}
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
              onClick={() => changeFontSize(false)}
              title="Decrease font size"
            >
              A-
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => changeFontSize(true)}
              title="Increase font size"
            >
              A+
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleTheme}
              title="Toggle light/dark mode"
            >
              <Settings size={16} />
            </Button>
          </div>
        </div>
        
        {/* Reader container */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-dominican-burgundy" />
            <span className="ml-2">Loading book...</span>
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-6">
              <BookIcon className="h-12 w-12 text-dominican-burgundy mb-4 mx-auto" />
              <h3 className="font-garamond text-xl font-bold text-dominican-burgundy mb-2">Unable to Load Book</h3>
              <p className="text-gray-700 mb-4">{error}</p>
              <Button asChild>
                <Link to="/study/library">Return to Library</Link>
              </Button>
            </div>
          </div>
        ) : (
          <iframe 
            ref={viewerRef}
            className="flex-1 w-full border rounded-md"
            title={book?.title || 'Book Reader'}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            allow="fullscreen"
          />
        )}
      </div>
    </div>
  );
};

export default BookReaderPage;
