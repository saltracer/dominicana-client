import { LiturgicalColor, LiturgicalRank } from "./liturgical-types"
import type { FixedCelebration } from "./celebrations"

// Define the fixed feasts and solemnities (those that occur on the same date every year)
export function fixedSolemnitiesData(): FixedCelebration[] {
  return [
    {
      id: "mary-mother-of-god",
      name: "Solemnity of Mary, Mother of God",
      date: "01-01",
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Celebrates Mary's divine motherhood as the Mother of God (Theotokos).",
      description: [
        "The Solemnity of Mary, Mother of God, celebrates Mary's divine motherhood as the Mother of God (Theotokos).",
        "This feast, celebrated on January 1, the Octave Day of Christmas, honors Mary's role in the Incarnation and her perfect openness to God's will.",
        "It is a holy day of obligation in many countries and coincides with the World Day of Peace, established by Pope Paul VI.",
        "The title 'Mother of God' was formally defined at the Council of Ephesus in 431 AD, affirming that Mary is truly the mother of Jesus Christ, who is truly God.",
      ],
    },
    {
      id: "epiphany",
      name: "The Epiphany of the Lord",
      date: "01-06",
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Celebrates the manifestation of Christ to the Gentiles, represented by the Magi.",
      description: [
        "The Epiphany of the Lord celebrates the manifestation of Christ to the Gentiles, represented by the Magi (Wise Men) who came from the East to worship the newborn King.",
        "Traditionally celebrated on January 6 (the 12th day of Christmas), in many countries it is now observed on the Sunday between January 2 and January 8.",
        "The feast also commemorates the baptism of Jesus in the Jordan River and the wedding feast at Cana, other 'epiphanies' or manifestations of Christ's divinity.",
        "Epiphany customs include the blessing of homes, the blessing of water, and the exchange of gifts, recalling the gifts of gold, frankincense, and myrrh brought by the Magi.",
      ],
    },
    {
      id: "joseph",
      name: "Solemnity of St. Joseph, Spouse of the Blessed Virgin Mary",
      date: "03-19",
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Saints",
      type: "universal",
      short_desc: "Honors St. Joseph, the husband of Mary and the foster father of Jesus.",
      description: [
        "The Solemnity of St. Joseph honors the husband of Mary and the foster father of Jesus.",
        "St. Joseph is venerated as the patron of the universal Church, workers, fathers, and a happy death.",
        "This feast has been celebrated since the 10th century, and in 1870, Pope Pius IX declared St. Joseph the patron of the universal Church.",
        "St. Joseph is a model of humility, obedience to God's will, and protective care for the Holy Family.",
        "In many countries, this day is celebrated with special foods and traditions, particularly in Italy where it is also Father's Day.",
      ],
    },
    // Add more solemnities as needed
  ]
}
