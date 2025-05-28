
import type { Saint } from "./saint-types"
import { dominicanSaints } from "./saint-dominicans"
import { doctorSaints } from "./saint-doctors"
import { generalSaints } from "./index"

// Combine all saints from all sources
export const allSaintsCombined: Saint[] = [
  ...dominicanSaints,
  ...doctorSaints, 
  ...generalSaints,
];
