
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, FileText } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            <CardTitle className="text-sm font-medium">User Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">Manage</div>
            <p className="text-xs text-muted-foreground mb-4">
              Manage user roles and permissions through the authentication context.
            </p>
            <p className="text-xs text-gray-500">
              User role management is available through the application's authentication system.
            </p>
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
              Application configuration and system settings.
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
