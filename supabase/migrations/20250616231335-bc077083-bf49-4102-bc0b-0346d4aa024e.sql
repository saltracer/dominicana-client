
-- Phase 1: Critical RLS Policy Fixes

-- First, let's clean up the duplicate policies on user_liturgy_preferences
DROP POLICY IF EXISTS "Users can view their own liturgy preferences" ON public.user_liturgy_preferences;
DROP POLICY IF EXISTS "Users can update their own liturgy preferences" ON public.user_liturgy_preferences;
DROP POLICY IF EXISTS "Users can insert their own liturgy preferences" ON public.user_liturgy_preferences;

-- Enable RLS on user_liturgy_preferences if not already enabled
ALTER TABLE public.user_liturgy_preferences ENABLE ROW LEVEL SECURITY;

-- Create clean, non-duplicate policies for user_liturgy_preferences
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

-- Enable RLS on tables that currently don't have it
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liturgy_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liturgy_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for books table (should be publicly readable)
CREATE POLICY "books_public_read" 
  ON public.books 
  FOR SELECT 
  TO public 
  USING (true);

-- Only admins can modify books
CREATE POLICY "books_admin_write" 
  ON public.books 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for liturgy_components (publicly readable liturgical content)
CREATE POLICY "liturgy_components_public_read" 
  ON public.liturgy_components 
  FOR SELECT 
  TO public 
  USING (true);

-- Only admins can modify liturgy components
CREATE POLICY "liturgy_components_admin_write" 
  ON public.liturgy_components 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for liturgy_templates (publicly readable)
CREATE POLICY "liturgy_templates_public_read" 
  ON public.liturgy_templates 
  FOR SELECT 
  TO public 
  USING (true);

-- Only admins can modify liturgy templates
CREATE POLICY "liturgy_templates_admin_write" 
  ON public.liturgy_templates 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for daily_offices (publicly readable)
CREATE POLICY "daily_offices_public_read" 
  ON public.daily_offices 
  FOR SELECT 
  TO public 
  USING (true);

-- Only admins can modify daily offices
CREATE POLICY "daily_offices_admin_write" 
  ON public.daily_offices 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Enable RLS on user_roles table for security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "user_roles_view_own" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Only admins can modify user roles
CREATE POLICY "user_roles_admin_manage" 
  ON public.user_roles 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Create a security definer function to safely check admin status
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
