
// Fix the type instantiation is excessively deep error by simplifying the recursion
import { LiturgyComponent, LiturgyComponentType, LiturgicalUseType, LiturgyHour, LiturgyTemplate, DailyOffice, LiturgyPreferences } from '@/lib/types/liturgy';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

/**
 * Liturgy Services - Handles database interactions for liturgical components
 */

// Using types from lib/types/liturgy.ts instead of redefining them here

/**
 * Fetch all liturgical components
 */
export const fetchLiturgyComponents = async (): Promise<LiturgyComponent[]> => {
  try {
    const { data, error } = await supabase
      .from('liturgy_components')
      .select('*');

    if (error) throw error;

    return data as LiturgyComponent[];
  } catch (error) {
    console.error('Error fetching liturgy components:', error);
    return [];
  }
};

/**
 * Fetch liturgical components by type
 */
export const fetchLiturgyComponentsByType = async (
  type: LiturgyComponentType,
  options: {
    page?: number;
    pageSize?: number;
    liturgicalUse?: LiturgicalUseType;
    language?: string;
    search?: string;
  } = {}
): Promise<{ data: LiturgyComponent[], count: number }> => {
  try {
    const {
      page = 1,
      pageSize = 10,
      liturgicalUse,
      language = 'en',
      search = '',
    } = options;

    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build the query
    let query = supabase
      .from('liturgy_components')
      .select('*', { count: 'exact' })
      .eq('type', type)
      .eq('language', language)
      .range(from, to);

    // Add liturgical use filter if specified
    if (liturgicalUse) {
      query = query.eq('liturgical_use', liturgicalUse);
    }

    // Add search if specified
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data as LiturgyComponent[],
      count: count || 0,
    };
  } catch (error) {
    console.error('Error fetching liturgy components:', error);
    throw error;
  }
};

/**
 * Fetch a single liturgy component by ID
 */
export const fetchLiturgyComponentById = async (
  id: string
): Promise<LiturgyComponent | null> => {
  try {
    const { data, error } = await supabase
      .from('liturgy_components')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data as LiturgyComponent;
  } catch (error) {
    console.error('Error fetching liturgy component:', error);
    return null;
  }
};

/**
 * Create a new liturgy component
 */
export const createLiturgyComponent = async (
  component: Omit<LiturgyComponent, 'id' | 'created_at' | 'updated_at'>
): Promise<LiturgyComponent> => {
  try {
    const { data, error } = await supabase
      .from('liturgy_components')
      .insert({
        type: component.type,
        title: component.title,
        content: component.content,
        rubrics: component.rubrics,
        liturgical_use: component.liturgical_use,
        language: component.language,
        rank: component.rank,
        psalm_number: component.psalm_number,
        antiphon: component.antiphon,
        has_gloria: component.has_gloria,
        citation: component.citation,
        meter: component.meter,
        author: component.author
      })
      .select()
      .single();

    if (error) throw error;

    return data as LiturgyComponent;
  } catch (error) {
    console.error('Error creating liturgy component:', error);
    throw error;
  }
};

/**
 * Update a liturgy component
 */
export const updateLiturgyComponent = async (
  id: string,
  updates: Partial<LiturgyComponent>
): Promise<LiturgyComponent> => {
  try {
    // Extract only the fields we want to update to avoid type errors
    const updateData: Record<string, any> = {};
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.rubrics !== undefined) updateData.rubrics = updates.rubrics;
    if (updates.liturgical_use !== undefined) updateData.liturgical_use = updates.liturgical_use;
    if (updates.language !== undefined) updateData.language = updates.language;
    if (updates.rank !== undefined) updateData.rank = updates.rank;
    if (updates.psalm_number !== undefined) updateData.psalm_number = updates.psalm_number;
    if (updates.antiphon !== undefined) updateData.antiphon = updates.antiphon;
    if (updates.has_gloria !== undefined) updateData.has_gloria = updates.has_gloria;
    if (updates.citation !== undefined) updateData.citation = updates.citation;
    if (updates.meter !== undefined) updateData.meter = updates.meter;
    if (updates.author !== undefined) updateData.author = updates.author;
    
    const { data, error } = await supabase
      .from('liturgy_components')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as LiturgyComponent;
  } catch (error) {
    console.error('Error updating liturgy component:', error);
    throw error;
  }
};

/**
 * Delete a liturgy component
 */
export const deleteLiturgyComponent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('liturgy_components')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting liturgy component:', error);
    throw error;
  }
};

/**
 * Fetch liturgy templates
 */
export const fetchLiturgyTemplates = async (): Promise<LiturgyTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('liturgy_templates')
      .select('*');

    if (error) throw error;

    return data as LiturgyTemplate[];
  } catch (error) {
    console.error('Error fetching liturgy templates:', error);
    return [];
  }
};

/**
 * Fetch a single liturgy template by ID
 */
export const fetchLiturgyTemplate = async (id: string): Promise<LiturgyTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('liturgy_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data as LiturgyTemplate;
  } catch (error) {
    console.error('Error fetching liturgy template:', error);
    return null;
  }
};

/**
 * Create a new liturgy template
 */
export const createLiturgyTemplate = async (
  template: Omit<LiturgyTemplate, 'id' | 'created_at' | 'updated_at'>
): Promise<LiturgyTemplate> => {
  try {
    const { data, error } = await supabase
      .from('liturgy_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;

    return data as LiturgyTemplate;
  } catch (error) {
    console.error('Error creating liturgy template:', error);
    throw error;
  }
};

/**
 * Update a liturgy template
 */
export const updateLiturgyTemplate = async (
  id: string,
  updates: Partial<LiturgyTemplate>
): Promise<LiturgyTemplate> => {
  try {
    const { data, error } = await supabase
      .from('liturgy_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as LiturgyTemplate;
  } catch (error) {
    console.error('Error updating liturgy template:', error);
    throw error;
  }
};

/**
 * Delete a liturgy template
 */
export const deleteLiturgyTemplate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('liturgy_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting liturgy template:', error);
    throw error;
  }
};

/**
 * Fetch a daily office by date
 */
export const fetchDailyOffice = async (date: string): Promise<DailyOffice | null> => {
  try {
    const { data, error } = await supabase
      .from('daily_offices')
      .select('*')
      .eq('date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      throw error;
    }

    return data as DailyOffice;
  } catch (error) {
    console.error('Error fetching daily office:', error);
    return null;
  }
};

/**
 * Fetch user liturgy preferences
 */
export const fetchUserPreferences = async (userId: string): Promise<LiturgyPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_liturgy_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No preferences found, return default
        return null;
      }
      throw error;
    }

    return data as LiturgyPreferences;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
};

/**
 * Create or update user liturgy preferences
 */
export const createOrUpdateUserPreferences = async (
  userId: string,
  preferences: Partial<LiturgyPreferences>
): Promise<LiturgyPreferences> => {
  try {
    // Check if user preferences exist
    const { data: existingData, error: checkError } = await supabase
      .from('user_liturgy_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) throw checkError;

    let result;
    
    if (existingData) {
      // Update existing preferences
      const { data, error } = await supabase
        .from('user_liturgy_preferences')
        .update(preferences)
        .eq('user_id', userId)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      // Create new preferences
      const { data, error } = await supabase
        .from('user_liturgy_preferences')
        .insert({
          user_id: userId,
          ...preferences
        })
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }

    return result as LiturgyPreferences;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw error;
  }
};

/**
 * Get all components for a specific template
 */
export const getComponentsForTemplate = async (templateId: string): Promise<Record<string, LiturgyComponent[]>> => {
  try {
    // First, fetch the template to get the component IDs
    const { data: templateData, error: templateError } = await supabase
      .from('liturgy_templates')
      .select('*')
      .eq('id', templateId)
      .single();
      
    if (templateError) throw templateError;
    
    const template = templateData as LiturgyTemplate;
    const componentsByType: Record<string, LiturgyComponent[]> = {};
    
    // Process each component type in the template
    for (const [type, componentIds] of Object.entries(template.components)) {
      const ids = Array.isArray(componentIds) ? componentIds : [componentIds];
      
      if (ids.length > 0) {
        const { data, error } = await supabase
          .from('liturgy_components')
          .select('*')
          .in('id', ids);
          
        if (error) throw error;
        
        componentsByType[type] = data as LiturgyComponent[];
      } else {
        componentsByType[type] = [];
      }
    }
    
    return componentsByType;
  } catch (error) {
    console.error('Error fetching components for template:', error);
    return {};
  }
};
