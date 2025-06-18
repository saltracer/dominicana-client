
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import RoleGuard from '@/components/auth/RoleGuard';
import BooksManager from '@/components/admin/BooksManager';

const BookAdminPage: React.FC = () => {
  return (
    <RoleGuard requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Book Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage the digital library collection and book content.
          </p>
        </div>
        <BooksManager />
      </div>
    </RoleGuard>
  );
};

export default BookAdminPage;
