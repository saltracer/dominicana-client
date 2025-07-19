
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/lib/types';

export interface GenerateBookCoverResponse {
  success: boolean;
  imageUrl?: string;
  fileName?: string;
  error?: string;
}

export const generateBookCover = async (
  title: string, 
  author: string, 
  category?: string
): Promise<GenerateBookCoverResponse> => {
  try {
    console.log('Generating cover for:', title, 'by', author);
    
    const { data, error } = await supabase.functions.invoke('generate-book-cover', {
      body: { title, author, category }
    });

    if (error) {
      console.error('Error calling generate-book-cover function:', error);
      throw new Error(error.message || 'Failed to generate book cover');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate book cover');
    }

    console.log('Successfully generated cover:', data.imageUrl);
    return data;
  } catch (error) {
    console.error('Error in generateBookCover:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const updateBookCover = async (bookId: number, imageUrl: string): Promise<void> => {
  const { error } = await supabase
    .from('books')
    .update({ cover_image: imageUrl })
    .eq('id', bookId);

  if (error) {
    console.error('Error updating book cover:', error);
    throw new Error('Failed to update book cover in database');
  }
};

export const generateMissingBookCovers = async (books: Book[]): Promise<{
  successful: number;
  failed: number;
  errors: string[];
}> => {
  const booksWithoutCovers = books.filter(book => !book.coverImage || book.coverImage.trim() === '');
  
  let successful = 0;
  let failed = 0;
  const errors: string[] = [];

  console.log(`Found ${booksWithoutCovers.length} books without covers`);

  for (const book of booksWithoutCovers) {
    try {
      console.log(`Generating cover for: ${book.title}`);
      
      const result = await generateBookCover(book.title, book.author, book.category);
      
      if (result.success && result.imageUrl) {
        await updateBookCover(book.id, result.imageUrl);
        successful++;
        console.log(`✓ Generated cover for: ${book.title}`);
      } else {
        failed++;
        const errorMsg = `Failed to generate cover for "${book.title}": ${result.error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    } catch (error) {
      failed++;
      const errorMsg = `Error processing "${book.title}": ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    // Add a small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return { successful, failed, errors };
};
