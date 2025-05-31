
import type { Saint } from "../saint-types"
import { LiturgicalColor } from "../../liturgical-types"
import { CelebrationRank } from "../../celebrations/celebrations-types"

// Medieval Doctors of the Church (7th-15th centuries)
export const medievalDoctors: Saint[] = [
  {
    id: "st-thomas-aquinas",
    name: "St. Thomas Aquinas",
    feast_day: "01-28",
    short_bio: "The Angelic Doctor, greatest scholastic theologian",
    biography: [
      "St. Thomas Aquinas (1225-1274) was an Italian Dominican friar and priest, and one of the most influential theologians in Christian history.",
      "Known as the 'Angelic Doctor', he synthesized Aristotelian philosophy with Christian theology.",
      "His 'Summa Theologica' remains one of the most important works of medieval scholarship and Catholic theology.",
      "He was canonized in 1323 and declared a Doctor of the Church in 1567."
    ],
    birth_year: 1225,
    death_year: 1274,
    is_dominican: true,
    is_doctor: true,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "1323-07-18",
    patronage: "Students, schools, universities, philosophers"
  },
  {
    id: "st-bonaventure",
    name: "St. Bonaventure",
    feast_day: "07-15",
    short_bio: "The Seraphic Doctor, Franciscan theologian and mystic",
    biography: [
      "St. Bonaventure (1221-1274) was an Italian medieval Franciscan, scholastic theologian and philosopher.",
      "Known as the 'Seraphic Doctor', he served as the seventh Minister General of the Order of Friars Minor.",
      "His theological works emphasized the Augustinian tradition and mystical theology.",
      "He was canonized in 1482 and declared a Doctor of the Church in 1588."
    ],
    birth_year: 1221,
    death_year: 1274,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "1482-04-14",
    patronage: "Bowel disorders, Franciscan Order"
  },
  {
    id: "st-anselm-of-canterbury",
    name: "St. Anselm of Canterbury",
    feast_day: "04-21",
    short_bio: "Father of Scholasticism, Archbishop of Canterbury",
    biography: [
      "St. Anselm (1033-1109) was a Benedictine monk, abbot, philosopher and theologian of the Catholic Church.",
      "He served as Archbishop of Canterbury from 1093 to 1109 and is considered the father of Scholasticism.",
      "He is famous for his ontological argument for the existence of God and his satisfaction theory of atonement.",
      "He was canonized in 1494 and declared a Doctor of the Church in 1720."
    ],
    birth_year: 1033,
    death_year: 1109,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.OPTIONAL_MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "1494",
    patronage: "Theologians"
  },
  {
    id: "st-albert-the-great",
    name: "St. Albert the Great",
    feast_day: "11-15",
    short_bio: "Universal Doctor, teacher of Thomas Aquinas",
    biography: [
      "St. Albert the Great (c. 1200-1280) was a German philosopher, scientist, and bishop.",
      "Known as 'Doctor Universalis', he was the teacher of Thomas Aquinas and made significant contributions to natural science.",
      "He was one of the first to comment on virtually all of Aristotle's writings, making them accessible to medieval scholars.",
      "He was canonized in 1931 and declared a Doctor of the Church in the same year."
    ],
    birth_year: 1200,
    death_year: 1280,
    is_dominican: true,
    is_doctor: true,
    rank: CelebrationRank.OPTIONAL_MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "1931-12-16",
    patronage: "Scientists, students of natural sciences"
  }
]
