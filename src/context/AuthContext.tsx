
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

  // Selective localStorage cleanup - only clear on explicit sign out
  const clearAuthStorage = () => {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('supabase.auth.token') || 
          key.includes('sb-') ||
          key.startsWith('sb.')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log('Cleared auth key:', key);
        } catch (error) {
          console.warn('Failed to clear key:', key, error);
        }
      });
    } catch (error) {
      console.error('Error during selective auth cleanup:', error);
    }
  };

  // Simplified session validation - only check if session exists and user is present
  const isSessionValid = (currentSession: Session | null): boolean => {
    if (!currentSession || !currentSession.user) return false;
    
    // Check if token is expired (with 1 minute buffer)
    const expiresAt = currentSession.expires_at;
    if (expiresAt && expiresAt * 1000 - Date.now() < 60000) {
      console.log('Token is close to expiry, allowing refresh');
    }
    
    return true;
  };

  // Simplified auth state handler
  const handleAuthStateChange = (event: string, currentSession: Session | null) => {
    console.log('Auth state change:', event, currentSession?.user?.id);
    
    try {
      if (event === 'SIGNED_OUT') {
        console.log('User signed out - clearing state');
        setSession(null);
        setUser(null);
        setUserRole('free');
        return;
      }
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      // Update state with new session
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Fetch user role if authenticated (with timeout to prevent blocking)
      if (currentSession?.user) {
        setTimeout(() => {
          fetchUserRole(currentSession.user.id).catch(error => {
            console.error('Error fetching user role:', error);
            setUserRole('authenticated'); // Fallback role
          });
        }, 0);
      } else {
        setUserRole('free');
      }
      
    } catch (error) {
      console.error('Error in auth state change handler:', error);
      // Don't clear state on error - let Supabase handle it
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted) return;
        handleAuthStateChange(event, currentSession);
        
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error) {
          console.error('Error getting session:', error);
          // Don't clear storage on initialization errors
        }
        
        // Only validate session if it exists
        if (currentSession && !isSessionValid(currentSession)) {
          console.log('Initial session invalid, will refresh automatically');
          // Let Supabase handle the refresh automatically
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          try {
            await fetchUserRole(currentSession.user.id);
          } catch (error) {
            console.error('Error fetching user role in initialization:', error);
            setUserRole('authenticated');
          }
        } else {
          setUserRole('free');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setUserRole('free');
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
          console.log('No role record found for user, defaulting to authenticated');
          setUserRole('authenticated');
        } else {
          console.error('Error fetching user role:', error);
          setUserRole('authenticated');
        }
        return;
      }

      if (roles?.role) {
        console.log('User role found:', roles.role);
        setUserRole(roles.role as UserRole);
      } else {
        console.log('No role specified, defaulting to authenticated');
        setUserRole('authenticated');
      }
    } catch (error) {
      console.error('Exception in fetchUserRole:', error);
      setUserRole('authenticated');
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
        console.log('Sign in successful');
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
      
      await logSecurityEvent('user_signout_initiated', 'low', {
        userId: user?.id,
        email: user?.email
      });
      
      // Clear local state first
      setSession(null);
      setUser(null);
      setUserRole('free');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out from Supabase:', error);
        await logSecurityEvent('signout_error', 'medium', { 
          error: error.message 
        });
      }
      
      // Clear auth storage only after successful sign out
      clearAuthStorage();
      
      console.log('User signed out successfully');
      await logSecurityEvent('user_signed_out_complete', 'low');
      
    } catch (error) {
      console.error('Error during sign out:', error);
      await logSecurityEvent('signout_error', 'medium', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      // Ensure local state is cleared even on error
      setSession(null);
      setUser(null);
      setUserRole('free');
      
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
