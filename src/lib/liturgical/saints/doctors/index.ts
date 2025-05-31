
export { ancientDoctors } from "./ancient-doctors"
export { medievalDoctors } from "./medieval-doctors"
export { reformationDoctors } from "./reformation-doctors"
export { modernDoctors } from "./modern-doctors"

// Combine all doctors from different eras
import { ancientDoctors } from "./ancient-doctors"
import { medievalDoctors } from "./medieval-doctors"
import { reformationDoctors } from "./reformation-doctors"
import { modernDoctors } from "./modern-doctors"

export const doctorSaints = [
  ...ancientDoctors,
  ...medievalDoctors,
  ...reformationDoctors,
  ...modernDoctors,
]
