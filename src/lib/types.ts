export interface Province {
  id: string
  name: string
  formation_date: string
  region: string
  region_expanded: string
  countries: string[]
  website: string
  lay_website: string
  short_description: string
  description: string
  description_array: string[]
  coordinates: [number, number] // [longitude, latitude]
  boundaries: {
    type: "Polygon" | "MultiPolygon"
    coordinates: number[][][] | number[][][][]
  }
  color: string
}