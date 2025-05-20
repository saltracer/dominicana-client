
import React from 'react';
import { Book } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1" title={book.title}>{book.title}</CardTitle>
        <CardDescription className="line-clamp-1" title={`${book.author} • ${book.year}`}>
          {book.author} • {book.year}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <AspectRatio ratio={1/1.5} className="bg-dominican-light-gray mb-4 overflow-hidden rounded-md">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="object-cover h-full w-full"
              onError={(e) => {
                // If image fails, show a placeholder with title
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center', 'p-4');
                const placeholder = document.createElement('div');
                placeholder.className = 'text-center';
                placeholder.innerHTML = `
                  <p class="font-medium text-dominican-burgundy">${book.title}</p>
                  <p class="text-sm text-gray-600">${book.author}</p>
                `;
                e.currentTarget.parentElement!.appendChild(placeholder);
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full p-4">
              <div className="text-center">
                <p className="font-medium text-dominican-burgundy">{book.title}</p>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
            </div>
          )}
        </AspectRatio>
        
        <p className="text-sm text-gray-600 mb-2">{book.category}</p>
        <p className="text-sm line-clamp-3">{book.description}</p>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" onClick={() => onEdit(book)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(book.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
