import type {ComplineComponent} from "../../hour-types"
import { nowThatTheDaylightDiesAway, salveRegina } from "./hymns"

export { nowThatTheDaylightDiesAway, salveRegina }

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

export const nuncDimittis: ComplineComponent = {
    id: "compline-canticle-nunc-dimittis",
    type: "canticle",
    language: "en",
    title: "Nunc Dimittis",
    antiphon: {
        before: "Save us, Lord, while we are awake; protect us while we sleep; that we may keep watch with Christ and rest with him in peace.",
        after: "Save us, Lord, while we are awake; protect us while we sleep; that we may keep watch with Christ and rest with him in peace."
    },
    content: [
        "At last, all-powerful Master,",
        "you give leave to your servant to go in peace,",
        "according to your promise.",
        "",
        "For my eyes have seen your salvation",
        "which you have prepared for all nations,",
        "the light to enlighten the Gentiles",
        "and give glory to Israel, your people.",
        "",
        "Glory be to the Father and to the Son",
        "and to the Holy Spirit,",
        "as it was in the beginning,",
        "is now, and ever shall be,",
        "world without end. Amen."
    ]
};

export const complineShortResponsory = {
    type: "responsory",
    language: "en",
    content: [
        "Into your hands, Lord, I commend my spirit.",
        "Into your hands, Lord, I commend my spirit.",
        "You have redeemed us, Lord God of truth.",
        "I commend my spirit.",
        "Glory be to the Father and to the Son and to the Holy Spirit.",
        "Into your hands, Lord, I commend my spirit."
    ]
};

export const complineConclusion = {
    type: "conclusion",
    language: "en",
    content: [
        "The Lord grant us a quiet night and a perfect death.",
        "Amen."
    ]
};
