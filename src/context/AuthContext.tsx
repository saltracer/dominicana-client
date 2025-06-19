import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logAdminAction, logSecurityEvent } from '@/services/auditService';
import { validateUserRole, checkRateLimit } from '@/utils/inputValidation';

export type UserRole = 'free' | 'authenticated' | 'subscribed' | 'admin';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  userRole: UserRole;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  updateUserRole: (email: string, role: UserRole) => Promise<void>;
  checkUserRole: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('free');

  // Enhanced localStorage cleanup function
  const clearAllAuthStorage = () => {
    try {
      // Get all possible storage keys that could contain auth data
      const keysToRemove: string[] = [];
      
      // Check localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('supabase') || 
          key.includes('auth') || 
          key.includes('sb-') ||
          key.startsWith('sb.') ||
          key.includes('access_token') ||
          key.includes('refresh_token')
        )) {
          keysToRemove.push(key);
        }
      }
      
      // Remove all auth-related keys from localStorage
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log('Cleared localStorage key:', key);
        } catch (error) {
          console.warn('Failed to clear localStorage key:', key, error);
        }
      });
      
      // Check and clear sessionStorage too
      const sessionKeysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (
          key.includes('supabase') || 
          key.includes('auth') || 
          key.includes('sb-') ||
          key.startsWith('sb.') ||
          key.includes('access_token') ||
          key.includes('refresh_token')
        )) {
          sessionKeysToRemove.push(key);
        }
      }
      
      sessionKeysToRemove.forEach(key => {
        try {
          sessionStorage.removeItem(key);
          console.log('Cleared sessionStorage key:', key);
        } catch (error) {
          console.warn('Failed to clear sessionStorage key:', key, error);
        }
      });
      
      console.log('Auth storage cleanup completed');
    } catch (error) {
      console.error('Error during auth storage cleanup:', error);
    }
  };

  // Enhanced session validation
  const validateSession = async (currentSession: Session | null): Promise<boolean> => {
    if (!currentSession) return false;
    
    try {
      // Check if the token is close to expiry (within 5 minutes)
      const expiresAt = currentSession.expires_at;
      if (expiresAt && expiresAt * 1000 - Date.now() < 300000) { // 5 minutes
        console.log('Token is close to expiry, will be refreshed automatically');
      }
      
      // Try to make a simple authenticated request to validate the session
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Session validation failed:', error);
        await logSecurityEvent('session_validation_failed', 'medium', { 
          error: error.message 
        });
        return false;
      }
      
      return !!data.user;
    } catch (error) {
      console.error('Exception during session validation:', error);
      return false;
    }
  };

  // Enhanced auth state handler with better error recovery
  const handleAuthStateChange = async (event: string, currentSession: Session | null) => {
    console.log('Auth state change:', event, currentSession?.user?.id);
    
    try {
      // Handle specific auth events
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully for user:', currentSession?.user?.id);
        await logSecurityEvent('token_refreshed', 'low', { 
          userId: currentSession?.user?.id 
        });
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out - clearing state');
        setSession(null);
        setUser(null);
        setUserRole('free');
        clearAllAuthStorage();
        await logSecurityEvent('user_signed_out', 'low');
        return;
      } else if (event === 'SIGNED_IN') {
        await logSecurityEvent('user_signed_in', 'low', { 
          userId: currentSession?.user?.id,
          email: currentSession?.user?.email 
        });
      }
      
      // Validate session if present
      if (currentSession) {
        const isValid = await validateSession(currentSession);
        if (!isValid) {
          console.log('Invalid session detected, signing out user');
          await logSecurityEvent('invalid_session_detected', 'medium', {
            userId: currentSession?.user?.id
          });
          // Force sign out to clean up invalid state
          await supabase.auth.signOut();
          return;
        }
      }
      
      // Update state
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Fetch user role if authenticated
      if (currentSession?.user) {
        // Use setTimeout to prevent potential deadlocks with Supabase calls
        setTimeout(async () => {
          try {
            await fetchUserRole(currentSession.user.id);
          } catch (error) {
            console.error('Error fetching user role in auth state change:', error);
            setUserRole('authenticated'); // Fallback role
          }
        }, 0);
      } else {
        setUserRole('free');
      }
      
    } catch (error) {
      console.error('Error in auth state change handler:', error);
      await logSecurityEvent('auth_state_change_error', 'high', { 
        event,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      // On error, clear state to prevent inconsistent auth state
      setSession(null);
      setUser(null);
      setUserRole('free');
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;
        await handleAuthStateChange(event, currentSession);
        
        // Ensure loading is set to false after processing auth state
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error) {
          console.error('Error getting session:', error);
          await logSecurityEvent('session_retrieval_error', 'medium', { error: error.message });
          // Clear potentially corrupted auth state
          clearAllAuthStorage();
        }
        
        // Validate the session if it exists
        if (currentSession) {
          const isValid = await validateSession(currentSession);
          if (!isValid) {
            console.log('Initial session validation failed, clearing auth state');
            clearAllAuthStorage();
            setSession(null);
            setUser(null);
            setUserRole('free');
            return;
          }
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          try {
            await fetchUserRole(currentSession.user.id);
          } catch (error) {
            console.error('Error fetching user role in initialization:', error);
            setUserRole('authenticated'); // Fallback role
          }
        } else {
          setUserRole('free');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          await logSecurityEvent('auth_initialization_error', 'high', { 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          setUserRole('free'); // Fallback to free role
          clearAllAuthStorage(); // Clear potentially corrupted state
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user:', userId);
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No role record found, user is authenticated but no specific role
          console.log('No role record found for user, defaulting to authenticated');
          setUserRole('authenticated');
        } else {
          console.error('Error fetching user role:', error);
          await logSecurityEvent('role_fetch_error', 'medium', { 
            userId, 
            error: error.message 
          });
          setUserRole('authenticated'); // Default role if error
        }
        return;
      }

      if (roles?.role) {
        console.log('User role found:', roles.role);
        setUserRole(roles.role as UserRole);
      } else {
        console.log('No role specified, defaulting to authenticated');
        setUserRole('authenticated'); // Default role if no specific role is assigned
      }
    } catch (error) {
      console.error('Exception in fetchUserRole:', error);
      await logSecurityEvent('role_fetch_exception', 'medium', { 
        userId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      setUserRole('authenticated'); // Default role if exception
    }
  };

  const checkUserRole = async () => {
    if (user) {
      await fetchUserRole(user.id);
    }
  };

  const updateUserRole = async (email: string, role: UserRole) => {
    // Rate limiting for role updates
    const rateLimitKey = `role_update_${user?.id}`;
    if (!checkRateLimit(rateLimitKey, 3, 300000)) { // 3 attempts per 5 minutes
      await logSecurityEvent('role_update_rate_limit_exceeded', 'high', { 
        email, 
        attemptedRole: role 
      });
      throw new Error('Too many role update attempts. Please wait before trying again.');
    }

    // Only admins can update roles
    if (userRole !== 'admin') {
      await logSecurityEvent('unauthorized_role_update_attempt', 'high', { 
        email, 
        attemptedRole: role,
        currentUserRole: userRole 
      });
      throw new Error('Unauthorized: Only admins can update roles');
    }

    // Validate the role
    if (!validateUserRole(role)) {
      await logSecurityEvent('invalid_role_update_attempt', 'medium', { 
        email, 
        attemptedRole: role 
      });
      throw new Error('Invalid role specified');
    }

    try {
      // First, get the user ID by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', email)
        .single();

      if (userError || !userData) {
        await logSecurityEvent('role_update_user_not_found', 'medium', { email });
        throw new Error(`User not found with email: ${email}`);
      }

      const userId = userData.id;

      // Check if the user already has a role record
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('id, role')
        .eq('user_id', userId)
        .single();

      if (roleCheckError && roleCheckError.code !== 'PGRST116') {
        // If error is not "no rows returned", it's a real error
        throw roleCheckError;
      }

      let error;
      const oldRole = existingRole?.role;
      
      if (existingRole) {
        // Update existing role
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ 
            role: role,
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingRole.id);
        
        error = updateError;
      } else {
        // Insert new role if none exists
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: userId, 
            role: role,
            updated_at: new Date().toISOString() 
          });
        
        error = insertError;
      }

      if (error) throw error;
      
      // Log the successful role update
      await logAdminAction('update_user_role', 'user_roles', userId, {
        email,
        oldRole,
        newRole: role
      });
      
      // If updating the current user's role, refresh the role state
      if (user && user.id === userId) {
        await checkUserRole();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      await logSecurityEvent('role_update_failed', 'medium', { 
        email, 
        attemptedRole: role,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const rateLimitKey = `signin_${email}`;
    if (!checkRateLimit(rateLimitKey, 5, 900000)) { // 5 attempts per 15 minutes
      await logSecurityEvent('signin_rate_limit_exceeded', 'high', { email });
      return {
        error: { message: 'Too many sign-in attempts. Please wait before trying again.' },
        data: null
      };
    }

    try {
      console.log('Starting sign-in process for:', email);
      
      // Clear any existing invalid auth state before signing in
      clearAllAuthStorage();
      
      console.log('Cleared auth storage, attempting Supabase sign in');
      const result = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });

      console.log('Sign in result:', result.error ? 'Error' : 'Success', result.error?.message);

      if (result.error) {
        await logSecurityEvent('failed_signin_attempt', 'medium', { 
          email,
          error: result.error.message 
        });
      } else {
        console.log('Sign in successful, session should be established');
        await logSecurityEvent('successful_signin', 'low', { 
          email,
          userId: result.data?.user?.id 
        });
      }

      return result;
    } catch (error) {
      console.error('Exception during sign-in:', error);
      await logSecurityEvent('signin_exception', 'high', { 
        email,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return {
        error: { message: 'An unexpected error occurred during sign-in' },
        data: null
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    const rateLimitKey = `signup_${email}`;
    if (!checkRateLimit(rateLimitKey, 3, 3600000)) { // 3 attempts per hour
      await logSecurityEvent('signup_rate_limit_exceeded', 'medium', { email });
      return {
        error: { message: 'Too many sign-up attempts. Please wait before trying again.' },
        data: null
      };
    }

    try {
      // Get current URL to construct proper redirect URL
      const currentUrl = window.location.origin;
      
      const result = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${currentUrl}/auth?verified=true`
        }
      });

      if (result.error) {
        await logSecurityEvent('failed_signup_attempt', 'medium', { 
          email,
          error: result.error.message 
        });
      } else {
        await logSecurityEvent('successful_signup', 'low', { 
          email,
          userId: result.data?.user?.id 
        });
      }

      return result;
    } catch (error) {
      await logSecurityEvent('signup_exception', 'high', { 
        email,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return {
        error: { message: 'An unexpected error occurred during sign-up' },
        data: null
      };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      
      // Log the sign out attempt for security monitoring
      await logSecurityEvent('user_signout_initiated', 'low', {
        userId: user?.id,
        email: user?.email
      });
      
      // Clear local state immediately to prevent UI issues
      setSession(null);
      setUser(null);
      setUserRole('free');
      
      // Clear all auth storage before making the API call
      clearAllAuthStorage();
      
      // Sign out from Supabase (this will trigger the auth state change)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out from Supabase:', error);
        await logSecurityEvent('signout_error', 'medium', { 
          error: error.message 
        });
        // Even if Supabase signOut fails, we've cleared local state
        // This ensures the user appears signed out in the UI
      }
      
      // Additional cleanup - ensure all storage is cleared again
      setTimeout(() => {
        clearAllAuthStorage();
      }, 100);
      
      console.log('User signed out successfully and storage cleared');
      await logSecurityEvent('user_signed_out_complete', 'low');
      
    } catch (error) {
      console.error('Error during sign out:', error);
      await logSecurityEvent('signout_error', 'medium', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      // Even on error, ensure local state is cleared
      setSession(null);
      setUser(null);
      setUserRole('free');
      clearAllAuthStorage();
      
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    userRole,
    signIn,
    signUp,
    signOut,
    updateUserRole,
    checkUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
