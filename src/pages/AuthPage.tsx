
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type AuthMode = 'login' | 'signup';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [authTimeout, setAuthTimeout] = useState<NodeJS.Timeout | null>(null);
  const { signIn, signUp, user } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Clear any lingering timeout on unmount
  useEffect(() => {
    return () => {
      if (authTimeout) {
        clearTimeout(authTimeout);
      }
    };
  }, [authTimeout]);

  if (user) {
    return <Navigate to={from} replace />;
  }

  const toggleMode = () => {
    // Clear any ongoing loading state when switching modes
    if (authTimeout) {
      clearTimeout(authTimeout);
      setAuthTimeout(null);
    }
    setIsLoading(false);
    setMode(mode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
  };

  const clearPotentiallyCorruptedAuthStorage = () => {
    try {
      // Clear all possible auth-related localStorage keys that might be corrupted
      const keysToCheck = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('supabase') || 
          key.includes('sb-') ||
          key.startsWith('sb.') ||
          key.includes('auth-token')
        )) {
          keysToCheck.push(key);
        }
      }
      
      keysToCheck.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log('Cleared potentially corrupted auth key:', key);
        } catch (error) {
          console.warn('Failed to clear localStorage key:', key, error);
        }
      });
    } catch (error) {
      console.error('Error clearing potentially corrupted auth storage:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing timeout
    if (authTimeout) {
      clearTimeout(authTimeout);
    }

    setIsLoading(true);

    // Set a timeout to prevent indefinite loading state
    const timeoutId = setTimeout(() => {
      console.log('Authentication timeout reached, resetting loading state');
      setIsLoading(false);
      setAuthTimeout(null);
      toast({
        title: "Authentication timeout",
        description: "The authentication process took too long. Please try again.",
        variant: "destructive",
      });
    }, 15000); // 15 second timeout

    setAuthTimeout(timeoutId);

    try {
      // Clear potentially corrupted auth storage before attempting sign in
      if (mode === 'login') {
        console.log('Clearing potentially corrupted auth storage before sign in');
        clearPotentiallyCorruptedAuthStorage();
      }

      if (mode === 'login') {
        console.log('Attempting sign in for:', email);
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        console.log('Attempting sign up for:', email);
        const { error } = await signUp(email, password);
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Please check your email for verification instructions.",
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication error",
        description: error.message || 'An unexpected error occurred during authentication.',
        variant: "destructive",
      });
    } finally {
      // Clear timeout and loading state
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setAuthTimeout(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-garamond text-3xl text-dominican-burgundy">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'login'
              ? 'Enter your credentials to access your account'
              : 'Create a new account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <div className="text-center w-full">
            <p className="text-sm text-gray-500">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <Button 
                variant="link" 
                onClick={toggleMode} 
                className="ml-1 p-0"
                disabled={isLoading}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </Button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
