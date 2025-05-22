
import { LiturgyTemplate } from '@/lib/types/liturgy';

/**
 * Template data structure for Wednesday Compline
 */
export const wednesdayComplineTemplate: Omit<LiturgyTemplate, 'id' | 'created_at' | 'updated_at'> = {
  name: 'Wednesday Compline',
  hour: 'compline',
  rank: 'weekday',
  components: {
    invitatory: 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6',
    hymn: 'b2c3d4e5-f6a7-b8c9-d0e1-f2a3b4c5d6e7', // Wednesday night hymn
    psalm: ['c3d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e7f8', 'd4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9'], // Wednesday psalms
    reading: 'e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0', // Wednesday reading
    responsory: 'f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1',
    gospel_canticle: 'a7b8c9d0-e1f2-a3b4-c5d6-e7f8a9b0c1d2',
    intercessions: 'b8c9d0e1-f2a3-b4c5-d6e7-f8a9b0c1d2e3', // Wednesday intercessions
    concluding_prayer: 'c9d0e1f2-a3b4-c5d6-e7f8-a9b0c1d2e3f4', // Wednesday concluding prayer
    blessing: 'd0e1f2a3-b4c5-d6e7-f8a9-b0c1d2e3f4a5'
  },
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
