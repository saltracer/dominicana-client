
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

  // Get a signed URL for the EPUB file if it exists to bypass CORS issues
  let epubPath = data.epub_path;
  let epubSamplePath = data.epub_sample_path;
  
  if (epubPath) {
    console.log("Original EPUB path:", epubPath);
    
    // Check if it's a Supabase storage URL
    if (epubPath.includes('supabase.co/storage')) {
      try {
        // Extract the bucket and file path from the URL
        const url = new URL(epubPath);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.findIndex(part => part === 'object');
        
        if (bucketIndex !== -1 && bucketIndex + 2 < pathParts.length) {
          const bucket = pathParts[bucketIndex + 2];
          const filePath = pathParts.slice(bucketIndex + 3).join('/');
          
          console.log("Getting signed URL for bucket:", bucket, "file:", filePath);
          
          // Get a signed URL with 8 hours expiry
          const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from(bucket)
            .createSignedUrl(filePath, 8 * 60 * 60); // 8 hours expiry
            
          if (signedUrlData && !signedUrlError) {
            console.log("Got signed URL:", signedUrlData.signedUrl);
            // Make sure the URL contains the token parameter
            const signedUrl = new URL(signedUrlData.signedUrl);
            console.log("URL parameters:", Array.from(signedUrl.searchParams.entries()));
            
            // Verify that the signed URL includes the token parameter
            if (!signedUrl.searchParams.has('token')) {
              console.error("Warning: Signed URL does not contain token parameter");
              // Force add a dummy token if missing for testing purposes
              const urlWithToken = new URL(signedUrlData.signedUrl);
              urlWithToken.searchParams.append('token', 'dummy-token-for-testing');
              epubPath = urlWithToken.toString();
              console.log("Added dummy token to URL:", epubPath);
            } else {
              epubPath = signedUrlData.signedUrl;
            }
          } else {
            console.error("Error getting signed URL:", signedUrlError);
          }
        }
      } catch (e) {
        console.error("Error processing EPUB URL:", e);
      }
    }
  }
  
  // Apply the same logic for epubSamplePath
  if (epubSamplePath) {
    // Apply the same logic for sample path with 8 hours expiry time
    if (epubSamplePath.includes('supabase.co/storage')) {
      try {
        const url = new URL(epubSamplePath);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.findIndex(part => part === 'object');
        
        if (bucketIndex !== -1 && bucketIndex + 2 < pathParts.length) {
          const bucket = pathParts[bucketIndex + 2];
          const filePath = pathParts.slice(bucketIndex + 3).join('/');
          
          const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from(bucket)
            .createSignedUrl(filePath, 8 * 60 * 60); // 8 hours expiry
            
          if (signedUrlData && !signedUrlError) {
            epubSamplePath = signedUrlData.signedUrl;
          }
        }
      } catch (e) {
        console.error("Error processing EPUB sample URL:", e);
      }
    }
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
    epubPath: epubPath || undefined,
    epubSamplePath: epubSamplePath || undefined,
  };

  return book;
};
