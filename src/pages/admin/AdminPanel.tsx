
import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, Users, Settings, Library, 
  Calendar, BookText, Server, Shield 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import BooksManager from '@/components/admin/BooksManager';

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
} from "@/components/ui/sidebar";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

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
  
  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection]);

  // Set active section when location changes
  useEffect(() => {
    setActiveSection(getActiveSection());
  }, [location]);

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

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    // Update URL based on selected section without full page reload
    if (section === 'books') {
      navigate('/admin/books', { replace: true });
    } else if (section === 'liturgy') {
      navigate('/admin/liturgy', { replace: true });
    } else {
      navigate('/admin', { replace: true });
    }
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
    <div className="h-full min-h-screen bg-gray-50">
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full min-h-screen">
          <Sidebar>
            <SidebarHeader className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Administration</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeSection === 'users'} 
                      onClick={() => handleSectionChange('users')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      <span>User Management</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeSection === 'books'} 
                      onClick={() => handleSectionChange('books')}
                    >
                      <Library className="h-4 w-4 mr-2" />
                      <span>Library Management</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeSection === 'liturgy'} 
                      onClick={() => handleSectionChange('liturgy')}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>Liturgy Manager</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>System</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeSection === 'settings'} 
                      onClick={() => handleSectionChange('settings')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Site Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
              <div className="text-xs text-muted-foreground">
                Admin Dashboard v1.0
              </div>
            </SidebarFooter>
          </Sidebar>
          
          <SidebarInset className="p-6 overflow-y-auto">
            {/* Users Section */}
            {activeSection === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">User Management</h1>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Role Update Form */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Update User Role</h2>
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
                  
                  {/* Users List */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Users</h2>
                      <Button 
                        variant="outline" 
                        onClick={fetchUsers}
                        size="sm"
                      >
                        Refresh
                      </Button>
                    </div>
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
                  </div>
                </div>
              </div>
            )}
            
            {/* Books Section */}
            {activeSection === 'books' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Library Management</h1>
                <BooksManager editBookId={id ? parseInt(id) : undefined} />
              </div>
            )}
            
            {/* Liturgy Section - Just redirect */}
            {activeSection === 'liturgy' && (
              <div className="text-center py-12">
                <div className="animate-pulse">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-dominican-burgundy" />
                  <p className="text-lg">Redirecting to Liturgy Management...</p>
                </div>
              </div>
            )}
            
            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Site Settings</h1>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600">Site configuration settings will be available in future updates.</p>
                </div>
              </div>
            )}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminPanel;
