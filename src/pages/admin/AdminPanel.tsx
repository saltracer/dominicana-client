
import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';


import BooksManager from '@/components/admin/BooksManager';

interface UserData {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const { userRole, updateUserRole } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('authenticated');
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // First get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username');
        
      if (profilesError) throw profilesError;
      
      // Then get roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at');
        
      if (rolesError) throw rolesError;
      
      // Combine data
      const userData = profiles.map(profile => {
        const userRole = roles.find(r => r.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.username,
          role: userRole?.role || 'authenticated',
          created_at: userRole?.created_at || '',
        };
      });
      
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (email: string, role: UserRole) => {
    try {
      await updateUserRole(email, role);
      toast({
        title: "Success",
        description: `Role updated for ${email}`,
      });
      fetchUsers(); // Refresh user list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    await handleRoleUpdate(userEmail, selectedRole);
  };

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        Admin Panel
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="books">Library Management</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">User Management</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Update User Role</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">User Email</label>
                  <Input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <Select 
                    value={selectedRole} 
                    onValueChange={(value) => setSelectedRole(value as UserRole)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="authenticated">Authenticated</SelectItem>
                      <SelectItem value="subscribed">Subscribed</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-dominican-burgundy hover:bg-dominican-burgundy/90"
                >
                  Update Role
                </Button>
              </form>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Users</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-4 text-center">Loading...</td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-4 text-center">No users found</td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setUserEmail(user.email);
                                  setSelectedRole(user.role);
                                }}
                              >
                                Edit
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={fetchUsers}
                  className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10"
                >
                  Refresh Users
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Content Management</h2>
          <p className="text-gray-600">Content management features will be available in future updates.</p>
        </TabsContent>
		
        <TabsContent value="books">
          <BooksManager />
        </TabsContent>
        
        <TabsContent value="settings" className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Site Settings</h2>
          <p className="text-gray-600">Site configuration settings will be available in future updates.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
