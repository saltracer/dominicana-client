
export interface Province {
  id: string
  name: string
  latinName?: string
  patronSaint?: string
  formation_date: string | number
  region: string
  region_expanded?: string
  countries: string[]
  website: string
  lay_website?: string
  short_description: string
  description: string
  description_array: string[]
  coordinates: [number, number] // [longitude, latitude]
  boundaries: {
    type: string
    coordinates: any
    properties?: any
    geometry?: any
  }
  color: string
  priories?: {
    name: string
    location: string
    coordinates: [number, number]
    foundedYear: number
    isProvincialHouse?: boolean
  }[]
}
