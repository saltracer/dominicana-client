
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Book } from '@/lib/types';
import { fetchBookById } from '@/services/booksService';
import { Loader2, ArrowLeft, Settings, Book as BookIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ePub from 'epubjs';

const BookReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<any>(null);
  const bookRef = useRef<any>(null);

  useEffect(() => {
    // Clean up function to remove any existing EPUB reader instances
    return () => {
      if (bookRef.current) {
        bookRef.current.destroy();
      }
    };
  }, []);

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
        
        // Initialize the EPUB reader if the viewer element exists
        if (viewerRef.current && bookData.epubPath) {
          // Create a new Book instance
          const book = ePub(bookData.epubPath);
          bookRef.current = book;
          
          // Wait for the book to be opened
          book.ready.then(() => {
            console.log("EPUB book ready");
            
            // Render the book
            const rendition = book.renderTo(viewerRef.current, {
              width: '100%',
              height: '100%',
              spread: 'none'
            });
            renditionRef.current = rendition;
            
            // Display the first page
            rendition.display().then(() => {
              console.log("EPUB first page displayed");
              setLoading(false);
            }).catch((err: any) => {
              console.error("Error displaying EPUB content:", err);
              setError('Error displaying EPUB content. Please try again later.');
              setLoading(false);
            });
            
            // Add keyboard event listeners for navigation
            document.addEventListener('keydown', handleKeyPress);
          }).catch((err: any) => {
            console.error("Error loading EPUB:", err);
            setError('Error loading EPUB file. Please try again later.');
            setLoading(false);
          });
        }
      } catch (err) {
        console.error('Error loading book:', err);
        setError('Error loading book: ' + (err instanceof Error ? err.message : String(err)));
        setLoading(false);
      }
    };

    getBookDetails();
    
    // Cleanup keyboard event listeners
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [id]);

  // Handle keyboard navigation
  const handleKeyPress = (e: KeyboardEvent) => {
    if (!renditionRef.current) return;
    
    if (e.key === 'ArrowRight') {
      renditionRef.current.next();
    } else if (e.key === 'ArrowLeft') {
      renditionRef.current.prev();
    }
  };

  // Navigation functions
  const nextPage = () => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  };

  const prevPage = () => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  };

  // Font size controls
  const changeFontSize = (increase: boolean) => {
    if (!renditionRef.current) return;
    
    try {
      const currentSize = renditionRef.current.themes.fontSize();
      const newSize = increase ? 
        (parseFloat(currentSize) * 1.2) + 'px' : 
        (parseFloat(currentSize) / 1.2) + 'px';
      
      renditionRef.current.themes.fontSize(newSize);
    } catch (e) {
      console.error('Error changing font size:', e);
    }
  };

  // Toggle theme (dark/light mode)
  const toggleTheme = () => {
    if (!renditionRef.current) return;
    
    try {
      const theme = document.body.classList.contains('dark') ? 'light' : 'dark';
      
      if (theme === 'dark') {
        renditionRef.current.themes.register('dark', {
          body: { 
            color: '#ffffff !important', 
            background: '#121212 !important' 
          }
        });
        renditionRef.current.themes.select('dark');
      } else {
        renditionRef.current.themes.register('light', {
          body: { 
            color: '#000000 !important', 
            background: '#ffffff !important' 
          }
        });
        renditionRef.current.themes.select('light');
      }
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
              onClick={() => prevPage()}
              title="Previous page"
            >
              <ArrowLeft size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => nextPage()}
              title="Next page"
            >
              <ArrowLeft size={16} className="rotate-180" />
            </Button>
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
          <div 
            ref={viewerRef} 
            className="flex-1 w-full border rounded-md overflow-hidden bg-white"
          ></div>
        )}
      </div>
    </div>
  );
};

export default BookReaderPage;
