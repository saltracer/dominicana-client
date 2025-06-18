
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Book } from '@/lib/types';
import { fetchBooks } from '@/services/booksService';
import { toast } from '@/components/ui/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const LibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();
  
  // Check if user is admin or can read books
  const isAdmin = userRole === 'admin';
  const canReadBooks = userRole === 'authenticated' || userRole === 'subscribed' || userRole === 'admin';
  
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (error) {
        console.error('LibraryPage - Failed to load books:', error);
        toast({
          title: 'Error',
          description: 'Failed to load library books',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadBooks();
  }, []);
  
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || book.category.toLowerCase() === category.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  const categories = ['all', ...new Set(books.map(book => book.category.toLowerCase()))];
  
  const handleBookClick = (book: Book) => {
    console.log('LibraryPage - Book clicked:', book);
    console.log('LibraryPage - Book epubPath:', book.epubPath);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        Digital Library
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">
        Explore our collection of classical Catholic texts and theological resources, 
        including works by Dominican authors and other significant writers in the Catholic tradition.
      </p>
      
      <div className="bg-white dark:bg-card rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
                className={category === cat 
                  ? "bg-dominican-burgundy hover:bg-dominican-burgundy/90"
                  : "border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10"
                }
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="p-6 pt-0">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-dominican-burgundy" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBooks.map(book => (
                <div key={book.id} className="border border-dominican-light-gray dark:border-border rounded-lg overflow-hidden flex flex-col bg-white dark:bg-card">
                  <AspectRatio ratio={1/1.5} className="bg-dominican-light-gray dark:bg-muted">
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="object-cover h-full w-full"
                        onError={(e) => {
                          // If image fails to load, show text fallback
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'p-4');
                          const placeholder = document.createElement('div');
                          placeholder.className = 'text-center';
                          placeholder.innerHTML = `
                            <p class="font-garamond text-xl font-bold text-dominican-burgundy">${book.title}</p>
                            <p class="text-gray-600 dark:text-gray-400">${book.author}</p>
                          `;
                          e.currentTarget.parentElement?.appendChild(placeholder);
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full p-4">
                        <div className="text-center">
                          <p className="font-garamond text-xl font-bold text-dominican-burgundy">{book.title}</p>
                          <p className="text-gray-600 dark:text-gray-400">{book.author}</p>
                        </div>
                      </div>
                    )}
                  </AspectRatio>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-garamond text-lg font-bold text-dominican-burgundy mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{book.author} • {book.year}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">{book.description}</p>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <span className="bg-dominican-light-gray dark:bg-muted text-dominican-black dark:text-foreground text-xs px-2 py-1 rounded">
                        {book.category}
                      </span>
                      <div className="flex gap-2">
                        {isAdmin && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10"
                            title="Edit book"
                          >
                            <Link to={`/admin/books/edit/${book.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm" 
                          className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10"
                          disabled={!book.epubPath && canReadBooks}
                          title={!book.epubPath ? "No digital version available" : undefined}
                          onClick={() => handleBookClick(book)}
                        >
                          <Link to={canReadBooks ? `/study/book/${book.id}` : `/auth`}>
                            {canReadBooks ? (book.epubPath ? "Read Book" : "No Digital Version") : "Login to Read"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredBooks.length === 0 && !loading && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-600 dark:text-gray-400">No books found matching your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {!canReadBooks && (
          <div className="m-6 p-4 bg-dominican-burgundy/10 dark:bg-dominican-burgundy/20 rounded-md">
            <h3 className="font-garamond text-xl font-bold text-dominican-burgundy mb-2">Login Required to Read</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              A free account is required to access the full text of books in our digital library. 
              You can browse our collection freely, but please log in or create an account to read the books.
            </p>
            <Button asChild className="bg-dominican-burgundy hover:bg-dominican-burgundy/90">
              <Link to="/auth">
                Sign In
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Admin controls */}
      {isAdmin && (
        <div className="mt-6 bg-white dark:bg-card rounded-lg shadow-md p-6">
          <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">Admin Controls</h2>
          <Button asChild className="bg-dominican-burgundy hover:bg-dominican-burgundy/90">
            <Link to="/admin/books">
              Manage Books
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
