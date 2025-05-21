
import React, { useRef, useState } from 'react';
import { ReactReader } from 'react-reader';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface BookReaderProps {
  url: string;
  title: string;
}

const BookReader: React.FC<BookReaderProps> = ({ url, title }) => {
  // Create refs and state
  const renditionRef = useRef<any>(null);
  const [location, setLocation] = useState<string | number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get styles for reader - using object literal instead of type reference
  const readerStyles = {
    container: {
      overflow: 'hidden',
      position: 'relative',
      height: 'calc(100vh - 150px)',
    },
    readerArea: {
      position: 'relative',
      zIndex: 1,
      height: '100%',
      width: '100%',
      backgroundColor: '#fff',
      color: '#000',
    },
    tocArea: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 0,
      width: '16rem',
      backgroundColor: '#f5f5f5',
      overflowY: 'auto',
      transition: 'transform .25s ease-out',
      transform: 'translateX(-100%)',
      boxShadow: '0 0 10px rgba(0,0,0,.1)',
    },
    tocAreaButton: {
      position: 'absolute',
      top: '0.5rem',
      right: '-2rem',
      border: 'none',
      background: '#660020',
      color: '#fff',
      width: '2rem',
      height: '2rem',
      borderRadius: '0 4px 4px 0',
    },
    tocButton: {
      backgroundColor: '#660020',
      margin: '0.5rem',
      padding: '0.5rem',
      color: 'white',
      border: 'none',
      borderRadius: '0.25rem',
      cursor: 'pointer',
    },
  };

  // Location changed handler
  const locationChanged = (epubcifi: string) => {
    // epubcifi is a string with the format: epubcfi(/6/4[chap01ref]!/4/2/1:0)
    // Here we save it to localStorage for persistence
    if (epubcifi) {
      setLocation(epubcifi);
      localStorage.setItem(`book-progress-${title}`, epubcifi);
    }
  };

  // Handle loading
  const handleReady = () => {
    setIsLoading(false);
    // Try to get the saved progress from localStorage
    const savedLocation = localStorage.getItem(`book-progress-${title}`);
    if (savedLocation) {
      setLocation(savedLocation);
    }
  };

  // Handle errors
  const handleError = (error: any) => {
    console.error('Error loading book:', error);
    setError('Failed to load the book. Please try again later.');
    setIsLoading(false);
  };

  return (
    <div className="h-full">
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate(-1)}
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-dominican-burgundy" />
            </Button>
            <Button 
              asChild
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100"
            >
              <Link to="/study/library">
                <Home className="h-5 w-5 text-dominican-burgundy" />
              </Link>
            </Button>
            <h1 className="font-garamond text-xl md:text-2xl font-bold text-dominican-burgundy">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {error ? (
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button asChild>
            <Link to="/study/library">Return to Library</Link>
          </Button>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-2">
          <ReactReader
            url={url}
            title={title}
            location={location}
            locationChanged={locationChanged}
            styles={readerStyles}
            getRendition={(rendition) => {
              renditionRef.current = rendition;
              rendition.themes.default({
                '::selection': {
                  background: 'rgba(102, 0, 32, 0.3)',
                },
                'a': {
                  color: '#660020 !important',
                },
              });
            }}
            epubInitOptions={{
              openAs: 'epub',
            }}
            epubOptions={{
              flow: 'scrolled',
              manager: 'continuous',
              allowPopups: true, // Add missing required property
            }}
            loadingView={
              isLoading && (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dominican-burgundy"></div>
                </div>
              )
            }
            tocChanged={(toc) => console.log('Toc changed:', toc)}
            handleKeyPress={() => {}}
            showToc={true}
            swipeable={true}
            onReady={handleReady}
            onError={handleError}
          />
        </div>
      )}
    </div>
  );
};

export default BookReader;
