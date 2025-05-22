
import { LiturgyTemplate } from '@/lib/types/liturgy';

/**
 * Template data structure for Sunday Compline
 * This can be inserted into the liturgy_templates table in Supabase
 */
export const sundayComplineTemplate: Omit<LiturgyTemplate, 'id' | 'created_at' | 'updated_at'> = {
  name: 'Sunday Compline',
  hour: 'compline',
  rank: 'sunday',
  components: {
    invitatory: '8f3a1e6b-dc2d-4e5c-b8b2-9b7ebd2f5d2a', // Placeholder ID for opening verse/invitatory
    hymn: '6d2a4c7f-9e3b-4b1d-8a5c-7f1e0d6b3a2c', // Placeholder ID for Te lucis ante terminum or similar night hymn
    psalm: ['1f2a3b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', '2e3f4a5b-6c7d-8e9f-0a1b-2c3d4e5f6a7b'], // Placeholder IDs for Psalms (typically 4, 91, and/or 134)
    reading: '3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a', // Placeholder ID for brief reading (e.g., from Revelation)
    responsory: '4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b', // Placeholder ID for brief response
    gospel_canticle: '5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c', // Placeholder ID for Nunc Dimittis (Canticle of Simeon)
    intercessions: '6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d', // Placeholder ID for brief intercessions
    concluding_prayer: '7b8c9d0e-1f2a-3b4c-5d6e-7f8a-9b0c1d2e3f', // Placeholder ID for final prayer
    blessing: '8c9d0e1f-2a3b-4c5d-6e7f-8a9b0c1d2e3f4a' // Placeholder ID for final blessing
  },
  // Optional seasonal variations
  season_overrides: {
    advent: {
      hymn: '9d0e1f2a-3b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c',
      concluding_prayer: '0e1f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b6c'
    },
    lent: {
      hymn: '1f2a3b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c7d',
      concluding_prayer: '2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d8e'
    }
  }
};

/**
 * Usage:
 * This template can be saved to Supabase using the createLiturgyTemplate function:
 * 
 * ```typescript
 * import { createLiturgyTemplate } from '@/services/liturgyService';
 * import { sundayComplineTemplate } from '@/data/templates/sunday-compline-template';
 * 
 * // To insert this template into Supabase:
 * const savedTemplate = await createLiturgyTemplate(sundayComplineTemplate);
 * ```
 * 
 * Note: The IDs in this template are placeholders. 
 * Before using this template, replace them with actual IDs of liturgy components from your database.
 */
