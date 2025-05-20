
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  const { user, userRole } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-dominican-burgundy/10 rounded-full w-20 h-20 flex items-center justify-center mb-6">
        <Lock className="h-10 w-10 text-dominican-burgundy" />
      </div>
      
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-4 text-center">
        Access Restricted
      </h1>
      
      <div className="text-center mb-8">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      
      <div className="max-w-xl text-center mb-8">
        <p className="text-gray-700 mb-4">
          You do not have permission to access this content.
        </p>
        
        {user ? (
          <p className="text-gray-600">
            Your current role is: <span className="font-semibold">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
          </p>
        ) : (
          <p className="text-gray-600">
            Please sign in to access this content.
          </p>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-dominican-burgundy hover:bg-dominican-burgundy/90">
          <Link to="/">Return to Home</Link>
        </Button>
        
        {!user ? (
          <Button asChild variant="outline" className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10">
            <Link to="/auth">Sign In</Link>
          </Button>
        ) : userRole !== 'subscribed' && userRole !== 'admin' ? (
          <Button asChild variant="outline" className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10">
            <Link to="/subscription">Upgrade Subscription</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default UnauthorizedPage;
