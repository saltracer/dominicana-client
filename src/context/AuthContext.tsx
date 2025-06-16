
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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Log auth events for security monitoring
        if (event === 'SIGNED_IN') {
          logSecurityEvent('user_signed_in', 'low', { userId: currentSession?.user?.id });
        } else if (event === 'SIGNED_OUT') {
          logSecurityEvent('user_signed_out', 'low');
        }
        
        // When auth state changes, check user role
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserRole(currentSession.user.id);
          }, 0);
        } else {
          setUserRole('free');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserRole(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole('authenticated'); // Default role if error
        return;
      }

      if (roles?.role) {
        setUserRole(roles.role as UserRole);
      } else {
        setUserRole('authenticated'); // Default role if no specific role is assigned
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
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

    const result = await supabase.auth.signInWithPassword({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (result.error) {
      await logSecurityEvent('failed_signin_attempt', 'medium', { 
        email,
        error: result.error.message 
      });
    }

    return result;
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

    return supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole('free');
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
