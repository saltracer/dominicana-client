
import { format } from 'date-fns';
import { ComplineTemplate, getComplineForDate, isEasterOctave } from './compline-data';
import { getLiturgicalSeason } from '../../liturgical-seasons';

export class ComplineService {
  // Get the complete Compline for a specific date
  static getCompline(date: Date): ComplineTemplate {
    return getComplineForDate(date);
  }
  
  // Get the liturgical season for styling
  static getLiturgicalSeasonClass(date: Date): string {
    const season = getLiturgicalSeason(date);
    
    switch(season.name.toLowerCase()) {
      case 'lent':
        return 'lent';
      case 'easter':
        return 'easter';
      case 'pentecost':
        return 'pentecost';
      case 'christmas':
        return 'christmas';
      case 'advent':
        return 'advent';
      default:
        return 'ordinary';
    }
  }
  
  // Get info about the current compline
  static getComplineInfo(date: Date): {
    title: string;
    dateFormatted: string;
    seasonClass: string;
    isOctave: boolean;
  } {
    const compline = this.getCompline(date);
    const seasonClass = this.getLiturgicalSeasonClass(date);
    const dateFormatted = format(date, 'EEEE, MMMM d, yyyy');
    const isOctave = isEasterOctave(date);
    
    return {
      title: compline.title,
      dateFormatted,
      seasonClass,
      isOctave
    };
  }
}
