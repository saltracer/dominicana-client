
import { format, parse, isValid } from 'date-fns';

// Mapping between display names and URL slugs
export const hourSlugMap = {
  'office-of-readings': 'office-of-readings',
  'morning-prayer': 'lauds',
  'daytime-prayer': 'terce',
  'midday-prayer': 'sext',
  'afternoon-prayer': 'none',
  'evening-prayer': 'vespers',
  'night-prayer': 'compline'
} as const;

// Reverse mapping for URL to internal format
export const slugToHourMap = Object.fromEntries(
  Object.entries(hourSlugMap).map(([key, value]) => [value, key])
) as Record<string, keyof typeof hourSlugMap>;

export const hourDisplayNames = {
  'office-of-readings': 'Office of Readings',
  'morning-prayer': 'Morning Prayer (Lauds)',
  'daytime-prayer': 'Daytime Prayer (Terce)',
  'midday-prayer': 'Midday Prayer (Sext)',
  'afternoon-prayer': 'Afternoon Prayer (None)',
  'evening-prayer': 'Evening Prayer (Vespers)',
  'night-prayer': 'Night Prayer (Compline)'
} as const;

export function hourToSlug(hour: string): string {
  return hourSlugMap[hour as keyof typeof hourSlugMap] || hour;
}

export function slugToHour(slug: string): string {
  return slugToHourMap[slug] || slug;
}

export function dateToUrlString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function urlStringToDate(dateString: string): Date | null {
  try {
    const parsed = parse(dateString, 'yyyy-MM-dd', new Date());
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function buildLiturgyUrl(hour?: string, date?: Date): string {
  const basePath = '/prayer/liturgy-of-the-hours';
  
  if (!hour && !date) {
    return basePath;
  }
  
  if (hour && !date) {
    return `${basePath}/${hourToSlug(hour)}`;
  }
  
  if (hour && date) {
    return `${basePath}/${hourToSlug(hour)}/${dateToUrlString(date)}`;
  }
  
  return basePath;
}

export function isValidHourSlug(slug: string): boolean {
  return Object.values(hourSlugMap).includes(slug as any) || Object.keys(hourSlugMap).includes(slug);
}
