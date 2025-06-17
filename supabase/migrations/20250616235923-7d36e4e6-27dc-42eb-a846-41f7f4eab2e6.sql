
-- Phase 1: Critical RLS Policy Fixes (Updated)

-- First, let's check and drop existing policies more carefully
DROP POLICY IF EXISTS "user_liturgy_preferences_select_own" ON public.user_liturgy_preferences;
DROP POLICY IF EXISTS "user_liturgy_preferences_insert_own" ON public.user_liturgy_preferences;
DROP POLICY IF EXISTS "user_liturgy_preferences_update_own" ON public.user_liturgy_preferences;
DROP POLICY IF EXISTS "Users can view their own liturgy preferences" ON public.user_liturgy_preferences;
DROP POLICY IF EXISTS "Users can update their own liturgy preferences" ON public.user_liturgy_preferences;
DROP POLICY IF EXISTS "Users can insert their own liturgy preferences" ON public.user_liturgy_preferences;

-- Drop existing policies on other tables that might exist
DROP POLICY IF EXISTS "books_public_read" ON public.books;
DROP POLICY IF EXISTS "books_admin_write" ON public.books;
DROP POLICY IF EXISTS "liturgy_components_public_read" ON public.liturgy_components;
DROP POLICY IF EXISTS "liturgy_components_admin_write" ON public.liturgy_components;
DROP POLICY IF EXISTS "liturgy_templates_public_read" ON public.liturgy_templates;
DROP POLICY IF EXISTS "liturgy_templates_admin_write" ON public.liturgy_templates;
DROP POLICY IF EXISTS "daily_offices_public_read" ON public.daily_offices;
DROP POLICY IF EXISTS "daily_offices_admin_write" ON public.daily_offices;
DROP POLICY IF EXISTS "user_roles_view_own" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_admin_manage" ON public.user_roles;

-- Enable RLS on all tables
ALTER TABLE public.user_liturgy_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liturgy_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liturgy_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create the security definer function first (to avoid circular dependencies)
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Create clean policies for user_liturgy_preferences
CREATE POLICY "user_liturgy_preferences_select_own" 
  ON public.user_liturgy_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "user_liturgy_preferences_insert_own" 
  ON public.user_liturgy_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_liturgy_preferences_update_own" 
  ON public.user_liturgy_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for books table (publicly readable)
CREATE POLICY "books_public_read" 
  ON public.books 
  FOR SELECT 
  TO public 
  USING (true);

-- Only admins can modify books (using the security definer function)
CREATE POLICY "books_admin_write" 
  ON public.books 
  FOR ALL 
  TO authenticated 
  USING (public.is_current_user_admin())
  WITH CHECK (public.is_current_user_admin());

-- Create policies for liturgy_components (publicly readable)
CREATE POLICY "liturgy_components_public_read" 
  ON public.liturgy_components 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "liturgy_components_admin_write" 
  ON public.liturgy_components 
  FOR ALL 
  TO authenticated 
  USING (public.is_current_user_admin())
  WITH CHECK (public.is_current_user_admin());

-- Create policies for liturgy_templates (publicly readable)
CREATE POLICY "liturgy_templates_public_read" 
  ON public.liturgy_templates 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "liturgy_templates_admin_write" 
  ON public.liturgy_templates 
  FOR ALL 
  TO authenticated 
  USING (public.is_current_user_admin())
  WITH CHECK (public.is_current_user_admin());

-- Create policies for daily_offices (publicly readable)
CREATE POLICY "daily_offices_public_read" 
  ON public.daily_offices 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "daily_offices_admin_write" 
  ON public.daily_offices 
  FOR ALL 
  TO authenticated 
  USING (public.is_current_user_admin())
  WITH CHECK (public.is_current_user_admin());

-- Create policies for user_roles (users can view their own, only admins can manage)
CREATE POLICY "user_roles_view_own" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "user_roles_admin_manage" 
  ON public.user_roles 
  FOR ALL 
  TO authenticated 
  USING (public.is_current_user_admin())
  WITH CHECK (public.is_current_user_admin());
