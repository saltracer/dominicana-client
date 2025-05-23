import type {ComplineTemplate} from "../../hour-types"

export const wednesdayCompline: ComplineTemplate = {
    id: 'wednesday-compline',
    dayOfWeek: 3, // Wednesday
    title: 'Wednesday Compline',
    introduction: {
      type: 'introduction',
      language: "en",
      content: ['In the name of the Father, and of the Son, and of the Holy Spirit.', 'Amen.']
    },
    hymn: {
      type: 'hymn',
      language: "en",
      title: 'Nunc Dimittis',
      content: [
        'Lord, now lettest thou thy servant depart in peace, *',
        'according to thy word;',
        'For mine eyes have seen thy salvation, *',
        'which thou hast prepared before the face of all people,',
        'To be a light to lighten the Gentiles, *',
        'and to be the glory of thy people Israel.'
      ]
    },
    psalmody: [
      {
        type: 'psalm',
        language: "en",
        title: 'Psalm 4',
        content: [
          'Answer me when I call, O God, defender of my cause; *',
          'you set me free when I am hard-pressed;',
          'have mercy on me and hear my prayer.'
        ],
        antiphon: {
          before: 'Into your hands, O Lord, I commend my spirit.',
          after: 'Into your hands, O Lord, I commend my spirit.'
        }
      },
      {
        type: 'psalm',
        language: "en",
        title: 'Psalm 31',
        content: [
          'In you, O Lord, have I taken refuge;',
          'let me never be put to shame; *',
          'deliver me in your righteousness.'
        ],
        antiphon: {
          before: 'Into your hands, O Lord, I commend my spirit.',
          after: 'Into your hands, O Lord, I commend my spirit.'
        }
      }
    ],
    reading: {
      type: 'reading',
      language: "en",
      title: "Matthew 11:28-30",
      content: ['Come to me, all who labor and are heavy-laden, and I will give you rest. Take my yoke upon you, and learn from me; for I am gentle and lowly in heart, and you will find rest for your souls. For my yoke is easy, and my burden is light.'],
      rubric: 'Matthew 11:28-30'
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
  };
  