
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

  // Simplified localStorage cleanup - only clear on explicit sign out
  const clearAuthStorage = () => {
    try {
      const authKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('supabase.auth.token')) {
          authKeys.push(key);
        }
      }
      
      authKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log('Cleared auth token:', key);
        } catch (error) {
          console.warn('Failed to clear auth token:', key, error);
        }
      });
    } catch (error) {
      console.error('Error clearing auth storage:', error);
    }
  };

  // Fetch user role without causing deadlocks
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
          console.log('No role record found, defaulting to authenticated');
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
        setUserRole('authenticated');
      }
    } catch (error) {
      console.error('Exception in fetchUserRole:', error);
      setUserRole('authenticated');
    }
  };

  // Simplified auth state handler
  const handleAuthStateChange = async (event: string, currentSession: Session | null) => {
    console.log('Auth state change:', event, currentSession?.user?.id);
    
    try {
      // Handle sign out immediately
      if (event === 'SIGNED_OUT') {
        console.log('User signed out - clearing state');
        setSession(null);
        setUser(null);
        setUserRole('free');
        return;
      }

      // Handle token refresh
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        await logSecurityEvent('token_refreshed', 'low', { 
          userId: currentSession?.user?.id 
        });
      }

      // Handle sign in
      if (event === 'SIGNED_IN') {
        console.log('User signed in');
        await logSecurityEvent('user_signed_in', 'low', { 
          userId: currentSession?.user?.id,
          email: currentSession?.user?.email 
        });
      }

      // Update session and user state
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Fetch user role for authenticated users (deferred to prevent deadlocks)
      if (currentSession?.user) {
        setTimeout(async () => {
          try {
            await fetchUserRole(currentSession.user.id);
          } catch (error) {
            console.error('Error fetching user role:', error);
            setUserRole('authenticated');
          }
        }, 100);
      } else {
        setUserRole('free');
      }
      
    } catch (error) {
      console.error('Error in auth state change handler:', error);
      await logSecurityEvent('auth_state_change_error', 'high', { 
        event,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;
        
        await handleAuthStateChange(event, currentSession);
        
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
          await logSecurityEvent('session_retrieval_error', 'medium', { error: error.message });
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
          await logSecurityEvent('auth_initialization_error', 'high', { 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
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

  const checkUserRole = async () => {
    if (user) {
      await fetchUserRole(user.id);
    }
  };

  const updateUserRole = async (email: string, role: UserRole) => {
    // Rate limiting for role updates
    const rateLimitKey = `role_update_${user?.id}`;
    if (!checkRateLimit(rateLimitKey, 3, 300000)) {
      await logSecurityEvent('role_update_rate_limit_exceeded', 'high', { 
        email, 
        attemptedRole: role 
      });
      throw new Error('Too many role update attempts. Please wait before trying again.');
    }

    if (userRole !== 'admin') {
      await logSecurityEvent('unauthorized_role_update_attempt', 'high', { 
        email, 
        attemptedRole: role,
        currentUserRole: userRole 
      });
      throw new Error('Unauthorized: Only admins can update roles');
    }

    if (!validateUserRole(role)) {
      await logSecurityEvent('invalid_role_update_attempt', 'medium', { 
        email, 
        attemptedRole: role 
      });
      throw new Error('Invalid role specified');
    }

    try {
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
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ 
            role: role,
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingRole.id);
        
        error = updateError;
      } else {
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
      
      await logAdminAction('update_user_role', 'user_roles', userId, {
        email,
        oldRole,
        newRole: role
      });
      
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
    if (!checkRateLimit(rateLimitKey, 5, 900000)) {
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
    if (!checkRateLimit(rateLimitKey, 3, 3600000)) {
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
      
      // Sign out from Supabase first
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out from Supabase:', error);
        await logSecurityEvent('signout_error', 'medium', { 
          error: error.message 
        });
      }
      
      // Clear state and storage after sign out
      setSession(null);
      setUser(null);
      setUserRole('free');
      clearAuthStorage();
      
      console.log('User signed out successfully');
      await logSecurityEvent('user_signed_out_complete', 'low');
      
    } catch (error) {
      console.error('Error during sign out:', error);
      await logSecurityEvent('signout_error', 'medium', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      // Clear local state even on error
      setSession(null);
      setUser(null);
      setUserRole('free');
      clearAuthStorage();
      
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
