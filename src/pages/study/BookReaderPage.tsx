import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Book } from '@/lib/types';
import { fetchBookById } from '@/services/booksService';
import { Loader2, ArrowLeft, Settings, Book as BookIcon, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ePub from 'epubjs';
import CorsTest from '@/components/debug/CorsTest';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const BookReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<string>("initializing"); // Track loading stages
  const [showDebug, setShowDebug] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<any>(null);
  const bookRef = useRef<any>(null);

  useEffect(() => {
    // Clean up function to remove any existing EPUB reader instances
    return () => {
      if (bookRef.current) {
        console.log("Cleaning up EPUB instance");
        bookRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Fetch book details
    const getBookDetails = async () => {
      setLoading(true);
      setLoadingStage("fetching book data");
      try {
        if (!id) {
          console.error("No book ID provided");
          setError('No book ID provided');
          setLoading(false);
          return;
        }

        console.log(`Fetching book with ID: ${id}`);
        const bookData = await fetchBookById(parseInt(id));
        console.log("Book data received:", bookData);
        
        if (!bookData) {
          console.error("Book not found");
          setError('Book not found');
          setLoading(false);
          return;
        }

        if (!bookData.epubPath) {
          console.error("No EPUB path available for this book");
          setError('This book does not have an EPUB version available');
          setLoading(false);
          return;
        }

        console.log("EPUB path:", bookData.epubPath);
        setBook(bookData);
        
        // Initialize the EPUB reader if the viewer element exists
        if (viewerRef.current && bookData.epubPath) {
          setLoadingStage("initializing EPUB reader");
          console.log("Initializing EPUB reader with path:", bookData.epubPath);
          
          try {
            // Create a new Book instance
            console.log("Creating EPUB.js Book instance");
            const book = ePub(bookData.epubPath);
            bookRef.current = book;
            
            // Add a listener for book open failure
            book.on('openFailed', (error: any) => {
              console.error("Failed to open EPUB:", error);
              setError(`Failed to open EPUB: ${error.message || 'Unknown error'}`);
              setLoading(false);
            });
            
            // Wait for the book to be opened
            setLoadingStage("opening book");
            book.ready.then(() => {
              console.log("EPUB book ready");
              setLoadingStage("rendering book");
              
              // Render the book
              console.log("Creating rendition");
              const rendition = book.renderTo(viewerRef.current, {
                width: '100%',
                height: '100%',
                spread: 'none'
              });
              renditionRef.current = rendition;
              
              // Log book metadata
              book.loaded.metadata.then((metadata: any) => {
                console.log("Book metadata:", metadata);
              }).catch((err: any) => {
                console.error("Error loading metadata:", err);
              });
              
              // Display the first page
              console.log("Attempting to display first page");
              rendition.display().then(() => {
                console.log("EPUB first page displayed successfully");
                setLoadingStage("complete");
                setLoading(false);
              }).catch((err: any) => {
                console.error("Error displaying EPUB content:", err);
                setError(`Error displaying EPUB content: ${err.message || 'Unknown error'}`);
                setLoading(false);
              });
              
              // Add keyboard event listeners for navigation
              document.addEventListener('keydown', handleKeyPress);
            }).catch((err: any) => {
              console.error("Error loading EPUB:", err);
              setError(`Error loading EPUB file: ${err.message || 'Unknown error'}`);
              setLoading(false);
            });
          } catch (err) {
            console.error("Exception during EPUB initialization:", err);
            setError(`Exception during EPUB initialization: ${err instanceof Error ? err.message : String(err)}`);
            setLoading(false);
          }
        } else {
          console.error("Viewer reference not available or no EPUB path");
          setError('Viewer reference not available or no EPUB path');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading book:', err);
        setError(`Error loading book: ${err instanceof Error ? err.message : String(err)}`);
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

  // Try an alternative approach with iframe directly if EPUB.js fails
  const tryAlternativeLoad = () => {
    if (!book?.epubPath) return;
    
    try {
      const iframe = document.createElement('iframe');
      iframe.src = book.epubPath;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = 'none';
      
      if (viewerRef.current) {
        viewerRef.current.innerHTML = '';
        viewerRef.current.appendChild(iframe);
        setLoading(false);
        setError(null);
      }
    } catch (e) {
      console.error('Error with alternative loading method:', e);
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
              title="Toggle debug panel"
            >
              <Bug size={16} />
            </Button>
          </div>
        </div>

        {/* Debug Panel */}
        {showDebug && book && (
          <Collapsible open={true} className="mb-4">
            <CollapsibleContent>
              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <h3 className="font-medium mb-2">Debug Information</h3>
                <div className="text-sm mb-2">
                  <strong>Book ID:</strong> {book.id}<br />
                  <strong>EPUB Path:</strong> <span className="break-all">{book.epubPath}</span>
                </div>
                <div className="mb-4">
                  <Button
                    size="sm"
                    onClick={tryAlternativeLoad}
                    className="mr-2"
                  >
                    Try Alternative Loading
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(book.epubPath, '_blank')}
                  >
                    Open EPUB URL Directly
                  </Button>
                </div>
                
                {book.epubPath && <CorsTest url={book.epubPath} />}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
        
        {/* Reader container */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center flex-col">
            <Loader2 className="h-8 w-8 animate-spin text-dominican-burgundy mb-4" />
            <span className="text-dominican-burgundy font-medium">Loading book... ({loadingStage})</span>
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-6">
              <BookIcon className="h-12 w-12 text-dominican-burgundy mb-4 mx-auto" />
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
                    <Button variant="outline" onClick={() => window.open(book.epubPath, '_blank')}>
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
