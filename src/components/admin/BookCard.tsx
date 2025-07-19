
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Book } from '@/lib/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import BookCoverGenerator from './BookCoverGenerator';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const handleCoverGenerated = (imageUrl: string) => {
    // Update the book object with the new cover image
    onEdit({ ...book, coverImage: imageUrl });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <AspectRatio ratio={2/3} className="bg-gray-100 dark:bg-gray-700">
        {book.coverImage ? (
          <img 
            src={book.coverImage} 
            alt={book.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const placeholder = e.currentTarget.parentElement?.querySelector('.cover-placeholder');
              if (placeholder) {
                (placeholder as HTMLElement).style.display = 'flex';
              }
            }}
          />
        ) : null}
        
        <div 
          className={`cover-placeholder ${book.coverImage ? 'hidden' : 'flex'} items-center justify-center h-full w-full p-4 text-center`}
        >
          <div>
            <p className="font-bold text-sm text-gray-600 dark:text-gray-400 mb-2">{book.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">{book.author}</p>
            <BookCoverGenerator 
              book={book}
              onCoverGenerated={handleCoverGenerated}
              size="default"
            />
          </div>
        </div>
      </AspectRatio>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{book.author} • {book.year}</p>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">{book.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
            {book.category}
          </span>
          
          <div className="flex gap-1">
            {!book.coverImage && (
              <BookCoverGenerator 
                book={book}
                onCoverGenerated={handleCoverGenerated}
              />
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(book)}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(book.id)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
