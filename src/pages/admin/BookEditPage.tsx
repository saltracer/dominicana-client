
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import RoleGuard from '@/components/auth/RoleGuard';
import BooksManager from '@/components/admin/BooksManager';

const BookEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bookId = id ? parseInt(id, 10) : undefined;

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {bookId ? 'Edit Book' : 'Book Management'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {bookId 
              ? 'Update book details and content'
              : 'Manage the digital library collection and book content'
            }
          </p>
        </div>
        <BooksManager editBookId={bookId} />
      </div>
    </RoleGuard>
  );
};

export default BookEditPage;
