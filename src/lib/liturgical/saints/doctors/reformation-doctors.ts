
import type { Saint } from "../saint-types"
import { LiturgicalColor } from "../../liturgical-types"
import { CelebrationRank } from "../../celebrations/celebrations-types"

// Reformation Era Doctors of the Church (16th-17th centuries)
export const reformationDoctors: Saint[] = [
  {
    id: "st-teresa-of-avila",
    name: "St. Teresa of Avila",
    feast_day: "10-15",
    short_bio: "Mystical Doctor, Carmelite reformer and mystic",
    biography: [
      "St. Teresa of Avila (1515-1582) was a Spanish Carmelite nun and mystic who reformed the Carmelite Order.",
      "Known for her mystical experiences and spiritual writings, particularly 'The Interior Castle' and 'The Way of Perfection'.",
      "She founded numerous convents throughout Spain and worked tirelessly to reform religious life.",
      "She was canonized in 1622 and declared the first female Doctor of the Church in 1970."
    ],
    birth_year: 1515,
    death_year: 1582,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "1622-03-12",
    patronage: "Headache sufferers, lace makers, people in need of grace"
  },
  {
    id: "st-john-of-the-cross",
    name: "St. John of the Cross",
    feast_day: "12-14",
    short_bio: "Mystical Doctor, Carmelite priest and mystic",
    biography: [
      "St. John of the Cross (1542-1591) was a Spanish Catholic priest and Carmelite friar.",
      "A major figure in the Counter-Reformation and Spanish mysticism, he worked with Teresa of Avila in reforming the Carmelites.",
      "His most famous works include 'Dark Night of the Soul' and 'The Ascent of Mount Carmel'.",
      "He was canonized in 1726 and declared a Doctor of the Church in 1926."
    ],
    birth_year: 1542,
    death_year: 1591,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "1726-12-27",
    patronage: "Mystics, contemplatives, Spanish poets"
  },
  {
    id: "st-peter-canisius",
    name: "St. Peter Canisius",
    feast_day: "12-21",
    short_bio: "Jesuit theologian and catechist of the Counter-Reformation",
    biography: [
      "St. Peter Canisius (1521-1597) was a Dutch Jesuit priest who became an important figure in the Counter-Reformation.",
      "He was instrumental in the Catholic revival in Germany and wrote influential catechisms.",
      "He founded colleges throughout Germany and worked to strengthen Catholic education.",
      "He was canonized in 1925 and declared a Doctor of the Church in the same year."
    ],
    birth_year: 1521,
    death_year: 1597,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.OPTIONAL_MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "1925-05-21",
    patronage: "Germany, catechists"
  },
  {
    id: "st-robert-bellarmine",
    name: "St. Robert Bellarmine",
    feast_day: "09-17",
    short_bio: "Jesuit cardinal and theologian of the Counter-Reformation",
    biography: [
      "St. Robert Bellarmine (1542-1621) was an Italian Jesuit and cardinal of the Catholic Church.",
      "One of the most important figures in the Counter-Reformation, he was a professor of theology and later a cardinal.",
      "His 'Disputations' became a standard work of Catholic theology and apologetics.",
      "He was canonized in 1930 and declared a Doctor of the Church in 1931."
    ],
    birth_year: 1542,
    death_year: 1621,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.OPTIONAL_MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "1930-06-29",
    patronage: "Catechists, canonists"
  }
]
