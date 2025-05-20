
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';
import { Book } from '@/lib/types';
import { migrateBooks } from '@/services/migrationService';
import BookCard from './BookCard';
import BookFilters from './BookFilters';
import BookFormDialog from './BookFormDialog';

const BooksManager = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadingEpub, setUploadingEpub] = useState(false);
  const [uploadingEpubSample, setUploadingEpubSample] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  // Filtering and sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState<keyof Book | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch books from Supabase
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      
      // Transform to match the Book type
      const transformedBooks: Book[] = data.map(book => ({
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
      
      setBooks(transformedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch books',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleMigrateBooks = async () => {
    setMigrationStatus('loading');
    try {
      const result = await migrateBooks();
      
      setMigrationStatus('success');
      
      if (result.existingCount) {
        toast({
          title: 'Info',
          description: `Books already migrated (${result.existingCount} existing books)`,
        });
      } else {
        toast({
          title: 'Success',
          description: result.message || 'Books migrated successfully',
        });
      }
      
      // Refresh the books list
      fetchBooks();
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus('error');
      toast({
        title: 'Error',
        description: 'Failed to migrate books',
        variant: 'destructive',
      });
    }
  };

  // Handle file uploads to Supabase storage
  const handleEpubUpload = async (file: File, bookId?: number): Promise<string | null> => {
    if (!file) return null;
    
    setUploadingEpub(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${bookId || 'new'}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('epub_files')
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('epub_files')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading epub:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload EPUB file',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadingEpub(false);
    }
  };

  const handleEpubSampleUpload = async (file: File, bookId?: number): Promise<string | null> => {
    if (!file) return null;
    
    setUploadingEpubSample(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `sample_${Date.now()}_${bookId || 'new'}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('epub_files')
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('epub_files')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading epub sample:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload EPUB sample file',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadingEpubSample(false);
    }
  };

  const handleCoverImageUpload = async (file: File, bookId?: number): Promise<string | null> => {
    if (!file) return null;
    
    setUploadingCover(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cover_${Date.now()}_${bookId || 'new'}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('book_covers')
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('book_covers')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload cover image',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSaveBook = async (
    data: any, 
    coverImageFile: File | null, 
    epubFile: File | null, 
    epubSampleFile: File | null
  ) => {
    try {
      // Upload cover image file if exists
      let coverImageUrl = data.coverImage;
      if (coverImageFile) {
        const uploadedUrl = await handleCoverImageUpload(coverImageFile, selectedBook?.id);
        if (uploadedUrl) {
          coverImageUrl = uploadedUrl;
        }
      }
      
      // Upload epub file if exists
      let epubPath = data.epubPath;
      if (epubFile) {
        const uploadedUrl = await handleEpubUpload(epubFile, selectedBook?.id);
        if (uploadedUrl) {
          epubPath = uploadedUrl;
        }
      }
      
      // Upload epub sample file if exists
      let epubSamplePath = data.epubSamplePath;
      if (epubSampleFile) {
        const uploadedUrl = await handleEpubSampleUpload(epubSampleFile, selectedBook?.id);
        if (uploadedUrl) {
          epubSamplePath = uploadedUrl;
        }
      }
      
      if (selectedBook) {
        // Update existing book
        const { error } = await supabase
          .from('books')
          .update({
            title: data.title,
            author: data.author,
            year: data.year,
            category: data.category,
            description: data.description,
            cover_image: coverImageUrl || null,
            epub_path: epubPath || null,
            epub_sample_path: epubSamplePath || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedBook.id);
  
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Book updated successfully',
        });
      } else {
        // Create new book
        const { error } = await supabase
          .from('books')
          .insert({
            title: data.title,
            author: data.author,
            year: data.year,
            category: data.category,
            description: data.description,
            cover_image: coverImageUrl || null,
            epub_path: epubPath || null,
            epub_sample_path: epubSamplePath || null,
          });
  
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Book created successfully',
        });
      }
      
      // Close dialog and refresh
      setDialogOpen(false);
      setSelectedBook(null);
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      toast({
        title: 'Error',
        description: `Failed to ${selectedBook ? 'update' : 'create'} book`,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Book deleted successfully',
      });
      
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete book',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (book: Book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedBook(null);
    setDialogOpen(true);
  };
  
  // Get unique categories from books
  const categories = [...new Set(books.map(book => book.category))];

  // Filter and sort books
  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Books Management</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleMigrateBooks} 
            disabled={migrationStatus === 'loading'}
            variant="outline"
          >
            {migrationStatus === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Migrate Initial Books
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Book
          </Button>
        </div>
      </div>

      {/* Filters */}
      <BookFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        categories={categories}
      />

      {loading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredAndSortedBooks.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onEdit={openEditDialog} 
              onDelete={handleDeleteBook} 
            />
          ))}
          
          {filteredAndSortedBooks.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600">
                {books.length === 0 
                  ? "No books in the database. Click 'Migrate Initial Books' to import." 
                  : "No books match your search criteria."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Book Form Dialog */}
      <BookFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedBook={selectedBook}
        onSave={handleSaveBook}
        uploadingCover={uploadingCover}
        uploadingEpub={uploadingEpub}
        uploadingEpubSample={uploadingEpubSample}
      />
    </div>
  );
};

export default BooksManager;
