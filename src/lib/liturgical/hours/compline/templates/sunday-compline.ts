import type {ComplineTemplate} from "../../hour-types"
import { introduction, nowThatTheDaylightDiesAway } from "../components"

export const sundayCompline: ComplineTemplate = {
    id: "sunday-compline",
    dayOfWeek: 0,
    title: "Night Prayer - Sunday",
    introduction: introduction,
    hymn: nowThatTheDaylightDiesAway,
    psalmody: [
        {
        type: "psalm",
        language: "en",
        title: "Psalm 91",
        antiphon: {
            before: "Night holds no terrors for me sleeping under God's wings.",
            after: "Night holds no terrors for me sleeping under God's wings."
        },
        content: [
            "He who dwells in the shelter of the Most High",
            "and abides in the shade of the Almighty",
            "says to the Lord: 'My refuge,",
            "my stronghold, my God in whom I trust!'",
            "",
            "It is he who will free you from the snare",
            "of the fowler who seeks to destroy you;",
            "he will conceal you with his pinions",
            "and under his wings you will find refuge.",
            "",
            "You will not fear the terror of the night",
            "nor the arrow that flies by day,",
            "nor the plague that prowls in the darkness",
            "nor the scourge that lays waste at noon.",
            "",
            "A thousand may fall at your side,",
            "ten thousand fall at your right,",
            "you, it will never approach;",
            "his faithfulness is buckler and shield.",
            "",
            "Glory be to the Father and to the Son",
            "and to the Holy Spirit,",
            "as it was in the beginning,",
            "is now, and ever shall be,",
            "world without end. Amen."
        ]
        }
    ],
    reading: {
        type: "reading",
        language: "en",
        title: "Apocalypse 22:4-5",
        content: [
        "They will see the Lord face to face, and his name will be written on their foreheads. It will never be night again and they will not need lamplight or sunlight, because the Lord God will be shining on them. They will reign for ever and ever."
        ]
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
