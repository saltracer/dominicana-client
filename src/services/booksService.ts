
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/lib/types';
import { logAdminAction } from '@/services/auditService';

export const fetchBooks = async (): Promise<Book[]> => {
  //console.log('booksService - Fetching all books');
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('booksService - Error fetching books:', error);
    throw error;
  }

  //console.log('booksService - Raw books data from Supabase:', data);

  // Transform to match the Book type
  const books: Book[] = data.map(book => {
    const transformedBook = {
      id: book.id,
      title: book.title,
      author: book.author,
      year: book.year,
      category: book.category,
      coverImage: book.cover_image || '',
      description: book.description,
      epubPath: book.epub_path || undefined,
      epubSamplePath: book.epub_sample_path || undefined,
    };
    
    //console.log(`booksService - Transformed book ${book.id}:`, {
    //  ...transformedBook,
    //  epubPath: transformedBook.epubPath ? `[PRESENT: ${transformedBook.epubPath.substring(0, 30)}...]` : '[NOT PRESENT]'
    //});
    
    return transformedBook;
  });

  //console.log('booksService - Returning books count:', books.length);
  return books;
};

export const fetchBookById = async (id: number): Promise<Book | null> => {
  console.log('booksService - Fetching book by id:', id);
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.log('booksService - Book not found with id:', id);
      // Record not found
      return null;
    }
    console.error('booksService - Error fetching book:', error);
    throw error;
  }

  console.log('booksService - Raw book data from Supabase:', data);

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

  console.log('booksService - Transformed book:', {
    ...book,
    epubPath: book.epubPath ? `[PRESENT: ${book.epubPath.substring(0, 30)}...]` : '[NOT PRESENT]'
  });

  return book;
};

export const createBook = async (bookData: Omit<Book, 'id'>): Promise<Book> => {
  const { data, error } = await supabase
    .from('books')
    .insert({
      title: bookData.title,
      author: bookData.author,
      year: bookData.year,
      category: bookData.category,
      cover_image: bookData.coverImage,
      description: bookData.description,
      epub_path: bookData.epubPath,
      epub_sample_path: bookData.epubSamplePath,
    })
    .select()
    .single();

  if (error) {
    console.error('booksService - Error creating book:', error);
    throw error;
  }

  // Log the admin action
  await logAdminAction('create_book', 'books', data.id.toString(), {
    title: bookData.title,
    author: bookData.author
  });

  return {
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
};

export const updateBook = async (id: number, bookData: Partial<Omit<Book, 'id'>>): Promise<Book> => {
  const updateData: any = {};
  
  if (bookData.title !== undefined) updateData.title = bookData.title;
  if (bookData.author !== undefined) updateData.author = bookData.author;
  if (bookData.year !== undefined) updateData.year = bookData.year;
  if (bookData.category !== undefined) updateData.category = bookData.category;
  if (bookData.coverImage !== undefined) updateData.cover_image = bookData.coverImage;
  if (bookData.description !== undefined) updateData.description = bookData.description;
  if (bookData.epubPath !== undefined) updateData.epub_path = bookData.epubPath;
  if (bookData.epubSamplePath !== undefined) updateData.epub_sample_path = bookData.epubSamplePath;

  const { data, error } = await supabase
    .from('books')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('booksService - Error updating book:', error);
    throw error;
  }

  // Log the admin action
  await logAdminAction('update_book', 'books', id.toString(), {
    updatedFields: Object.keys(updateData)
  });

  return {
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
};

export const deleteBook = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('booksService - Error deleting book:', error);
    throw error;
  }

  // Log the admin action
  await logAdminAction('delete_book', 'books', id.toString());
};
