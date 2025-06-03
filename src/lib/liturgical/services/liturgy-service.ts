import { format } from 'date-fns';
import { 
  LiturgyComponent, 
  LiturgyTemplate, 
  UserLiturgyPreferences,
  LanguageCode,
  MultiLanguageContent,
  MultiLanguageChantResource
} from '../types/liturgy-types';
import { getLiturgicalSeason, calculateFirstAdventSunday, getHolyThursday, calculateEaster, getPentecostSunday } from '../liturgical-seasons';
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
  
  static renderContentForLanguage(content: any, language: string): string[] {
    if (!content) return [];
    
    if (typeof content === 'string') {
      return [content];
    }
    
    if (Array.isArray(content)) {
      return content;
    }
    
    if (typeof content === 'object' && content[language]) {
      return Array.isArray(content[language]) ? content[language] : [content[language]];
    }
    
    // Fallback to English if requested language not available
    if (typeof content === 'object' && content.en && language !== 'en') {
      return Array.isArray(content.en) ? content.en : [content.en];
    }
    
    return [];
  }
  
  static getLiturgicalSeasonClass(date: Date): string {
    const season = getLiturgicalSeason(date);
    return season.name.toLowerCase() || 'ordinary';
  }

  /**
   * Determines which Marian antiphon should be used after Compline on a given date
   */
  static getMarianAntiphonPeriod(date: Date): 'alma-redemptoris-mater' | 'ave-regina-caelorum' | 'regina-caeli' | 'salve-regina' {
    // Helper function to create a date with time set to 00:00:00 for accurate date-only comparison
    const createDate = (year: number, month: number, day: number): Date => {
      return new Date(Date.UTC(year, month, day, 0, 0, 0));
    };
    
    // Helper function to get date portion for comparison
    const getDatePortion = (d: Date): Date => {
      return createDate(d.getFullYear(), d.getMonth(), d.getDate());
    };
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get important dates using functions from liturgical-seasons.ts
    let advent1 = getDatePortion(calculateFirstAdventSunday(createDate(year, 11, 25)));
    let christmas = createDate(year, 11, 25); // Dec 25
    let presentation = createDate(year, 1, 2); // Feb 2
    if (month === 11) {
      advent1 = getDatePortion(calculateFirstAdventSunday(createDate(year, 11, 25)));
      christmas = createDate(year, 11, 25); // Dec 25
      presentation = createDate(year+1, 1, 2); // Feb 2
    }
    if (month === 0 || month === 1) {
      advent1 = getDatePortion(calculateFirstAdventSunday(createDate(year-1, 11, 25)));
      christmas = createDate(year-1, 11, 25); // Dec 25
      presentation = createDate(year, 1, 2); // Feb 2
    }

    const easter = getDatePortion(calculateEaster(year));
    const pentecost = getDatePortion(getPentecostSunday(year));
    const currentDate = getDatePortion(date);
    
    // Get timestamps for comparison (time portion will be 00:00:00)
    const advent1Ts = advent1.getTime();
    const christmasTs = christmas.getTime();
    const presentationTs = presentation.getTime();
    const easterTs = easter.getTime();
    const pentecostTs = pentecost.getTime();
    const currentTs = currentDate.getTime();
    
    // Determine the period
    if (currentTs >= advent1Ts && currentTs < christmasTs) {
      // From First Sunday of Advent until Christmas
      // console.log("Advent: ", new Date(advent1Ts).toISOString())
      // console.log("Date: ", new Date(currentTs).toISOString())
      // console.log("Christmas: ", new Date(christmasTs).toISOString())
      return 'alma-redemptoris-mater';
    } else if (currentTs >= christmasTs && currentTs < presentationTs) {
      // console.log("Christmas: ", new Date(christmasTs).toISOString())
      // console.log("Date: ", new Date(currentTs).toISOString())
      // console.log("Presentation: ", new Date(presentationTs).toISOString())
      // From Christmas until Feb 1 (inclusive)
      return 'alma-redemptoris-mater';
    } else if (currentTs >= presentationTs && currentTs < easterTs) {
      // From Feb 2 until Easter Vigil (therefore exclusive of Easter day)
      // console.log("Presentation: ", new Date(presentationTs).toISOString())
      // console.log("Date: ", new Date(currentTs).toISOString())
      // console.log("Easter: ", new Date(easterTs).toISOString())
      return 'ave-regina-caelorum';
    } else if (currentTs >= easterTs && currentTs <= pentecostTs) {
      // From Easter Sunday until Pentecost Sunday (inclusive)
      // console.log("Easter: ", new Date(easterTs).toISOString())
      // console.log("Date: ", new Date(currentTs).toISOString())
      // console.log("Pentecost: ", new Date(pentecostTs).toISOString())
      return 'regina-caeli';
    } else {
      // From day after Pentecost until day before First Sunday of Advent
      // console.log("Pentecost: ", new Date(pentecostTs).toISOString())
      // console.log("Date: ", new Date(currentTs).toISOString())
      // console.log("Advent: ", new Date(advent1Ts).toISOString())   
      
      // console.log("Christmas: ", new Date(christmasTs).toISOString())
      // console.log("Date: ", new Date(currentTs).toISOString())
      // console.log("Presentation: ", new Date(presentationTs).toISOString())

      return 'salve-regina';
    }
  }
  
/*
The four Marian antiphons are sung at specific times during the liturgical year of the Catholic Church. 
Alma Redemptoris Mater: Sung from the First Sunday of Advent until the vigil of theFeast of the Presentation of the Lord (February 2). 
Ave Regina Caelorum: Sung from the Feast of the Presentation of the Lord (February 2) until the Easter Vigil. 
Regina Caeli: Sung from Easter Vigil until Pentecost Sunday. 
Salve Regina: Sung from the day after Pentecost until the First Sunday of Advent. 
*/

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
