import type {ComplineTemplate} from "../../hour-types"

export const mondayCompline: ComplineTemplate = {
    id: "monday-compline",
    dayOfWeek: 1,
    title: "Night Prayer - Monday",
    introduction: {
      type: "introduction",
      language: "en",
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
      language: "en",
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
        language: "en",
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
      language: "en",
      title: "1 Thessalonians 5:9-10",
      content: [
        "God destined us not for wrath but for obtaining salvation through our Lord Jesus Christ, who died for us, so that whether we are awake or asleep we may live with him."
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
        "according to your promise."
      ]
    },
    concludingPrayer: {
      type: "prayer",
      language: "en",
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
