import React from 'react';
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
} from "@/components/ui/sidebar";
import { Users, Library, BookOpen, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, onSectionChange }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    if (section === 'books') {
      navigate('/admin/books', { replace: true });
    } else if (section === 'liturgy') {
      navigate('/admin/liturgy', { replace: true });
    } else {
      navigate('/admin', { replace: true });
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="w-64">
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
    </SidebarProvider>
  );
};

export default AdminSidebar;
