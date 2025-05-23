import type {ComplineComponent} from "../../hour-types"
import { nowThatTheDaylightDiesAway } from "./hymns"

export { nowThatTheDaylightDiesAway }

export const introduction: ComplineComponent = {
    id: "compline-introduction",
    type: "introduction",
    language: "en",
    content: [
    "O God, come to my assistance.",
    "O Lord, make haste to help me.",
    "Glory be to the Father and to the Son and to the Holy Spirit,",
    "as it was in the beginning, is now, and ever shall be, world without end. Amen. Alleluia."
    ],
    rubric: "The Alleluia is omitted during Lent."
}