
import type { Saint } from "../saint-types"
import { LiturgicalColor } from "../../liturgical-types"
import { CelebrationRank } from "../../celebrations/celebrations-types"

// Ancient Doctors of the Church (1st-6th centuries)
export const ancientDoctors: Saint[] = [
  {
    id: "st-athanasius",
    name: "St. Athanasius",
    feast_day: "05-02",
    short_bio: "Great defender of orthodox faith against Arianism",
    biography: [
      "St. Athanasius (c. 296-373) was the 20th Archbishop of Alexandria and a pillar of orthodoxy during the Arian crisis.",
      "Known as 'Athanasius the Great' and 'the Father of Orthodoxy', he steadfastly defended the divinity of Christ against Arian heresy.",
      "He was exiled five times by four different Roman emperors but never wavered in his defense of Nicene Christianity.",
      "His theological works, particularly 'Against the Arians' and 'Life of Antony', remain influential in Christian thought."
    ],
    birth_year: 296,
    death_year: 373,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "Ancient",
    patronage: "Theologians, Orthodox Christians"
  },
  {
    id: "st-basil-the-great",
    name: "St. Basil the Great",
    feast_day: "01-02",
    short_bio: "One of the three Cappadocian Fathers, great theologian and monastic founder",
    biography: [
      "St. Basil the Great (330-379) was Bishop of Caesarea Mazaca in Cappadocia, Asia Minor.",
      "One of the three Cappadocian Fathers along with Gregory of Nazianzus and Gregory of Nyssa.",
      "He defended the Church against Arianism and contributed significantly to the development of Christian monasticism.",
      "His 'Hexaemeron' and liturgical reforms had lasting impact on Eastern Christianity."
    ],
    birth_year: 330,
    death_year: 379,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "Ancient",
    patronage: "Hospital administrators, reformers"
  },
  {
    id: "st-john-chrysostom",
    name: "St. John Chrysostom",
    feast_day: "09-13",
    short_bio: "The Golden-mouthed preacher and Archbishop of Constantinople",
    biography: [
      "St. John Chrysostom (c. 349-407) was Archbishop of Constantinople and one of the greatest preachers in Christian history.",
      "Known as 'Chrysostom' meaning 'golden-mouthed' for his eloquent preaching and public speaking.",
      "His homilies on various books of the Bible are masterpieces of theological exposition.",
      "He suffered exile due to his criticism of the wealthy and powerful, dying in exile in 407."
    ],
    birth_year: 349,
    death_year: 407,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "Ancient",
    patronage: "Preachers, speakers, Constantinople"
  },
  {
    id: "st-jerome",
    name: "St. Jerome",
    feast_day: "09-30",
    short_bio: "Translator of the Vulgate Bible and biblical scholar",
    biography: [
      "St. Jerome (c. 347-420) was a priest, theologian, and historian, best known for translating the Bible into Latin (the Vulgate).",
      "Born in Stridon, he studied in Rome and later became a hermit in the Syrian desert.",
      "His translation of the Bible into Latin became the standard version used by the Catholic Church for over 1,000 years.",
      "He was also known for his correspondence with Augustine and his promotion of ascetic life."
    ],
    birth_year: 347,
    death_year: 420,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "Ancient",
    patronage: "Librarians, translators, students"
  },
  {
    id: "st-augustine-of-hippo",
    name: "St. Augustine of Hippo",
    feast_day: "08-28",
    short_bio: "Great theologian and philosopher, author of Confessions and City of God",
    biography: [
      "St. Augustine (354-430) was Bishop of Hippo Regius in North Africa and one of the most important figures in Christian theology.",
      "His 'Confessions' is considered the first Western autobiography and a classic of Christian literature.",
      "His 'City of God' defended Christianity against accusations that it caused the fall of Rome.",
      "His theological contributions on grace, original sin, and just war theory profoundly influenced Western Christianity."
    ],
    birth_year: 354,
    death_year: 430,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "Ancient",
    patronage: "Theologians, printers, brewers"
  },
  {
    id: "st-gregory-the-great",
    name: "St. Gregory the Great",
    feast_day: "09-03",
    short_bio: "Pope and Doctor, reformer of liturgy and church administration",
    biography: [
      "St. Gregory the Great (c. 540-604) was Pope from 590 to 604 and is considered one of the greatest popes in history.",
      "He reformed the Roman liturgy and is credited with the development of Gregorian chant.",
      "His 'Pastoral Care' became a handbook for bishops throughout the Middle Ages.",
      "He sent Augustine of Canterbury to evangelize England and strengthened papal authority."
    ],
    birth_year: 540,
    death_year: 604,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "Ancient",
    patronage: "Musicians, singers, students, teachers"
  }
]
