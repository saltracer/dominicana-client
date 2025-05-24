import type {ComplineTemplate} from "../../hour-types"
import { introduction, nowThatTheDaylightDiesAway, nuncDimittis, salveRegina, complineShortResponsory, complineConclusion } from "../components"    

export const wednesdayCompline: ComplineTemplate = {
    id: 'wednesday-compline',
    dayOfWeek: 3, // Wednesday
    title: "Night Prayer - Wednesday",
    introduction: introduction,
    hymn: nowThatTheDaylightDiesAway,
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
      content: ["Come to me, all who labor and are heavy-laden, and I will give you rest. ",
        "Take my yoke upon you, and learn from me; for I am gentle and lowly in heart, ",
        "and you will find rest for your souls. For my yoke is easy, and my burden is light."],
      rubric: 'Matthew 11:28-30'
    },
    responsory: complineShortResponsory,
    canticle: nuncDimittis,
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
    conclusion: complineConclusion,
    marian: salveRegina
};
