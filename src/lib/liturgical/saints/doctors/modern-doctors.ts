
import type { Saint } from "../saint-types"
import { LiturgicalColor } from "../../liturgical-types"
import { CelebrationRank } from "../../celebrations/celebrations-types"

// Modern Doctors of the Church (18th century onward)
export const modernDoctors: Saint[] = [
  {
    id: "st-therese-of-lisieux",
    name: "St. Thérèse of Lisieux",
    feast_day: "10-01",
    short_bio: "The Little Flower, Doctor of the Little Way",
    biography: [
      "St. Thérèse of Lisieux (1873-1897) was a French Carmelite nun who died at the young age of 24.",
      "Known as 'The Little Flower', she developed the 'Little Way' of spiritual childhood and trust in God.",
      "Her autobiography 'Story of a Soul' became one of the most popular religious books ever written.",
      "She was canonized in 1925 and declared a Doctor of the Church in 1997."
    ],
    birth_year: 1873,
    death_year: 1897,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "1925-05-17",
    patronage: "Missionaries, florists, pilots, tuberculosis patients"
  },
  {
    id: "st-john-of-avila",
    name: "St. John of Avila",
    feast_day: "05-10",
    short_bio: "Apostle of Andalusia, spiritual director and preacher",
    biography: [
      "St. John of Avila (1500-1569) was a Spanish priest and mystic, known as the 'Apostle of Andalusia'.",
      "He was a renowned preacher and spiritual director who influenced many saints including Teresa of Avila.",
      "His letters and spiritual writings, particularly 'Audi Filia', were highly influential in his time.",
      "He was canonized in 1970 and declared a Doctor of the Church in 2012."
    ],
    birth_year: 1500,
    death_year: 1569,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.OPTIONAL_MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "1970-05-31",
    patronage: "Spanish clergy, Andalusia"
  },
  {
    id: "st-hildegard-of-bingen",
    name: "St. Hildegard of Bingen",
    feast_day: "09-17",
    short_bio: "Benedictine abbess, mystic, and polymath",
    biography: [
      "St. Hildegard of Bingen (1098-1179) was a German Benedictine abbess, writer, composer, philosopher, and mystic.",
      "She is considered one of the founders of scientific natural history in Germany and wrote extensively on theology, medicine, and natural sciences.",
      "Her visions and mystical writings were influential throughout medieval Europe.",
      "She was canonized in 2012 and declared a Doctor of the Church in the same year."
    ],
    birth_year: 1098,
    death_year: 1179,
    is_dominican: false,
    is_doctor: true,
    rank: CelebrationRank.OPTIONAL_MEMORIAL,
    color: LiturgicalColor.WHITE,
    canonization_date: "2012-05-10",
    patronage: "Musicians, composers, natural scientists"
  }
]
