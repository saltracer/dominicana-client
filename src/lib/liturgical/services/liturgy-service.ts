
import { format } from 'date-fns';
import { 
  LiturgyComponent, 
  LiturgyTemplate, 
  UserLiturgyPreferences,
  LanguageCode,
  MultiLanguageContent,
  MultiLanguageChantResource
} from '../types/liturgy-types';
import { getLiturgicalSeason } from '../liturgical-seasons';
import { ChantResource } from '../types/liturgy-types';

// Import JSON data
import commonComponents from '../data/components/common-components.json';
import hymnsComponents from '../data/components/hymns.json';
import psalmsComponents from '../data/components/psalms.json';
import readingsComponents from '../data/components/readings.json';
import prayersComponents from '../data/components/prayers.json';
import complineTemplates from '../data/templates/compline-templates.json';

export class LiturgyService {
  private static components: Map<string, LiturgyComponent> = new Map();
  private static templates: Map<string, LiturgyTemplate> = new Map();
  
  static {
    // Load all components into the map
    this.loadComponents(commonComponents);
    this.loadComponents(hymnsComponents);
    this.loadComponents(psalmsComponents);
    this.loadComponents(readingsComponents);
    this.loadComponents(prayersComponents);
    
    // Load templates
    this.loadTemplates(complineTemplates);
  }
  
  private static loadComponents(componentData: any) {
    Object.values(componentData).forEach((component: any) => {
      this.components.set(component.id, component as LiturgyComponent);
    });
  }
  
  private static loadTemplates(templateData: any) {
    Object.values(templateData).forEach((template: any) => {
      this.templates.set(template.id, template as LiturgyTemplate);
    });
  }
  
  static getComponent(id: string): LiturgyComponent | undefined {
    return this.components.get(id);
  }
  
  static getTemplate(id: string): LiturgyTemplate | undefined {
    return this.templates.get(id);
  }
  
  static getComplineForDate(date: Date): LiturgyTemplate | null {
    const dayOfWeek = date.getDay();
    const templateIds = [
      'sunday-compline',
      'monday-compline',
      'tuesday-compline',
      'wednesday-compline',
      'thursday-compline',
      'friday-compline',
      'saturday-compline'
    ];
    
    const templateId = templateIds[dayOfWeek];
    return this.getTemplate(templateId) || null;
  }
  
  static renderContent(
    content: MultiLanguageContent,
    preferences: UserLiturgyPreferences
  ): string[] {
    const { primaryLanguage, secondaryLanguage, displayMode } = preferences;
    
    switch (displayMode) {
      case 'primary-only':
        return content[primaryLanguage] || content['en'] || [];
        
      case 'secondary-only':
        if (secondaryLanguage) {
          return content[secondaryLanguage] || content['en'] || [];
        }
        return content[primaryLanguage] || content['en'] || [];
        
      case 'bilingual':
        const primary = content[primaryLanguage] || content['en'] || [];
        const secondary = secondaryLanguage ? 
          (content[secondaryLanguage] || []) : [];
        
        if (secondary.length === 0) {
          return primary;
        }
        
        // Interleave primary and secondary languages
        const result: string[] = [];
        const maxLength = Math.max(primary.length, secondary.length);
        
        for (let i = 0; i < maxLength; i++) {
          if (i < primary.length && primary[i]) {
            result.push(primary[i]);
          }
          if (i < secondary.length && secondary[i]) {
            result.push(`[${secondaryLanguage?.toUpperCase()}] ${secondary[i]}`);
          }
          if (i < primary.length && primary[i] === '') {
            result.push(''); // Preserve empty lines
          }
        }
        
        return result;
        
      default:
        return content[primaryLanguage] || content['en'] || [];
    }
  }
  
  static getLiturgicalSeasonClass(date: Date): string {
    const season = getLiturgicalSeason(date);
    // Return the season name in lowercase as the class name
    return season.name.toLowerCase() || 'ordinary';
  }

  static chantContent(
    chant: MultiLanguageChantResource | undefined,
    preferences: UserLiturgyPreferences
  ): ChantResource | null {
    if (!chant) return null;
    
    const { primaryLanguage, secondaryLanguage, displayMode } = preferences;
    
    switch (displayMode) {
      case 'primary-only':
        return chant[primaryLanguage] || chant['en'];
        
      case 'secondary-only':
        if (secondaryLanguage) {
          return chant[secondaryLanguage] || chant['en'];
        }
        return chant[primaryLanguage] || chant['en'];
        
      case 'bilingual':
        // For bilingual mode, we consider it has a chant if either language has it
        const hasPrimary = chant[primaryLanguage];
        const hasSecondary = secondaryLanguage ? chant[secondaryLanguage] : null;
        const hasEnglish = chant['en'];
        
        return hasPrimary || hasSecondary || hasEnglish;
        
      default:
        return null;
    }
  }
  
  static getComplineInfo(date: Date, preferences: UserLiturgyPreferences): {
    title: string;
    dateFormatted: string;
    seasonClass: string;
    isOctave: boolean;
  } {
    const compline = this.getComplineForDate(date);
    const seasonClass = this.getLiturgicalSeasonClass(date);
    const dateFormatted = format(date, 'EEEE, MMMM d, yyyy');
    const isOctave = false; // You can implement Easter octave logic here
    
    let title = 'Night Prayer';
    if (compline) {
      const titleContent = this.renderContent(compline.title, preferences);
      title = titleContent[0] || 'Night Prayer';
    }
    
    return {
      title,
      dateFormatted,
      seasonClass,
      isOctave
    };
  }
}
