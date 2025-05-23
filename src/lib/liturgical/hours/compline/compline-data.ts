
import { addDays, format, isBefore, isEqual, isSameDay,parseISO } from "date-fns";
import { calculateEaster, isEaster } from "@/lib/liturgical/liturgical-seasons";
import {ComplineComponent, ComplineTemplate} from "../hour-types"


// Base templates for each day of the week
const complineTemplates: ComplineTemplate[] = [
  // Sunday Compline
  {
    id: "sunday-compline",
    dayOfWeek: 0,
    title: "Night Prayer - Sunday",
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
      title: "Sunday Hymn",
      content: [
        "Before the ending of the day,",
        "Creator of the world, we pray",
        "That you, with steadfast love, would keep",
        "Your watch around us while we sleep.",
        "",
        "From evil dreams defend our sight,",
        "From fears and terrors of the night;",
        "Tread underfoot our deadly foe",
        "That we no sinful thoughts may know.",
        "",
        "O Father, that we ask be done",
        "Through Jesus Christ, your only Son;",
        "Who, with the Holy Ghost and you,",
        "Doth live and reign for ever true."
      ]
    },
    psalmody: [
      {
        type: "psalm",
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
      title: "Apocalypse 22:4-5",
      content: [
        "They will see the Lord face to face, and his name will be written on their foreheads. It will never be night again and they will not need lamplight or sunlight, because the Lord God will be shining on them. They will reign for ever and ever."
      ]
    },
    responsory: {
      type: "responsory",
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
      content: [
        "The Lord grant us a quiet night and a perfect end.",
        "Amen.",
        "",
        "Marian Antiphon follows"
      ]
    },
    marian: {
      type: "marian",
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
  },
  // Monday Compline (abbreviated for brevity)
  {
    id: "monday-compline",
    dayOfWeek: 1,
    title: "Night Prayer - Monday",
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
      title: "Monday Hymn",
      content: [
        "Now that the daylight dies away,",
        "By all thy grace and love,",
        "Thee, Maker of the world, we pray",
        "To watch our bed above.",
        "",
        "Let dreams depart and phantoms fly,",
        "The offspring of the night,",
        "Keep us, like shrines, beneath thine eye,",
        "Pure in our foe's despite.",
        "",
        "This grace on thy redeemed confer,",
        "Father, co-equal Son,",
        "And Holy Ghost, the Comforter,",
        "Eternal Three in One."
      ]
    },
    psalmody: [
      {
        type: "psalm",
        title: "Psalm 86",
        antiphon: {
          before: "Lord, you have been our refuge from one generation to the next.",
          after: "Lord, you have been our refuge from one generation to the next."
        },
        content: [
          "Turn your ear, O Lord, and give answer",
          "for I am poor and needy.",
          "Preserve my life, for I am faithful:",
          "save the servant who trusts in you."
        ]
      }
    ],
    reading: {
      type: "reading",
      title: "1 Thessalonians 5:9-10",
      content: [
        "God destined us not for wrath but for obtaining salvation through our Lord Jesus Christ, who died for us, so that whether we are awake or asleep we may live with him."
      ]
    },
    responsory: {
      type: "responsory",
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
      title: "Nunc Dimittis",
      antiphon: {
        before: "Save us, Lord, while we are awake; protect us while we sleep; that we may keep watch with Christ and rest with him in peace.",
        after: "Save us, Lord, while we are awake; protect us while we sleep; that we may keep watch with Christ and rest with him in peace."
      },
      content: [
        "At last, all-powerful Master,",
        "you give leave to your servant to go in peace,",
        "according to your promise."
      ]
    },
    concludingPrayer: {
      type: "prayer",
      content: [
        "Lord our God,",
        "be gracious and forgive the sins of your people.",
        "Free us from the bonds of darkness",
        "that hold us tight,",
        "and let us enter into your light",
        "to rest in your peace.",
        "Through Christ our Lord.",
        "Amen."
      ]
    },
    conclusion: {
      type: "conclusion",
      content: [
        "The Lord grant us a quiet night and a perfect end.",
        "Amen.",
        "",
        "Marian Antiphon follows"
      ]
    }
  },
  // Add more day templates here...
];

// Easter season overrides
const easterOverrides = {
  responsory: {
    type: "responsory",
    content: [
      "Into your hands, Lord, I commend my spirit, alleluia, alleluia.",
      "Into your hands, Lord, I commend my spirit, alleluia, alleluia.",
      "You have redeemed us, Lord God of truth.",
      "Alleluia, alleluia.",
      "Glory be to the Father and to the Son and to the Holy Spirit.",
      "Into your hands, Lord, I commend my spirit, alleluia, alleluia."
    ]
  },
  // Additional Easter overrides as needed
};

// Easter Octave special template
const easterOctaveTemplate: Partial<ComplineTemplate> = {
  id: "easter-octave-compline",
  title: "Night Prayer - Easter Octave",
  introduction: {
    type: "introduction",
    content: [
      "O God, come to our aid.",
      "O Lord, make haste to help us.",
      "Glory be to the Father and to the Son and to the Holy Spirit,",
      "as it was in the beginning, is now, and ever shall be, world without end. Amen. Alleluia."
    ]
  },
  // Special components for Easter Octave
  // ...
};

// In-memory cache for compiled templates
const templateCache = new Map<string, ComplineTemplate>();

export function isEasterOctave(date: Date): boolean {
  const easter = calculateEaster(date.getFullYear());
  const easterOctaveEnd = new Date(easter);
  easterOctaveEnd.setDate(easter.getDate() + 7);
  
  return date >= easter && date <= easterOctaveEnd;
}

export function getComplineForDate(date: Date): ComplineTemplate {
  const dateString = format(date, 'yyyy-MM-dd');
  
  // Check cache first
  if (templateCache.has(dateString)) {
    return templateCache.get(dateString)!;
  }
  
  // Determine which template to use
  let template: ComplineTemplate;
  
  if (isEasterOctave(date)) {
    // During Easter Octave, use the special template
    // For simplicity, we'll just use Sunday template with Easter Octave overrides
    const baseTemplate = {...complineTemplates.find(t => t.dayOfWeek === 0)!};
    template = {
      ...baseTemplate,
      ...easterOctaveTemplate,
      title: "Night Prayer - Easter Octave"
    } as ComplineTemplate;
  } else {
    // Regular day - use template for the day of week
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    template = {...complineTemplates.find(t => t.dayOfWeek === dayOfWeek)!};
    
    // Apply Easter season overrides if needed
    if (isEaster(date)) {
      template = {
        ...template,
        responsory: easterOverrides.responsory
      };
      
      // Add "alleluia" to appropriate parts
      if (template.canticle.antiphon) {
        template.canticle.antiphon.before = `${template.canticle.antiphon.before} Alleluia.`;
        template.canticle.antiphon.after = `${template.canticle.antiphon.after} Alleluia.`;
      }
    }
  }
  
  // Store in cache
  templateCache.set(dateString, template);
  
  return template;
}

// Clear cache for testing or when memory needs to be freed
export function clearComplineCache() {
  templateCache.clear();
}
