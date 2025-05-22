import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import BooksManager from '@/components/admin/BooksManager';
import AdminSidebar from '@/components/admin/AdminSidebar';
import UsersManagement from '@/components/admin/UsersManagement';

const AdminPanel: React.FC = () => {
  const { userRole } = useAuth();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active section based on URL
  const getActiveSection = () => {
    if (location.pathname.includes('/admin/books')) {
      return 'books';
    }
    if (location.pathname.includes('/admin/liturgy')) {
      return 'liturgy';
    }
    return 'users';
  };
  
  const [activeSection, setActiveSection] = useState(getActiveSection());

  // Set active section when location changes
  useEffect(() => {
    setActiveSection(getActiveSection());
  }, [location]);

  if (userRole !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-garamond text-3xl font-bold text-dominican-burgundy mb-4">
          Admin Access Only
        </h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to view this page.
        </p>
        <Button asChild className="bg-dominican-burgundy hover:bg-dominican-burgundy/90">
          <a href="/">Return to Home</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen bg-gray-50">
      <div className="flex w-full min-h-screen">
        <div className="flex-1 overflow-y-auto p-6">
          {/* Main content area */}
          <div className="space-y-6">
            {activeSection === 'users' && <UsersManagement />}
            {activeSection === 'books' && <BooksManager editBookId={id ? parseInt(id) : undefined} />}
            {activeSection === 'liturgy' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Liturgy Manager</h1>
                {/* Add liturgy management content here */}
              </div>
            )}
            {activeSection === 'settings' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Site Settings</h1>
                {/* Add settings content here */}
              </div>
            )}
          </div>
        </div>
        <div className="w-64 border-l">
          {/* Sidebar moved to right */}
          <AdminSidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
