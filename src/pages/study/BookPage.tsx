
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchBookById } from '@/services/booksService';
import { Book } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import BookReader from '@/components/book/BookReader';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const BookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();
  
  const canReadBooks = userRole === 'authenticated' || userRole === 'subscribed' || userRole === 'admin';
  
  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const bookId = parseInt(id, 10);
        const bookData = await fetchBookById(bookId);
        setBook(bookData);
      } catch (error) {
        console.error('Failed to load book:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the book',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadBook();
  }, [id]);
  
  // Check if user is authorized to read books
  if (!canReadBooks) {
    return <Navigate to="/auth" replace />;
  }
  
  // Check if book is loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-dominican-burgundy" />
      </div>
    );
  }
  
  // Check if book exists and has epub path
  if (!book) {
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
  
  // Check if book has epub path
  if (!book.epubPath) {
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
  
  return <BookReader url={book.epubPath} title={book.title} />;
};

export default BookPage;
