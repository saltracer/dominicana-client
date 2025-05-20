
import { supabase } from '@/integrations/supabase/client';
import { books } from '@/lib/library';

export const migrateBooks = async () => {
  try {
    // Get current books in the database to avoid duplicates
    const { data: existingBooks, error: checkError } = await supabase
      .from('books')
      .select('id');
      
    if (checkError) {
      console.error('Error checking existing books:', checkError);
      throw checkError;
    }
    
    // If there are already books in the database, don't import duplicates
    if (existingBooks && existingBooks.length > 0) {
      console.log(`Found ${existingBooks.length} existing books in database, skipping import`);
      return { 
        success: true, 
        message: 'Books already migrated, skipping re-import',
        existingCount: existingBooks.length 
      };
    }
    
    console.log(`Starting migration of ${books.length} books`);
    let insertedCount = 0;
    const errors = [];

    // Insert each book individually
    for (const book of books) {
      const { error } = await supabase
        .from('books')
        .insert({
          id: book.id,
          title: book.title,
          author: book.author,
          year: book.year,
          category: book.category,
          cover_image: book.coverImage || null,
          description: book.description,
          epub_path: book.epubPath || null,
          epub_sample_path: book.epubSamplePath || null,
        });

      if (error) {
        console.error(`Error inserting book ${book.title}:`, error);
        errors.push({ book: book.title, error: error.message });
      } else {
        insertedCount++;
      }
    }
    
    console.log(`Successfully migrated ${insertedCount} books`);
    
    return { 
      success: errors.length === 0, 
      message: `Books migration completed. Migrated ${insertedCount} books.`,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error('Error during books migration:', error);
    throw error;
  }
};
