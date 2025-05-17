export interface Saint {
  id: string
  name: string
  feast_day: string
  short_bio?: string
  biography?: string[]
  image_url?: string
  patronage?: string
  birth_year?: number
  death_year?: number
  prayers?: string
  is_dominican: boolean
  rank?: LiturgicalRank
  color?: LiturgicalColor
  proper?: string
  celebration_name?: string
  type?: "universal" | "dominican" | "both"
  books?: any[]
}

import { LiturgicalRank, LiturgicalColor } from "../liturgical-types"
