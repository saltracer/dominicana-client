
import { LiturgyTemplate } from '@/lib/types/liturgy';

/**
 * Template data structure for Weekday Compline
 * This can be inserted into the liturgy_templates table in Supabase
 */
export const weekdayComplineTemplate: Omit<LiturgyTemplate, 'id' | 'created_at' | 'updated_at'> = {
  name: 'Weekday Compline',
  hour: 'compline',
  rank: 'weekday',
  components: {
    invitatory: 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', // Placeholder ID for opening verse/invitatory
    hymn: 'b2c3d4e5-f6a7-b8c9-d0e1-f2a3b4c5d6e7', // Placeholder ID for a weekday night hymn
    psalm: ['c3d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e7f8', 'd4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9'], // Placeholder IDs for Psalms
    reading: 'e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0', // Placeholder ID for brief reading (different from Sunday)
    responsory: 'f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1', // Placeholder ID for brief response
    gospel_canticle: 'a7b8c9d0-e1f2-a3b4-c5d6-e7f8a9b0c1d2', // Placeholder ID for Nunc Dimittis (Canticle of Simeon)
    intercessions: 'b8c9d0e1-f2a3-b4c5-d6e7-f8a9b0c1d2e3', // Placeholder ID for brief intercessions
    concluding_prayer: 'c9d0e1f2-a3b4-c5d6-e7f8-a9b0c1d2e3f4', // Placeholder ID for final prayer
    blessing: 'd0e1f2a3-b4c5-d6e7-f8a9-b0c1d2e3f4a5' // Placeholder ID for final blessing
  },
  // Optional seasonal variations
  season_overrides: {
    advent: {
      hymn: 'e1f2a3b4-c5d6-e7f8-a9b0-c1d2e3f4a5b6',
      concluding_prayer: 'f2a3b4c5-d6e7-f8a9-b0c1-d2e3f4a5b6c7'
    },
    lent: {
      hymn: 'a3b4c5d6-e7f8-a9b0-c1d2-e3f4a5b6c7d8',
      concluding_prayer: 'b4c5d6e7-f8a9-b0c1-d2e3-f4a5b6c7d8e9'
    }
  }
};
