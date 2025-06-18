
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import RoleGuard from '@/components/auth/RoleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, Search, UserCog } from 'lucide-react';
import type { UserRole } from '@/context/AuthContext';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  created_at: string;
  role?: UserRole;
}

const UserAdminPage: React.FC = () => {
  const { updateUserRole } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('authenticated');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles and their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, created_at');

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles = profiles.map(profile => {
        const userRole = roles.find(role => role.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || 'authenticated' as UserRole
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error('Please select both a user and a role');
      return;
    }

    try {
      await updateUserRole(selectedUser, selectedRole);
      toast.success('User role updated successfully');
      setSelectedUser('');
      setSelectedRole('authenticated');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'subscribed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'authenticated': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'free': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts and roles in the application.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Role Update Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCog className="mr-2 h-5 w-5" />
                  Update User Role
                </CardTitle>
                <CardDescription>
                  Select a user and assign a new role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="user-select">Select User</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.username || user.id}>
                          {user.full_name || user.username || 'Unknown User'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="role-select">Select Role</Label>
                  <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="authenticated">Authenticated</SelectItem>
                      <SelectItem value="subscribed">Subscribed</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleUpdateRole} className="w-full">
                  Update Role
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  All Users
                </CardTitle>
                <CardDescription>
                  View and manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">
                            {user.full_name || 'No name provided'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {user.username}
                          </div>
                          <div className="text-xs text-gray-500">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge className={getRoleColor(user.role || 'authenticated')}>
                          {user.role || 'authenticated'}
                        </Badge>
                      </div>
                    ))}
                    
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        {searchTerm ? 'No users found matching your search' : 'No users found'}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default UserAdminPage;
