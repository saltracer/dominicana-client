import type { Saint } from "../saint-types"
import { LiturgicalRank, LiturgicalColor } from "../../liturgical-types"

// December saints
export const decemberGeneralSaints: Saint[] = [
  {
    id: "stephen",
    name: "St. Stephen",
    feast_day: "12-26",
    short_bio: "First martyr of the Church",
    biography: [
      "St. Stephen was one of the first seven deacons chosen by the early Christian community to assist the Apostles in their ministry. He is described in the Acts of the Apostles as 'a man full of faith and of the Holy Spirit' (Acts 6:5).",
      "Stephen was known for his powerful preaching and the miracles he performed. His eloquence and wisdom in defending the faith led to opposition from various synagogues in Jerusalem. Unable to defeat him in debate, his opponents brought false charges against him, claiming he had spoken blasphemy against Moses and God.",
      "When brought before the Sanhedrin (the Jewish high court), Stephen delivered a powerful speech recounting Israel's history and God's covenant relationship with His people. He boldly accused the religious leaders of resisting the Holy Spirit and betraying and murdering the 'Righteous One' (Jesus).",
      "Enraged by his words, the crowd dragged Stephen outside the city and stoned him to death. As he was dying, Stephen saw a vision of Jesus standing at the right hand of God. His last words echoed those of Jesus on the cross: 'Lord, do not hold this sin against them' (Acts 7:60).",
      "Stephen's martyrdom marked the beginning of a great persecution against the Church in Jerusalem, which ironically helped spread Christianity as believers scattered throughout Judea and Samaria. Among those who approved of Stephen's execution was Saul of Tarsus, who would later become the Apostle Paul after his conversion.",
      "St. Stephen is venerated as the first martyr (protomartyr) of Christianity. His feast day follows immediately after Christmas, emphasizing that the birth of Christ ultimately leads to the sacrifice of one's life for the faith. He is the patron saint of deacons, stonemasons, and those suffering from headaches.",
    ],
    image_url: "/saints/st-stephen.jpg",
    patronage: "Deacons, stonemasons, casket makers, headaches",
    birth_year: null,
    death_year: 34,
    prayers:
      "Grant, Lord, we pray, that we may imitate what we worship, and so learn to love even our enemies, for we celebrate the heavenly birthday of a man who knew how to pray even for his persecutors. Through our Lord Jesus Christ, your Son, who lives and reigns with you in the unity of the Holy Spirit, one God, for ever and ever. Amen.",
    is_dominican: false,
    rank: LiturgicalRank.FEAST,
    color: LiturgicalColor.RED,
    proper: "Proper of Saints",
  },
  {
    id: "john-apostle",
    name: "St. John the Apostle and Evangelist",
    feast_day: "12-27",
    short_bio: "Beloved disciple of Jesus, apostle, and author of the fourth Gospel",
    biography: [
      "St. John was the son of Zebedee and Salome, and the brother of James the Greater. As fishermen on the Sea of Galilee, John and his brother were among the first disciples called by Jesus. Along with Peter and James, John formed the inner circle of Jesus' closest companions, witnessing key events such as the Transfiguration and the Agony in the Garden of Gethsemane.",
      "In his Gospel, John refers to himself as 'the disciple whom Jesus loved,' highlighting his special relationship with Christ. He was the only one of the Twelve Apostles who did not forsake Jesus during His crucifixion and stood at the foot of the cross, where Jesus entrusted His mother Mary to John's care.",
      "After Pentecost, John played a significant role in the early Church in Jerusalem. According to tradition, he later moved to Ephesus, where he wrote his Gospel, three Epistles, and possibly the Book of Revelation during his exile on the island of Patmos under the Emperor Domitian.",
      "Unlike most of the other apostles, John is believed to have died of natural causes at an advanced age, around the year 100 AD. He is the only apostle who was not martyred, though not for lack of attempts on his life. One tradition holds that an attempt to poison him failed miraculously.",
      "John's Gospel differs significantly from the Synoptic Gospels (Matthew, Mark, and Luke), focusing more on the divinity of Christ and containing extended discourses rather than parables. His writings emphasize love, light, and life, with the famous declaration that 'God is love' (1 John 4:8).",
      "St. John is often depicted in art as a young, beardless man, sometimes with an eagle, symbolizing the soaring, spiritual nature of his Gospel. He is the patron saint of theologians, writers, and friendship.",
    ],
    image_url: "/saints/st-john-apostle.jpg",
    patronage: "Theologians, writers, editors, publishers, friendship, Asia Minor",
    birth_year: 6,
    death_year: 100,
    prayers:
      "O God, who through the blessed Apostle John have unlocked for us the secrets of your Word, grant, we pray, that we may grasp with proper understanding what he has so marvelously brought to our ears. Through our Lord Jesus Christ, your Son, who lives and reigns with you in the unity of the Holy Spirit, one God, for ever and ever. Amen.",
    is_dominican: false,
    rank: LiturgicalRank.FEAST,
    color: LiturgicalColor.WHITE,
    proper: "Proper of Saints",
  },
]
