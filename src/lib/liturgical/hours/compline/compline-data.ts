
import { addDays, format, isBefore, isEqual, isSameDay,parseISO } from "date-fns";
import { calculateEaster, isEaster } from "@/lib/liturgical/liturgical-seasons";
import {ComplineComponent, ComplineTemplate} from "../hour-types"

import {sundayCompline} from "./templates/sunday-compline"
import {mondayCompline} from "./templates/monday-compline"
import {tuesdayCompline} from "./templates/tuesday-compline"
import {wednesdayCompline} from "./templates/wednesday-compline"
import {thursdayCompline} from "./templates/thursday-compline"
import {fridayCompline} from "./templates/friday-compline"
import {saturdayCompline} from "./templates/saturday-compline"

// Base templates for each day of the week
const complineTemplates: ComplineTemplate[] = [
  // Sunday Compline
  sundayCompline,
  // Monday Compline
  mondayCompline,
  tuesdayCompline,
  wednesdayCompline,
  thursdayCompline,
  fridayCompline,
  saturdayCompline,
];

// Easter season overrides
const easterOverrides = {
  responsory: {
    type: "responsory",
    content: [
      "Into your hands, Lord, I commend my spirit, alleluia, alleluia.",
      "Into your hands, Lord, I commend my spirit, alleluia, alleluia.",
      "You have redeemed us, Lord God of truth.",
      "Alleluia, alleluia.",
      "Glory be to the Father and to the Son and to the Holy Spirit.",
      "Into your hands, Lord, I commend my spirit, alleluia, alleluia."
    ]
  },
  // Additional Easter overrides as needed
};

// Easter Octave special template
const easterOctaveTemplate: Partial<ComplineTemplate> = {
  id: "easter-octave-compline",
  title: "Night Prayer - Easter Octave",
  introduction: {
    type: "introduction",
    content: [
      "O God, come to our aid.",
      "O Lord, make haste to help us.",
      "Glory be to the Father and to the Son and to the Holy Spirit,",
      "as it was in the beginning, is now, and ever shall be, world without end. Amen. Alleluia."
    ]
  },
  // Special components for Easter Octave
  // ...
};

// In-memory cache for compiled templates
const templateCache = new Map<string, ComplineTemplate>();

export function isEasterOctave(date: Date): boolean {
  const easter = calculateEaster(date.getFullYear());
  const easterOctaveEnd = new Date(easter);
  easterOctaveEnd.setDate(easter.getDate() + 7);
  
  return date >= easter && date <= easterOctaveEnd;
}

export function getComplineForDate(date: Date): ComplineTemplate {
  const dateString = format(date, 'yyyy-MM-dd');
  
  // Check cache first
  if (templateCache.has(dateString)) {
    return templateCache.get(dateString)!;
  }
  
  // Determine which template to use
  let template: ComplineTemplate;
  
  if (isEasterOctave(date)) {
    // During Easter Octave, use the special template
    // For simplicity, we'll just use Sunday template with Easter Octave overrides
    const baseTemplate = {...complineTemplates.find(t => t.dayOfWeek === 0)!};
    template = {
      ...baseTemplate,
      ...easterOctaveTemplate,
      title: "Night Prayer - Easter Octave"
    } as ComplineTemplate;
  } else {
    // Regular day - use template for the day of week
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    template = {...complineTemplates.find(t => t.dayOfWeek === dayOfWeek)!};
    
    // Apply Easter season overrides if needed
    if (isEaster(date)) {
      template = {
        ...template,
        responsory: easterOverrides.responsory
      };
      
      // Add "alleluia" to appropriate parts
      if (template.canticle.antiphon) {
        template.canticle.antiphon.before = `${template.canticle.antiphon.before} Alleluia.`;
        template.canticle.antiphon.after = `${template.canticle.antiphon.after} Alleluia.`;
      }
    }
  }
  
  // Store in cache
  templateCache.set(dateString, template);
  
  return template;
}

// Clear cache for testing or when memory needs to be freed
export function clearComplineCache() {
  templateCache.clear();
}
