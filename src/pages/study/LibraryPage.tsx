
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { books } from '@/lib/library';

const LibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || book.category.toLowerCase() === category.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  const categories = ['all', ...new Set(books.map(book => book.category.toLowerCase()))];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        Digital Library
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      <p className="text-gray-700 mb-8 max-w-3xl">
        Explore our collection of classical Catholic texts and theological resources, 
        including works by Dominican authors and other significant writers in the Catholic tradition.
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <div key={book.id} className="border border-dominican-light-gray rounded-lg overflow-hidden flex flex-col">
              <div className="h-40 bg-dominican-light-gray flex items-center justify-center">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="h-full w-auto" />
                ) : (
                  <div className="text-center p-4">
                    <p className="font-garamond text-xl font-bold text-dominican-burgundy">{book.title}</p>
                    <p className="text-gray-600">{book.author}</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-garamond text-xl font-bold text-dominican-burgundy mb-1">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{book.author} • {book.year}</p>
                <p className="text-gray-700 text-sm mb-4 flex-1">{book.description}</p>
                
                <div className="flex justify-between items-center mt-auto">
                  <span className="bg-dominican-light-gray text-dominican-black text-xs px-2 py-1 rounded">
                    {book.category}
                  </span>
                  <Button asChild variant="outline" size="sm" className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10">
                    <Link to={`/login`}>
                      Read Book
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredBooks.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600">No books found matching your search criteria.</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-dominican-burgundy/10 rounded-md">
          <h3 className="font-garamond text-xl font-bold text-dominican-burgundy mb-2">Login Required</h3>
          <p className="text-gray-700 mb-4">
            A free account is required to access the full text of books in our digital library. 
            Please log in or create an account to continue.
          </p>
          <Button asChild className="bg-dominican-burgundy hover:bg-dominican-burgundy/90">
            <Link to="/login">
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
