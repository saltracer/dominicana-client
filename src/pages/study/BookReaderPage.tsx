
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Book } from '@/lib/types';
import { fetchBookById } from '@/services/booksService';
import { Loader2, ArrowLeft, Settings, Book as BookIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Navigator } from '@readium/navigator';
import { Publication } from '@readium/shared';

const BookReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [pub, setPub] = useState<Publication | null>(null);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const navigatorRef = useRef<Navigator | null>(null);

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
        
        // Initialize the reader once we have the book data
        initializeReader(bookData.epubPath);
      } catch (err) {
        console.error('Error loading book:', err);
        setError('Error loading book: ' + (err instanceof Error ? err.message : String(err)));
        setLoading(false);
      }
    };

    getBookDetails();

    // Cleanup function to destroy the navigator when unmounting
    return () => {
      if (navigatorRef.current) {
        navigatorRef.current.destroy();
      }
    };
  }, [id]);

  const initializeReader = async (epubUrl: string) => {
    try {
      if (!viewerRef.current) return;

      // Clear the viewer element
      viewerRef.current.innerHTML = '';
      
      // Create publication object from the EPUB URL
      const response = await fetch(epubUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch EPUB: ${response.statusText}`);
      }
      
      const epubBlob = await response.blob();
      const publication = await Publication.fromBlob(epubBlob);
      setPub(publication);
      
      // Create a new Navigator instance
      const navigator = new Navigator({
        publication,
        viewport: viewerRef.current,
        preferences: {
          pageMode: 'paginated', // or 'scrolled'
          appearance: {
            textAlignment: 'justify',
            fontFamily: 'serif',
            fontSize: 100, // percentage
            theme: 'light',
          },
        }
      });
      
      navigatorRef.current = navigator;
      
      // Set default view
      navigator.goTo(1); // Go to first page
      
      setLoading(false);
    } catch (err) {
      console.error('Error initializing reader:', err);
      setError('Error initializing the reader: ' + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  };

  // Handle font size changes
  const changeFontSize = (increase: boolean) => {
    if (!navigatorRef.current) return;
    
    const currentPreferences = navigatorRef.current.preferences;
    const currentSize = currentPreferences.appearance?.fontSize || 100;
    const newSize = increase ? currentSize + 10 : Math.max(70, currentSize - 10);
    
    navigatorRef.current.preferences = {
      ...currentPreferences,
      appearance: {
        ...currentPreferences.appearance,
        fontSize: newSize
      }
    };
  };

  // Handle theme changes
  const toggleTheme = () => {
    if (!navigatorRef.current) return;
    
    const currentPreferences = navigatorRef.current.preferences;
    const currentTheme = currentPreferences.appearance?.theme || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    navigatorRef.current.preferences = {
      ...currentPreferences,
      appearance: {
        ...currentPreferences.appearance,
        theme: newTheme
      }
    };
  };

  // Navigation controls
  const navigate = (forward: boolean) => {
    if (!navigatorRef.current) return;
    
    if (forward) {
      navigatorRef.current.goRight();
    } else {
      navigatorRef.current.goLeft();
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
          <>
            {/* EPUB Reader Container */}
            <div 
              ref={viewerRef} 
              className="flex-1 overflow-hidden border rounded-md bg-white" 
              style={{ minHeight: '300px' }}
            />
            
            {/* Navigation controls */}
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline"
                onClick={() => navigate(false)}
              >
                Previous Page
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate(true)}
              >
                Next Page
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookReaderPage;
