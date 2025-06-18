
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { toast } from 'sonner';

const UserMenu: React.FC = () => {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button variant="outline" asChild>
        <Link to="/auth">Sign In</Link>
      </Button>
    );
  }

  const handleSignOut = async () => {
    try {
      console.log('UserMenu - Initiating sign out...');
      
      // Show loading state immediately
      toast.info('Signing out...');
      
      await signOut();
      
      console.log('UserMenu - Sign out completed, navigating to home...');
      toast.success('Signed out successfully');
      
      // Navigate to home page after successful sign out
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('UserMenu - Sign out failed:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  // Get initials from email
  const getInitials = () => {
    return user.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0">
          <Avatar>
            <AvatarFallback className="bg-dominican-burgundy text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="flex justify-between">
          {user.email}
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="flex justify-between">
          <span>Role:</span> <span className="font-medium">{userRole}</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center w-full cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center w-full cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        {userRole === 'admin' && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="flex items-center w-full cursor-pointer">
              <span>Admin Panel</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
