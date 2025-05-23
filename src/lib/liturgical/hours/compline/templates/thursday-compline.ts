import type {ComplineTemplate} from "../../hour-types"

export const thursdayCompline: ComplineTemplate = {
    id: "thursday-compline",
    dayOfWeek: 4,
    title: "Night Prayer - Thursday",
    introduction: {
        type: "introduction",
        content: [
            "O God, come to our aid.",
            "O Lord, make haste to help us.",
            "Glory be to the Father and to the Son and to the Holy Spirit,",
            "as it was in the beginning, is now, and ever shall be, world without end. Amen. Alleluia."
        ],
        rubric: "The Alleluia is omitted during Lent."
    },
    hymn: {
        type: "hymn",
        title: "",
        content: []
    },
    psalmody: [
        {
            type: "psalm",
            title: "",
            content: []
        }
    ],
    reading: {
        type: "reading",
        content: []
    },
    responsory: {
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
    },
    canticle: {
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
    },
    concludingPrayer: {
        type: "prayer",
        language: "en",
        content: [
        "Lord our God,",
        "restore us again by the repose of sleep",
        "after the fatigue of our daily work,",
        "so that, continually renewed by your help,",
        "we may serve you in body and soul.",
        "Through Christ our Lord.",
        "Amen."
        ]
    },
    conclusion: {
        type: "conclusion",
        language: "en",
        content: [
        "The Lord grant us a quiet night and a perfect end.",
        "Amen.",
        "",
        ]
    },
    marian: {
        type: "marian",
        language: "en",
        title: "Salve Regina",
        content: [
        "Hail, holy Queen, mother of mercy,",
        "our life, our sweetness, and our hope.",
        "To you we cry, the children of Eve;",
        "to you we send up our sighs,",
        "mourning and weeping in this land of exile.",
        "Turn, then, most gracious advocate,",
        "your eyes of mercy toward us;",
        "lead us home at last",
        "and show us the blessed fruit of your womb, Jesus.",
        "O clement, O loving, O sweet Virgin Mary."
        ]
    }
}