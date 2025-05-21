
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchBookById } from '@/services/booksService';
import { Book } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import BookReader from '@/components/book/BookReader';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const BookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [epubUrl, setEpubUrl] = useState<string | null>(null);
  const [epubError, setEpubError] = useState<string | null>(null);
  const { userRole } = useAuth();
  
  const canReadBooks = userRole === 'authenticated' || userRole === 'subscribed' || userRole === 'admin';
  
  useEffect(() => {
    const loadBook = async () => {
      if (!id) {
        console.log('BookPage - No book ID provided');
        return;
      }
      
      console.log('BookPage - Loading book with ID:', id);
      setLoading(true);
      setEpubError(null);
      
      try {
        const bookId = parseInt(id, 10);
        console.log('BookPage - Fetching book data for ID:', bookId);
        const bookData = await fetchBookById(bookId);
        console.log('BookPage - Book data received:', bookData);
        setBook(bookData);
        
        // Check if book has epubPath
        if (bookData?.epubPath) {
          console.log('BookPage - Book has epubPath:', bookData.epubPath);
          console.log('BookPage - EPUB URL type:', typeof bookData.epubPath);
          
          // Check if it's a valid URL
          try {
            new URL(bookData.epubPath);
          } catch (e) {
            console.error('BookPage - Invalid URL format:', e);
            setEpubError(`Invalid URL format: ${e.message}`);
            setEpubUrl(null);
            setLoading(false);
            return;
          }
          
          // Check if it's a Supabase storage URL
          if (bookData.epubPath.includes('supabase.co/storage')) {
            console.log('BookPage - Book path is a Supabase storage URL - attempting to get secure URL');
            try {
              // Extract bucket and file path from URL
              const url = new URL(bookData.epubPath);
              console.log('BookPage - Parsed URL:', url.toString());
              console.log('BookPage - URL pathname:', url.pathname);
              
              const pathSegments = url.pathname.split('/');
              console.log('BookPage - Path segments:', pathSegments);
              
              // Format is usually /storage/v1/object/public/BUCKET_NAME/FILE_PATH
              const bucketIndex = pathSegments.indexOf('public');
              
              if (bucketIndex >= 0 && bucketIndex + 1 < pathSegments.length) {
                const bucketName = pathSegments[bucketIndex + 1];
                const filePath = pathSegments.slice(bucketIndex + 2).join('/');
                
                console.log('BookPage - Extracted bucket:', bucketName);
                console.log('BookPage - Extracted file path:', filePath);
                
                // Attempt to get signed URL for better security
                const { data, error } = await supabase.storage
                  .from(bucketName)
                  .createSignedUrl(filePath, 3600); // 1 hour expiry
                
                if (error) {
                  console.error('BookPage - Failed to get signed URL:', error);
                  console.log('BookPage - Falling back to public URL');
                  setEpubUrl(bookData.epubPath);
                } else if (data) {
                  console.log('BookPage - Got signed URL:', data.signedUrl);
                  
                  // Test the signed URL with a HEAD request to verify it works
                  try {
                    const testResponse = await fetch(data.signedUrl, { method: 'HEAD' });
                    console.log('BookPage - Signed URL test response:', testResponse.status);
                    console.log('BookPage - Signed URL headers:', [...testResponse.headers.entries()]);
                    
                    if (testResponse.ok) {
                      setEpubUrl(data.signedUrl);
                    } else {
                      console.error('BookPage - Signed URL test failed, falling back to public URL');
                      setEpubUrl(bookData.epubPath);
                    }
                  } catch (fetchError) {
                    console.error('BookPage - Error testing signed URL:', fetchError);
                    setEpubUrl(bookData.epubPath);
                  }
                }
              } else {
                console.log('BookPage - Could not parse Supabase URL correctly, using original URL');
                setEpubUrl(bookData.epubPath);
              }
            } catch (error) {
              console.error('BookPage - Error parsing Supabase URL:', error);
              setEpubUrl(bookData.epubPath);
            }
          } else {
            console.log('BookPage - Using direct URL from book data');
            setEpubUrl(bookData.epubPath);
          }
        } else {
          console.log('BookPage - Book does not have epubPath');
          setEpubUrl(null);
        }
        
      } catch (error) {
        console.error('BookPage - Failed to load book:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the book',
          variant: 'destructive',
        });
        setEpubError('Failed to load book data');
      } finally {
        setLoading(false);
      }
    };
    
    loadBook();
  }, [id]);
  
  // Check if user is authorized to read books
  if (!canReadBooks) {
    console.log('BookPage - User not authorized to read books, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }
  
  // Check if book is loading
  if (loading) {
    console.log('BookPage - Book is still loading');
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-dominican-burgundy" />
      </div>
    );
  }
  
  // Check if book exists
  if (!book) {
    console.log('BookPage - Book not found');
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-4">
          Book Not Found
        </h1>
        <p className="text-gray-700 mb-4">
          Sorry, the book you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }
  
  // Check if there was an error with the epub URL
  if (epubError) {
    console.log('BookPage - EPUB error:', epubError);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-4">
          {book.title}
        </h1>
        <div className="flex items-center justify-center gap-2 text-red-500 mb-4">
          <AlertTriangle className="h-5 w-5" />
          <p className="font-medium">Error loading digital book</p>
        </div>
        <p className="text-gray-700 mb-8">
          There was a problem loading this book's digital format. Technical details: {epubError}
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }
  
  // Check if book has epub path
  if (!epubUrl) {
    console.log('BookPage - Book has no epub URL');
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-4">
          {book.title}
        </h1>
        <p className="text-gray-700 mb-8">
          Sorry, this book is not available in digital format yet.
        </p>
      </div>
    );
  }
  
  console.log('BookPage - Rendering BookReader with URL:', epubUrl);
  return <BookReader url={epubUrl} title={book.title} />;
};

export default BookPage;
