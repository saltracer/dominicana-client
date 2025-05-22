
// Fix the type instantiation is excessively deep error by simplifying the recursion
import { LiturgicalDay, LiturgicalHour } from '@/lib/types/liturgy';
import { supabase } from '@/integrations/supabase/client';

/**
 * Liturgy Services - Handles database interactions for liturgical components
 */

export type LiturgyComponentType = 
  | 'psalm' 
  | 'hymn' 
  | 'reading' 
  | 'responsory' 
  | 'canticle' 
  | 'prayer'
  | 'antiphon';

export type LiturgicalUse = 
  | 'general' 
  | 'sunday' 
  | 'weekday' 
  | 'feast' 
  | 'solemnity'
  | 'memorial';

export interface LiturgyComponent {
  id: string;
  type: LiturgyComponentType;
  title?: string;
  content: any; // We'll adjust this based on component type needs
  liturgical_use: LiturgicalUse;
  language: string;
  psalm_number?: number;
  rubrics?: string;
  rank?: number;
  has_gloria?: boolean;
  author?: string;
  citation?: string;
  meter?: string;
  antiphon?: string;
}

export interface LiturgyTemplate {
  id: string;
  name: string;
  hour: string;
  rank: string;
  components: Record<string, string[]>; // Component type to component IDs
  season_overrides?: Record<string, Record<string, string[]>>;
}

export interface DailyOffice {
  id: string;
  date: string;
  celebration_id: string;
  templates: Record<string, string>; // hour to template ID
  component_overrides?: Record<string, Record<string, string[]>>;
  alternative_celebrations?: string[];
}

/**
 * Fetch liturgical components by type
 */
export const fetchLiturgyComponentsByType = async (
  type: LiturgyComponentType,
  options: {
    page?: number;
    pageSize?: number;
    liturgicalUse?: LiturgicalUse;
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
  component: Omit<LiturgyComponent, 'id'>
): Promise<LiturgyComponent> => {
  try {
    const { data, error } = await supabase
      .from('liturgy_components')
      .insert(component)
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
    const { data, error } = await supabase
      .from('liturgy_components')
      .update(updates)
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
export const deleteLiturgyComponent = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('liturgy_components')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting liturgy component:', error);
    throw error;
  }
};
