
import { LiturgicalSeason, CelebrationRank } from '@/lib/liturgical/liturgical-types';

export type LiturgyComponentType = 
  | 'invitatory'
  | 'hymn' 
  | 'antiphon'
  | 'psalm'
  | 'canticle'
  | 'reading'
  | 'responsory'
  | 'gospel_canticle'
  | 'intercessions'
  | 'concluding_prayer'
  | 'blessing';

export type LiturgicalUseType = 
  | 'ordinary'
  | 'proper_of_seasons'
  | 'proper_of_saints'
  | 'common_of_saints'
  | 'special';

export type LiturgyHour = 
  | 'office_of_readings'
  | 'lauds'
  | 'terce'
  | 'sext'
  | 'none'
  | 'vespers'
  | 'compline';

export interface LiturgyComponent {
  id: string;
  type: LiturgyComponentType;
  title?: string;
  content: any; // JSONB content
  rubrics?: string;
  liturgical_use: LiturgicalUseType;
  language: string;
  rank: number;
  psalm_number?: number;
  antiphon?: string;
  has_gloria?: boolean;
  citation?: string;
  meter?: string;
  author?: string;
  created_at: string;
  updated_at: string;
}

export interface LiturgyTemplate {
  id: string;
  name: string;
  hour: string;
  rank: string;
  components: Record<string, string | string[]>; // JSONB mapping component types to IDs
  season_overrides?: Record<string, Record<string, string | string[]>>; // JSONB for seasonal overrides
  created_at: string;
  updated_at: string;
}

export interface DailyOffice {
  id: string;
  date: string;
  celebration_id: string;
  alternative_celebrations?: string[]; // JSONB array of celebration IDs
  templates: Record<string, string>; // JSONB mapping hours to template IDs
  component_overrides?: Record<string, string>; // JSONB for component substitutions
  created_at: string;
  updated_at: string;
}

export interface LiturgyPreferences {
  user_id: string;
  language: string;
  display_options: {
    showRubrics: boolean;
    showLatinTexts: boolean;
    textSize: 'small' | 'medium' | 'large';
    useNightMode: boolean;
  };
  memorial_preference: 'optional' | 'required' | 'both';
  calendar_type: 'general' | 'dominican';
  created_at: string;
  updated_at: string;
}
