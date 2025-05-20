
import { supabase } from '@/integrations/supabase/client';

export const migrateBooks = async () => {
  try {
    // Call the Supabase Edge Function to migrate books
    const { data, error } = await supabase.functions.invoke('migrate-books');
    
    if (error) {
      console.error('Error during books migration:', error);
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error during books migration:', error);
    throw error;
  }
};
