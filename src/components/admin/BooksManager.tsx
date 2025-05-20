import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Book } from '@/lib/types';
import { Loader2, Plus } from 'lucide-react';
import { migrateBooks } from '@/services/migrationService';

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  year: z.string().min(1, { message: "Year is required" }),
  category: z.enum(['Theology', 'Philosophy', 'Spiritual', 'Mysticism', 'Science', 'Natural History']),
  description: z.string().min(1, { message: "Description is required" }),
  coverImage: z.string().optional(),
  epubPath: z.string().optional(),
  epubSamplePath: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const BooksManager = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      author: '',
      year: '',
      category: 'Theology',
      description: '',
      coverImage: '',
      epubPath: '',
      epubSamplePath: '',
    }
  });

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

  // Reset form when selected book changes
  useEffect(() => {
    if (selectedBook) {
      form.reset({
        title: selectedBook.title,
        author: selectedBook.author,
        year: selectedBook.year,
        category: selectedBook.category as any,
        description: selectedBook.description,
        coverImage: selectedBook.coverImage || '',
        epubPath: selectedBook.epubPath || '',
        epubSamplePath: selectedBook.epubSamplePath || '',
      });
    } else {
      form.reset({
        title: '',
        author: '',
        year: '',
        category: 'Theology',
        description: '',
        coverImage: '',
        epubPath: '',
        epubSamplePath: '',
      });
    }
  }, [selectedBook, form]);

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

  const handleCreateBook = async (data: FormValues) => {
    try {
      const { error } = await supabase
        .from('books')
        .insert({
          title: data.title,
          author: data.author,
          year: data.year,
          category: data.category,
          description: data.description,
          cover_image: data.coverImage || null,
          epub_path: data.epubPath || null,
          epub_sample_path: data.epubSamplePath || null,
        });

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Book created successfully',
      });
      
      // Close dialog and refresh
      setDialogOpen(false);
      fetchBooks();
    } catch (error) {
      console.error('Error creating book:', error);
      toast({
        title: 'Error',
        description: 'Failed to create book',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateBook = async (data: FormValues) => {
    if (!selectedBook) return;
    
    try {
      const { error } = await supabase
        .from('books')
        .update({
          title: data.title,
          author: data.author,
          year: data.year,
          category: data.category,
          description: data.description,
          cover_image: data.coverImage || null,
          epub_path: data.epubPath || null,
          epub_sample_path: data.epubSamplePath || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedBook.id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Book updated successfully',
      });
      
      // Close dialog and refresh
      setDialogOpen(false);
      setSelectedBook(null);
      fetchBooks();
    } catch (error) {
      console.error('Error updating book:', error);
      toast({
        title: 'Error',
        description: 'Failed to update book',
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

  const onSubmit = (data: FormValues) => {
    if (selectedBook) {
      handleUpdateBook(data);
    } else {
      handleCreateBook(data);
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

      {loading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <Card key={book.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
                <CardDescription>{book.author} • {book.year}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 mb-2">{book.category}</p>
                <p className="text-sm">{book.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => openEditDialog(book)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteBook(book.id)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {books.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600">No books in the database. Click "Migrate Initial Books" to import.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
            <DialogDescription>
              {selectedBook 
                ? 'Update the book details below' 
                : 'Fill in the book details to add it to the library'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Book title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input placeholder="Publication year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Theology">Theology</SelectItem>
                          <SelectItem value="Philosophy">Philosophy</SelectItem>
                          <SelectItem value="Spiritual">Spiritual</SelectItem>
                          <SelectItem value="Mysticism">Mysticism</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="Natural History">Natural History</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Book description" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Cover image URL (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="epubPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EPUB Path</FormLabel>
                      <FormControl>
                        <Input placeholder="Path to EPUB file (optional)" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="epubSamplePath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EPUB Sample Path</FormLabel>
                    <FormControl>
                      <Input placeholder="Path to EPUB sample file (optional)" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">
                  {selectedBook ? 'Update Book' : 'Add Book'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksManager;
