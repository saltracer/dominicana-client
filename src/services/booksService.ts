
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/lib/types';
import { libraryBooks } from '@/lib/library';

// Fetch all books
export const fetchBooks = async (): Promise<Book[]> => {
  // For authenticated users, we'll eventually load from Supabase
  // For now, we'll use the local static data
  return libraryBooks;
};

// Fetch a single book by ID
export const fetchBookById = async (id: number): Promise<Book | null> => {
  // Check local library data first
  const localBook = libraryBooks.find(book => book.id === id);
  
  if (localBook) {
    // If the book has an EPUB file, convert its path into a signed URL
    if (localBook.epub) {
      try {
        // Create a signed URL that expires in 8 hours (adjusted from 24 hours)
        const { data, error } = await supabase.storage
          .from('books')
          .createSignedUrl(localBook.epub, 60 * 60 * 8);
        
        if (error) {
          console.error("Error creating signed URL:", error);
          throw new Error(`Could not generate access URL: ${error.message}`);
        }
        
        // Return the book data with the signed URL as epubPath
        return {
          ...localBook,
          epubPath: data.signedUrl
        };
      } catch (error) {
        console.error("Error in fetchBookById:", error);
        throw error;
      }
    }
    
    // If no EPUB file reference, just return the local data
    return localBook;
  }
  
  // If not found locally, return null
  // In a real application, we might check Supabase here
  return null;
};
