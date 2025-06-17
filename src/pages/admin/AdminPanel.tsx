
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Book, Settings, FileText } from 'lucide-react';
import BooksManager from '@/components/admin/BooksManager';

const AdminPanel: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage the application content and settings.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">Manage</div>
            <p className="text-xs text-muted-foreground mb-4">
              Create and manage blog posts for the preaching section.
            </p>
            <Link to="/admin/blog">
              <Button className="w-full">Go to Blog Management</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">Library</div>
            <p className="text-xs text-muted-foreground mb-4">
              Manage books in the digital library.
            </p>
            <Button className="w-full" disabled>Coming Soon</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">Manage</div>
            <p className="text-xs text-muted-foreground mb-4">
              User management and roles.
            </p>
            <Button className="w-full" disabled>Coming Soon</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Settings</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">System</div>
            <p className="text-xs text-muted-foreground mb-4">
              Application configuration.
            </p>
            <Button className="w-full" disabled>Coming Soon</Button>
          </CardContent>
        </Card>
      </div>

      {/* Books Management Section */}
      <BooksManager />
    </div>
  );
};

export default AdminPanel;
