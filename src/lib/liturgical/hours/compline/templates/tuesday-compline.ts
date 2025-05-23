import type {ComplineTemplate} from "../../hour-types"

export const tuesdayCompline: ComplineTemplate = {
    id: "tuesday_compline_001",
    dayOfWeek: 1, // 1 = Tuesday
    title: "Tuesday Compline",
    introduction: {
      type: "introduction",
      title: "Introduction to Tuesday Compline",
      language: "en",
      content: [
        "O God, come to my assistance.",
        "O Lord, make haste to help me.",
        "Glory be to the Father, and to the Son, and to the Holy Spirit.",
        "As it was in the beginning, is now, and ever shall be, world without end. Amen."
      ],
      rubric: "Make the sign of the cross."
    },
    hymn: {
      type: "hymn",
      title: "Hymn for Tuesday Compline",
      language: "en",
      content: [
        "Now the day is over,",
        "Night is drawing nigh;",
        "Shadows of the evening",
        "Steal across the sky.",
        "Jesus, give the weary",
        "Calm and sweet repose;",
        "With Thy tenderest blessing",
        "May our eyelids close."
      ]
    },
    psalmody: [
      {
        type: "psalm",
        title: "Psalm 4",
        language: "en",
        content: [
          "Answer me when I call, O God of my righteousness!",
          "You have given me relief when I was in distress;",
          "Be gracious to me and hear my prayer.",
          "O men, how long shall my honor be turned into shame?",
          "How long will you love vain words and seek after lies?",
          "But know that the Lord has set apart the godly for himself;",
          "The Lord hears when I call to him.",
          "Be angry, and do not sin; ponder in your own hearts on your beds, and be silent.",
          "Offer right sacrifices, and put your trust in the Lord."
        ],
        rubric: "Recite the psalm with antiphon.",
        antiphon: {
          before: "When I call, answer me, O God of justice;",
          after: "You set me free when I was beset by danger; have mercy on me and hear my prayer."
        }
      },
      {
        type: "psalm",
        title: "Psalm 91",
        language: "en",
        content: [
          "He who dwells in the secret place of the Most High",
          "Shall abide under the shadow of the Almighty.",
          "I will say of the Lord, 'He is my refuge and my fortress,",
          "My God, in whom I trust.'",
          "For he will deliver you from the snare of the fowler",
          "And from the deadly pestilence.",
          "He will cover you with his pinions,",
          "And under his wings you will find refuge;"
        ],
        rubric: "Recite the psalm with antiphon.",
        antiphon: {
          before: "You, O Lord, are my refuge!",
          after: "You have made the Most High your dwelling place."
        }
      }
    ],
    reading: {
      type: "reading",
      title: "Reading from Scripture",
      language: "en",
      content: [
        "The Lord is my light and my salvation; whom shall I fear?",
        "The Lord is the stronghold of my life; of whom shall I be afraid?",
        "When evildoers assail me to eat up my flesh,",
        "My adversaries and foes, it is they who stumble and fall."
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