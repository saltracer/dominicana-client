
export interface CalendarEvent {
  date: string;
  name: string;
  type: string;
  color: string;
  isDominican: boolean;
  description?: string;
}

// Temporary data for liturgical feasts and celebrations
// In a production app, this would come from an API or database
export const liturgicalEvents: CalendarEvent[] = [
  {
    date: '2024-05-16',
    name: 'St. Andrew Bobola',
    type: 'Optional Memorial',
    color: 'red',
    isDominican: false
  },
  {
    date: '2024-05-20',
    name: 'St. Bernardine of Siena',
    type: 'Optional Memorial',
    color: 'white',
    isDominican: false
  },
  {
    date: '2024-05-21',
    name: 'Bl. Hyacinth Mary Cormier',
    type: 'Optional Memorial',
    color: 'white',
    isDominican: true
  },
  {
    date: '2024-05-24',
    name: 'Translation of Our Holy Father Dominic',
    type: 'Feast',
    color: 'white',
    isDominican: true
  },
  {
    date: '2024-05-25',
    name: 'St. Mary Magdalene de Pazzi',
    type: 'Optional Memorial',
    color: 'white',
    isDominican: false
  },
  {
    date: '2024-05-26',
    name: 'Solemnity of the Most Holy Trinity',
    type: 'Solemnity',
    color: 'white',
    isDominican: false
  },
  {
    date: '2024-05-27',
    name: 'St. Augustine of Canterbury',
    type: 'Memorial',
    color: 'white',
    isDominican: false
  },
  {
    date: '2024-05-29',
    name: 'Bl. William and Companions',
    type: 'Optional Memorial',
    color: 'red',
    isDominican: true
  },
  {
    date: '2024-05-31',
    name: 'Visitation of the Blessed Virgin Mary',
    type: 'Feast',
    color: 'white',
    isDominican: false
  },
  // June events
  {
    date: '2024-06-01',
    name: 'St. Justin Martyr',
    type: 'Memorial',
    color: 'red',
    isDominican: false
  },
  {
    date: '2024-06-03',
    name: 'St. Charles Lwanga and Companions',
    type: 'Memorial',
    color: 'red',
    isDominican: false
  },
  {
    date: '2024-06-05',
    name: 'St. Boniface',
    type: 'Memorial',
    color: 'red',
    isDominican: false
  },
  {
    date: '2024-06-06',
    name: 'Corpus Christi',
    type: 'Solemnity',
    color: 'white',
    isDominican: false
  },
  {
    date: '2024-06-08',
    name: 'Bl. Diana and Blessed Cecilia',
    type: 'Memorial',
    color: 'white',
    isDominican: true
  },
  {
    date: '2024-06-09',
    name: 'St. Ephrem',
    type: 'Optional Memorial',
    color: 'white',
    isDominican: false
  },
  {
    date: '2024-06-10',
    name: 'Blessed John Dominici',
    type: 'Optional Memorial',
    color: 'white',
    isDominican: true
  },
];
