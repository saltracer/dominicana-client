
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/lib/types';

export const fetchBooks = async (): Promise<Book[]> => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching books:', error);
    throw error;
  }

  // Transform to match the Book type
  const books: Book[] = data.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    year: book.year,
    category: book.category,
    coverImage: book.cover_image || '',
    description: book.description,
    epubPath: book.epub_path || undefined,
    epubSamplePath: book.epub_sample_path || undefined,
  }));

  return books;
};

export const fetchBookById = async (id: number): Promise<Book | null> => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Record not found
      return null;
    }
    console.error('Error fetching book:', error);
    throw error;
  }

  // Transform to match the Book type
  const book: Book = {
    id: data.id,
    title: data.title,
    author: data.author,
    year: data.year,
    category: data.category,
    coverImage: data.cover_image || '',
    description: data.description,
    epubPath: data.epub_path || undefined,
    epubSamplePath: data.epub_sample_path || undefined,
  };

  return book;
};
