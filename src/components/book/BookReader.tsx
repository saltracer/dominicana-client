import React, { useRef, useState, useEffect } from 'react';
import { ReactReader } from 'react-reader';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home, Volume2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import BookTTSControls from './BookTTSControls';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface BookReaderProps {
  url: string;
  title: string;
}

const BookReader: React.FC<BookReaderProps> = ({ url, title }) => {
  const renditionRef = useRef<any>(null);
  const tocRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<string | number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { resolvedTheme } = useTheme();
  const isAdmin = userRole === 'admin';

  // New state for TTS panel
  const [showTTSControls, setShowTTSControls] = useState(false);
  const canUseTTS = userRole === 'subscribed' || userRole === 'admin';

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
      console.log('BookReader - Container dimensions:', {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
    
    fetch(url)
      .then(response => {
        console.log('BookReader - URL fetch status:', response.status);
        if (!response.ok) {
          console.error('BookReader - URL fetch failed with status:', response.status);
          setError(`Failed to access book URL (Status ${response.status})`);
        } else {
          const contentType = response.headers.get('content-type');
          console.log('BookReader - Content type:', contentType);
          
          return response.blob().then(blob => {
            const reader = new FileReader();
            reader.onload = () => {
              const arrayBuffer = reader.result as ArrayBuffer;
              const bytes = new Uint8Array(arrayBuffer);
              const firstBytes = Array.from(bytes.slice(0, 50)).map(b => b.toString(16).padStart(2, '0')).join(' ');
              console.log('BookReader - First bytes of file:', firstBytes);
              
              const isPossiblyEpub = firstBytes.includes('50 4b');
              console.log('BookReader - Has ZIP/EPUB signature:', isPossiblyEpub);
            };
            reader.readAsArrayBuffer(blob.slice(0, 50));
          });
        }
      })
      .catch(err => {
        console.error('BookReader - URL fetch error:', err);
        setError('Failed to access book URL: ' + err.message);
      });
      
    const savedLocation = localStorage.getItem(`book-progress-${title}`);
    if (savedLocation) {
      console.log('BookReader - Found saved location:', savedLocation);
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
        console.log('BookReader - Window resized, new dimensions:', {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      console.log('BookReader - Component unmounting');
      window.removeEventListener('resize', handleResize);
    };
  }, [url, title, userRole]);

  const locationChanged = (epubcifi: string) => {
    console.log('BookReader - Location changed:', epubcifi);
    
    setLocation(epubcifi);
    localStorage.setItem(`book-progress-${title}`, epubcifi);
  };

  const handleRenditionReady = (rendition: any) => {
    console.log('BookReader - Rendition ready event fired');
    
    rendition.on('relocated', (location: any) => {
      console.log('BookReader - Relocated event:', location);
      if (location.start) {
        console.log('BookReader - Current page:', location.start.cfi);
        console.log('BookReader - Current chapter:', location.start.href);
      }
    });
    
    rendition.on('rendered', (section: any) => {
      console.log('BookReader - Section rendered:', section);
    });
    
    rendition.on('layout', (layout: any) => {
      console.log('BookReader - Layout changed:', layout);
    });
    
    rendition.on('displayError', (error: any) => {
      console.error('BookReader - Display error:', error);
    });

    rendition.hooks.content.register((contents: any) => {
      contents.window.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'a' && target.getAttribute('href')) {
          const href = target.getAttribute('href') || '';
          if (href.startsWith('#') || !href.includes('://')) {
            e.preventDefault();
            try {
              rendition.display(href);
            } catch (err) {
              console.error('BookReader - Error navigating to internal link:', href, err);
            }
          }
        }
      });
    });
    
    const savedLocation = localStorage.getItem(`book-progress-${title}`);
    if (savedLocation) {
      console.log('BookReader - Applying saved location:', savedLocation);
      setTimeout(() => {
        try {
          console.log('BookReader - Attempting to display saved location:', savedLocation);
          rendition.display(savedLocation);
        } catch (err) {
          console.error('BookReader - Error applying saved location:', err);
          rendition.display();
        }
      }, 100);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    if (renditionRef.current) {
      console.log('BookReader - Applying theme:', resolvedTheme);
      
      if (resolvedTheme === 'dark') {
        renditionRef.current.themes.default({
          'body': {
            'background-color': '#1f2937 !important',
            'color': '#f3f4f6 !important',
          },
          'p, div, span': {
            'color': '#f3f4f6 !important',
          },
          'h1, h2, h3, h4, h5, h6': {
            'color': '#ffffff !important',
          },
          '::selection': {
            'background': 'rgba(184, 84, 80, 0.3) !important',
          },
          'a': {
            'color': '#B85450 !important',
          },
        });
      } else {
        renditionRef.current.themes.default({
          'body': {
            'background-color': '#ffffff !important',
            'color': '#000000 !important',
          },
          'p, div, span': {
            'color': '#000000 !important',
          },
          'h1, h2, h3, h4, h5, h6': {
            'color': '#000000 !important',
          },
          '::selection': {
            'background': 'rgba(102, 0, 32, 0.3) !important',
          },
          'a': {
            'color': '#660020 !important',
          },
        });
      }
    }
  }, [resolvedTheme]);

  const handleError = (error: any) => {
    console.error('BookReader - Error loading book:', error);
    setError('Failed to load the book. Please try again later.');
    setIsLoading(false);
  };

  return (
    <div className="h-full">
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate(-1)}
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-5 w-5 text-dominican-burgundy dark:text-dominican-burgundy" />
            </Button>
            <Button 
              asChild
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Link to="/study/library">
                <Home className="h-5 w-5 text-dominican-burgundy dark:text-dominican-burgundy" />
              </Link>
            </Button>
            <h1 className="font-garamond text-xl md:text-2xl font-bold text-dominican-burgundy dark:text-dominican-burgundy">
              {title}
            </h1>
          </div>
          
          {canUseTTS && renditionRef.current && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTTSControls(!showTTSControls)}
              className="flex items-center gap-2"
            >
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">Listen</span>
            </Button>
          )}
        </div>
      </div>

      {canUseTTS && (
        <Collapsible open={showTTSControls} onOpenChange={setShowTTSControls}>
          <CollapsibleContent>
            <div className="container mx-auto px-4 py-2">
              <BookTTSControls rendition={renditionRef.current} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {error ? (
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button asChild>
            <Link to="/study/library">Return to Library</Link>
          </Button>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-2" ref={containerRef}>
          <div 
            style={{ 
              position: 'relative',
              height: 'calc(100vh - 150px)',
              width: '100%',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}
          >
            <ReactReader
              url={url}
              title={title}
              location={location}
              locationChanged={locationChanged}
              getRendition={(rendition) => {
                console.log('BookReader - Got rendition object');
                renditionRef.current = rendition;
                handleRenditionReady(rendition);
                
                if (resolvedTheme === 'dark') {
                  rendition.themes.default({
                    'body': {
                      'background-color': '#1f2937 !important',
                      'color': '#f3f4f6 !important',
                    },
                    'p, div, span': {
                      'color': '#f3f4f6 !important',
                    },
                    'h1, h2, h3, h4, h5, h6': {
                      'color': '#ffffff !important',
                    },
                    '::selection': {
                      'background': 'rgba(184, 84, 80, 0.3) !important',
                    },
                    'a': {
                      'color': '#B85450 !important',
                    },
                  });
                } else {
                  rendition.themes.default({
                    'body': {
                      'background-color': '#ffffff !important',
                      'color': '#000000 !important',
                    },
                    'p, div, span': {
                      'color': '#000000 !important',
                    },
                    'h1, h2, h3, h4, h5, h6': {
                      'color': '#000000 !important',
                    },
                    '::selection': {
                      'background': 'rgba(102, 0, 32, 0.3) !important',
                    },
                    'a': {
                      'color': '#660020 !important',
                    },
                  });
                }
              }}
              tocChanged={(toc) => {
                console.log('BookReader - TOC changed:', toc);
                tocRef.current = toc;
              }}
              epubInitOptions={{
                openAs: 'epub',
              }}
              epubOptions={{
                flow: 'paginated',
                manager: 'default',
                allowPopups: true,
              }}
              loadingView={
                isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dominican-burgundy"></div>
                  </div>
                ) : null
              }
              handleKeyPress={() => {}}
              showToc={true}
              swipeable={true}
            />
          </div>
          
          {isAdmin && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="text-sm text-gray-700 dark:text-gray-300">Debug Controls:</p>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    console.log('BookReader - Debug info:');
                    console.log('Current location:', location);
                    console.log('Rendition ref:', renditionRef.current);
                    console.log('TOC ref:', tocRef.current);
                    console.log('Container dimensions:', dimensions);
                    
                    if (renditionRef.current) {
                      console.log('Book loaded:', renditionRef.current.book?.loaded);
                      console.log('Current view manager type:', renditionRef.current.manager?.name);
                    }
                    
                    alert('Debug info logged to console');
                  }}
                >
                  Log Debug Info
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem(`book-progress-${title}`);
                    setLocation(0);
                    console.log('BookReader - Progress reset');
                    
                    if (renditionRef.current) {
                      console.log('BookReader - Attempting to display location 0');
                      try {
                        renditionRef.current.display(0);
                        alert('Reading progress reset and returned to beginning');
                      } catch (err) {
                        console.error('BookReader - Error resetting location:', err);
                        alert('Failed to reset position: ' + err);
                      }
                    } else {
                      alert('Reading progress reset (rendition not available)');
                    }
                  }}
                >
                  Reset Progress
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (renditionRef.current) {
                      console.log('BookReader - Forcing display() call');
                      try {
                        renditionRef.current.display();
                        alert('Forced display refresh');
                      } catch (err) {
                        console.error('BookReader - Error in force display:', err);
                        alert('Display refresh failed: ' + err);
                      }
                    } else {
                      alert('Cannot refresh, reader not initialized');
                    }
                  }}
                >
                  Force Refresh
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookReader;
