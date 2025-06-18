
import React from 'react';
import { useParams } from 'react-router-dom';
import BooksManager from '@/components/admin/BooksManager';

const BookEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bookId = id ? parseInt(id, 10) : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <BooksManager editBookId={bookId} />
    </div>
  );
};

export default BookEditPage;
