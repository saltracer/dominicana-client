import { format, addDays } from "date-fns"
import type { Celebration } from "./celebrations-types"
import { CelebrationRank } from "./celebrations-types"
import { 
  calculateEaster, 
  getPentecostSunday,
  getAscensionThursday,
  getDivineMercySunday,
  getTrinitySunday,
  getCorpusChristiThursday,
  getSacredHeartFriday,
  getChristTheKingSunday,
  getMaryMotherOfChurchMonday
} from "../liturgical-seasons"

export function getGeneralMoveableCelebrations(year: number): Celebration[] {
  const easter = calculateEaster(year)
  const pentecost = getPentecostSunday(year)
  const ascension = getAscensionThursday(year)
  const divineMercy = getDivineMercySunday(year)
  const trinity = getTrinitySunday(year)
  const corpusChristi = getCorpusChristiThursday(year)
  const sacredHeart = getSacredHeartFriday(year)
  const christTheKing = getChristTheKingSunday(year)
  
  // Mary, Mother of the Church - Monday after Pentecost
  const maryMotherChurch = getMaryMotherOfChurchMonday(year)

  const celebrations: Celebration[] = [
    {
      id: "easter-sunday",
      name: "Easter Sunday",
      rank: CelebrationRank.SOLEMNITY,
      color: "white",
      date: format(easter, "MM-dd"),
      year: year,
      actualDate: easter,
      description: "The celebration of the resurrection of Jesus Christ from the dead, the central mystery of the Christian faith. This solemnity marks the triumph of life over death and is the foundation of Christian hope.",
      isDominican: false
    },
    {
      id: "divine-mercy-sunday",
      name: "Divine Mercy Sunday",
      rank: CelebrationRank.SOLEMNITY,
      color: "white",
      date: format(divineMercy, "MM-dd"),
      year: year,
      actualDate: divineMercy,
      description: "The Second Sunday of Easter, dedicated to the Divine Mercy of Jesus. This celebration, promoted by Saint Faustina Kowalska, emphasizes God's boundless mercy and love for humanity.",
      isDominican: false
    },
    {
      id: "ascension-thursday",
      name: "The Ascension of the Lord",
      rank: CelebrationRank.SOLEMNITY,
      color: "white",
      date: format(ascension, "MM-dd"),
      year: year,
      actualDate: ascension,
      description: "The celebration of Jesus Christ's ascension into heaven forty days after his resurrection. This solemnity marks the completion of Christ's earthly mission and his exaltation at the right hand of the Father.",
      isDominican: false
    },
    {
      id: "pentecost-sunday",
      name: "Pentecost Sunday",
      rank: CelebrationRank.SOLEMNITY,
      color: "red",
      date: format(pentecost, "MM-dd"),
      year: year,
      actualDate: pentecost,
      description: "The celebration of the descent of the Holy Spirit upon the apostles, marking the birth of the Church. This solemnity commemorates the empowerment of the disciples to spread the Gospel to all nations.",
      isDominican: false
    },
    {
      id: "mary-mother-church",
      name: "Mary, Mother of the Church",
      rank: CelebrationRank.MEMORIAL,
      color: "white",
      date: format(maryMotherChurch, "MM-dd"),
      year: year,
      actualDate: maryMotherChurch,
      description: "A memorial honoring the Blessed Virgin Mary as Mother of the Church, established by Pope Francis in 2018. Celebrated on the Monday after Pentecost, this feast recognizes Mary's maternal care for the Church, which was born from the side of Christ on the Cross and manifested to the world on Pentecost. Mary, who was present with the apostles in the Upper Room awaiting the Holy Spirit, continues to accompany the Church in its mission of evangelization with her maternal protection and intercession.",
      isDominican: false
    },
    {
      id: "trinity-sunday",
      name: "The Most Holy Trinity",
      rank: CelebrationRank.SOLEMNITY,
      color: "white",
      date: format(trinity, "MM-dd"),
      year: year,
      actualDate: trinity,
      description: "The celebration of the mystery of the Trinity - Father, Son, and Holy Spirit, three persons in one God. This solemnity honors the fundamental mystery of the Christian faith.",
      isDominican: false
    },
    {
      id: "corpus-christi",
      name: "The Most Holy Body and Blood of Christ",
      rank: CelebrationRank.SOLEMNITY,
      color: "white",
      date: format(corpusChristi, "MM-dd"),
      year: year,
      actualDate: corpusChristi,
      description: "Also known as Corpus Christi, this solemnity celebrates the Real Presence of Jesus Christ in the Eucharist. It emphasizes the gift of the Eucharist as the source and summit of Christian life.",
      isDominican: false
    },
    {
      id: "sacred-heart",
      name: "The Most Sacred Heart of Jesus",
      rank: CelebrationRank.SOLEMNITY,
      color: "white",
      date: format(sacredHeart, "MM-dd"),
      year: year,
      actualDate: sacredHeart,
      description: "The celebration of the physical heart of Jesus as the symbol of his divine love for humanity. This solemnity emphasizes Christ's boundless love and mercy, particularly his love for sinners.",
      isDominican: false
    },
    {
      id: "christ-the-king",
      name: "Our Lord Jesus Christ, King of the Universe",
      rank: CelebrationRank.SOLEMNITY,
      color: "white",
      date: format(christTheKing, "MM-dd"),
      year: year,
      actualDate: christTheKing,
      description: "The celebration of Christ's kingship over all creation, observed on the last Sunday of the liturgical year. This solemnity affirms Jesus as the King of Kings and Lord of Lords, whose kingdom is eternal.",
      isDominican: false
    }
  ]

  return celebrations
}
