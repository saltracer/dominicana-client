
export interface Book {
  id: number;
  title: string;
  author: string;
  year: string;
  category: string;
  coverImage: string;
  description: string;
}

export interface Province {
  id: string
  name: string
  latinName?: string
  patronSaint?: string
  formation_date: string | number
  region: string
  region_expanded?: string
  province_saint?: string
  province_saint_feast_day?: string
  countries: string[]
  website: string
  lay_website?: string
  short_description: string
  description: string
  description_array: string[]
  coordinates: [number, number] // [longitude, latitude]
  boundaries: {
    type: string
    coordinates?: any
    properties?: any
    geometry?: {
      type: string
      coordinates?: any
    }
  }
  color: string
  notable_dominicans?: {
    name: string
    dates: string
    description: string
  }[]
  priories?: {
    name: string
    location: string
    coordinates?: [number, number]
    founded?: number
    description?: string
    isProvincialHouse?: boolean
  }[]
  apostolates?: string[]
}
