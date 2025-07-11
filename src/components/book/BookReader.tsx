import React, { useRef, useState, useEffect } from 'react';
import { ReactReader } from 'react-reader';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface BookReaderProps {
  url: string;
  title: string;
}

const BookReader: React.FC<BookReaderProps> = ({ url, title }) => {
  // Create refs and state
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

  // Add debugging for URL and component lifecycle
  useEffect(() => {
    //console.log('BookReader - Component mounted');
    //console.log('BookReader - Received book URL:', url);
    //console.log('BookReader - Book title:', title);
    //console.log('BookReader - User role:', userRole);
    
    // Update dimensions on mount
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
    
    // Test if the URL is accessible
    fetch(url)
      .then(response => {
        console.log('BookReader - URL fetch status:', response.status);
        if (!response.ok) {
          console.error('BookReader - URL fetch failed with status:', response.status);
          setError(`Failed to access book URL (Status ${response.status})`);
        } else {
          // Check content type
          const contentType = response.headers.get('content-type');
          console.log('BookReader - Content type:', contentType);
          
          // For debugging, check a small part of the response
          return response.blob().then(blob => {
            //console.log('BookReader - Response blob size:', blob.size);
            //console.log('BookReader - Response blob type:', blob.type);
            
            // Log the first few bytes of the file to check if it's a valid EPUB
            const reader = new FileReader();
            reader.onload = () => {
              const arrayBuffer = reader.result as ArrayBuffer;
              const bytes = new Uint8Array(arrayBuffer);
              const firstBytes = Array.from(bytes.slice(0, 50)).map(b => b.toString(16).padStart(2, '0')).join(' ');
              console.log('BookReader - First bytes of file:', firstBytes);
              
              // Check if it has the EPUB signature
              const isPossiblyEpub = firstBytes.includes('50 4b'); // PK signature for ZIP (EPUB is a ZIP file)
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
      
    // Attempt to get the saved location from localStorage
    const savedLocation = localStorage.getItem(`book-progress-${title}`);
    if (savedLocation) {
      console.log('BookReader - Found saved location:', savedLocation);
      // Don't set it immediately, wait for reader to initialize
    }
    
    // Add resize handler
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
    
    // Cleanup function
    return () => {
      console.log('BookReader - Component unmounting');
      window.removeEventListener('resize', handleResize);
    };
  }, [url, title, userRole]);

  // Location changed handler
  const locationChanged = (epubcifi: string) => {
    console.log('BookReader - Location changed:', epubcifi);
    
    // Check if epubcifi is valid before setting it
    //if (epubcifi && typeof epubcifi === 'string' && epubcifi.includes('epubcfi')) {
    //  console.log('BookReader - Setting new location and saving to localStorage');
      setLocation(epubcifi);
      localStorage.setItem(`book-progress-${title}`, epubcifi);
    //} else {
    //  console.warn('BookReader - Invalid location received:', epubcifi);
    //}
  };

  // Load null locations after initialization to avoid the error
  const handleRenditionReady = (rendition: any) => {
    console.log('BookReader - Rendition ready event fired');
    
    // Log rendition details
    console.log('BookReader - Rendition object keys:', Object.keys(rendition));
    console.log('BookReader - Rendition book object keys:', Object.keys(rendition.book || {}));
    
    // Register event listeners for debugging
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

    // Fix navigation within TOC by intercepting clicks
    rendition.hooks.content.register((contents: any) => {
      contents.window.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'a' && target.getAttribute('href')) {
          const href = target.getAttribute('href') || '';
          // Handle internal navigation differently
          if (href.startsWith('#') || !href.includes('://')) {
            e.preventDefault();
            try {
              // Try to use rendition's display method for internal navigation
              rendition.display(href);
            } catch (err) {
              console.error('BookReader - Error navigating to internal link:', href, err);
            }
          }
        }
      });
    });
    
    // Try to get the saved progress from localStorage after rendition is ready
    const savedLocation = localStorage.getItem(`book-progress-${title}`);
    if (savedLocation) {
      console.log('BookReader - Applying saved location:', savedLocation);
      // Wait a bit before applying to ensure book is fully loaded
      setTimeout(() => {
        try {
          console.log('BookReader - Attempting to display saved location:', savedLocation);
          rendition.display(savedLocation);
        } catch (err) {
          console.error('BookReader - Error applying saved location:', err);
          // If there's an error with the saved location, go to the beginning
          rendition.display();
        }
      }, 100);
    }
    
    setIsLoading(false);
  };

  // Apply theme to rendition when theme changes
  useEffect(() => {
    if (renditionRef.current) {
      console.log('BookReader - Applying theme:', resolvedTheme);
      
      // Apply theme styles based on current theme
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

  // Handle errors
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
        </div>
      </div>

      {error ? (
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button asChild>
            <Link to="/study/library">Return to Library</Link>
          </Button>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-2" ref={containerRef}>
          {/* Reader container with explicit height and position */}
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
                
                // Initial theme application
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
              // readerStyles={{
              //   container: {
              //     overflow: 'hidden',
              //     position: 'relative',
              //     height: '100%',
              //   },
              //   readerArea: {
              //     position: 'relative',
              //     zIndex: 1,
              //     height: '100%',
              //     width: '100%',
              //     backgroundColor: '#fff',
              //     color: '#000',
              //   },
              //   tocArea: {
              //     position: 'absolute',
              //     left: 0,
              //     top: 0,
              //     bottom: 0,
              //     zIndex: 0,
              //     width: '16rem',
              //     backgroundColor: '#f5f5f5',
              //     overflowY: 'auto',
              //     transition: 'transform .25s ease-out',
              //     transform: 'translateX(-100%)',
              //     boxShadow: '0 0 10px rgba(0,0,0,.1)',
              //   },
              //   tocAreaButton: {
              //     position: 'absolute',
              //     top: '0.5rem',
              //     right: '-2rem',
              //     border: 'none',
              //     background: '#660020',
              //     color: '#fff',
              //     width: '2rem',
              //     height: '2rem',
              //     borderRadius: '0 4px 4px 0',
              //   },
              //   tocButton: {
              //     backgroundColor: '#660020',
              //     margin: '0.5rem',
              //     padding: '0.5rem',
              //     color: 'white',
              //     border: 'none',
              //     borderRadius: '0.25rem',
              //     cursor: 'pointer',
              //   },
              // }}
            />
          </div>
          
          {/* Only render the debug controls if user is admin */}
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
