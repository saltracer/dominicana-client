
import { supabase } from '@/integrations/supabase/client';
import { books } from '@/lib/library';
import { Database } from '@/integrations/supabase/types';

type BookCategory = Database['public']['Enums']['book_category'];

// Helper function to validate if a category is valid
const isValidCategory = (category: string): category is BookCategory => {
  const validCategories: BookCategory[] = [
    'Theology', 'Philosophy', 'Spiritual', 'Mysticism', 'Science', 'Natural History'
  ];
  return validCategories.includes(category as BookCategory);
};

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
    if ((existingBooks && existingBooks.length > 0) && ((books.length <= existingBooks.length) && books.length > 0)) {
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
      // Validate the category before insertion
      if (!isValidCategory(book.category)) {
        console.error(`Invalid category "${book.category}" for book "${book.title}"`);
        errors.push({ book: book.title, error: `Invalid category: ${book.category}` });
        continue;
      }

      const { error } = await supabase
        .from('books')
        .insert({
          // Don't explicitly set id, let Supabase handle it
          title: book.title,
          author: book.author,
          year: book.year,
          category: book.category as BookCategory,
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
