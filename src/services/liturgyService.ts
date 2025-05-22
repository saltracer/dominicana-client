import { supabase } from '@/integrations/supabase/client';
import { LiturgyComponent, LiturgyTemplate, DailyOffice, LiturgyPreferences } from '@/lib/types/liturgy';

// Liturgy Components Service
export const fetchLiturgyComponent = async (id: string): Promise<LiturgyComponent | null> => {
  const { data, error } = await supabase
    .from('liturgy_components')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching liturgy component:', error);
    return null;
  }

  return data as LiturgyComponent;
};

export const fetchLiturgyComponents = async (filters?: Partial<Omit<LiturgyComponent, 'content' | 'components'>>): Promise<LiturgyComponent[]> => {
  let query = supabase.from('liturgy_components').select('*');

  // Apply any filters if provided
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching liturgy components:', error);
    return [];
  }

  return data as LiturgyComponent[];
};

export const createLiturgyComponent = async (component: Omit<LiturgyComponent, 'id' | 'created_at' | 'updated_at'>): Promise<LiturgyComponent | null> => {
  const { data, error } = await supabase
    .from('liturgy_components')
    .insert([component])
    .select()
    .single();

  if (error) {
    console.error('Error creating liturgy component:', error);
    return null;
  }

  return data as LiturgyComponent;
};

export const updateLiturgyComponent = async (id: string, updates: Partial<LiturgyComponent>): Promise<LiturgyComponent | null> => {
  const { data, error } = await supabase
    .from('liturgy_components')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating liturgy component:', error);
    return null;
  }

  return data as LiturgyComponent;
};

export const deleteLiturgyComponent = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('liturgy_components')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting liturgy component:', error);
    return false;
  }

  return true;
};

// Liturgy Templates Service
export const fetchLiturgyTemplate = async (id: string): Promise<LiturgyTemplate | null> => {
  const { data, error } = await supabase
    .from('liturgy_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching liturgy template:', error);
    return null;
  }

  return data as LiturgyTemplate;
};

export const fetchLiturgyTemplates = async (filters?: Partial<Omit<LiturgyTemplate, 'components' | 'season_overrides'>>): Promise<LiturgyTemplate[]> => {
  let query = supabase.from('liturgy_templates').select('*');

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching liturgy templates:', error);
    return [];
  }

  return data as LiturgyTemplate[];
};

export const createLiturgyTemplate = async (template: Omit<LiturgyTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<LiturgyTemplate | null> => {
  const { data, error } = await supabase
    .from('liturgy_templates')
    .insert([template])
    .select()
    .single();

  if (error) {
    console.error('Error creating liturgy template:', error);
    return null;
  }

  return data as LiturgyTemplate;
};

export const updateLiturgyTemplate = async (id: string, updates: Partial<LiturgyTemplate>): Promise<LiturgyTemplate | null> => {
  const { data, error } = await supabase
    .from('liturgy_templates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating liturgy template:', error);
    return null;
  }

  return data as LiturgyTemplate;
};

export const deleteLiturgyTemplate = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('liturgy_templates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting liturgy template:', error);
    return false;
  }

  return true;
};

// Daily Offices Service
export const fetchDailyOffice = async (date: string): Promise<DailyOffice | null> => {
  const { data, error } = await supabase
    .from('daily_offices')
    .select('*')
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
    console.error('Error fetching daily office:', error);
    return null;
  }

  return data as DailyOffice;
};

export const createDailyOffice = async (office: Omit<DailyOffice, 'id' | 'created_at' | 'updated_at'>): Promise<DailyOffice | null> => {
  const { data, error } = await supabase
    .from('daily_offices')
    .insert([office])
    .select()
    .single();

  if (error) {
    console.error('Error creating daily office:', error);
    return null;
  }

  return data as DailyOffice;
};

export const updateDailyOffice = async (id: string, updates: Partial<DailyOffice>): Promise<DailyOffice | null> => {
  const { data, error } = await supabase
    .from('daily_offices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating daily office:', error);
    return null;
  }

  return data as DailyOffice;
};

// User Preferences Service
export const fetchUserPreferences = async (userId: string): Promise<LiturgyPreferences | null> => {
  const { data, error } = await supabase
    .from('user_liturgy_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user preferences:', error);
    return null;
  }

  return data as LiturgyPreferences;
};

export const createOrUpdateUserPreferences = async (
  userId: string, 
  preferences: Partial<Omit<LiturgyPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<LiturgyPreferences | null> => {
  // Check if preferences exist for this user
  const existing = await fetchUserPreferences(userId);
  
  if (existing) {
    // Update existing preferences
    const { data, error } = await supabase
      .from('user_liturgy_preferences')
      .update(preferences)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }

    return data as LiturgyPreferences;
  } else {
    // Create new preferences
    const { data, error } = await supabase
      .from('user_liturgy_preferences')
      .insert([{ user_id: userId, ...preferences }])
      .select()
      .single();

    if (error) {
      console.error('Error creating user preferences:', error);
      return null;
    }

    return data as LiturgyPreferences;
  }
};

// Helper functions for component selection
export const getComponentsForTemplate = async (templateId: string): Promise<Record<string, LiturgyComponent | LiturgyComponent[]>> => {
  // First fetch the template
  const template = await fetchLiturgyTemplate(templateId);
  if (!template) return {};
  
  // Collect all component IDs from the template
  const componentIds = new Set<string>();
  Object.values(template.components).forEach(idOrIds => {
    if (Array.isArray(idOrIds)) {
      idOrIds.forEach(id => componentIds.add(id));
    } else {
      componentIds.add(idOrIds);
    }
  });
  
  // Fetch all components in one query
  const { data: components, error } = await supabase
    .from('liturgy_components')
    .select('*')
    .in('id', Array.from(componentIds));
  
  if (error || !components) {
    console.error('Error fetching components for template:', error);
    return {};
  }
  
  // Organize by component type
  const result: Record<string, LiturgyComponent | LiturgyComponent[]> = {};
  Object.entries(template.components).forEach(([type, idOrIds]) => {
    if (Array.isArray(idOrIds)) {
      result[type] = components.filter(c => idOrIds.includes(c.id)) as LiturgyComponent[];
    } else {
      result[type] = components.find(c => c.id === idOrIds) as LiturgyComponent;
    }
  });
  
  return result;
};
