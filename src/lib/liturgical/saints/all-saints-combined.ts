
import type { Saint } from "./saint-types"
import { dominicanSaints } from "./saint-dominicans"
import { doctorSaints } from "./saint-doctors"
import { generalSaints } from "./index"

// Combine all saints from all sources
export const allSaintsCombined: Saint[] = [
  ...dominicanSaints,
  ...doctorSaints, 
  ...generalSaints,
  // Add more comprehensive saint data
  {
    id: "st-dominic",
    name: "St. Dominic de Guzmán",
    feast_day: "08-08",
    short_bio: "Founder of the Order of Preachers (Dominicans)",
    biography: [
      "St. Dominic de Guzmán (1170-1221) was a Spanish Catholic priest and founder of the Dominican Order. Born in Caleruega, Spain, he dedicated his life to preaching against heresy and promoting education.",
      "He founded the Order of Preachers in 1216, emphasizing both contemplation and active ministry. The order grew rapidly across Europe, establishing houses of study and engaging in missionary work.",
      "Dominic was known for his deep prayer life, particularly his devotion to the Rosary, and his commitment to poverty and preaching. He died in Bologna in 1221 and was canonized in 1234."
    ],
    patronage: "Astronomers, Dominican Republic, false accusations, scientists",
    birth_year: 1170,
    death_year: 1221,
    is_dominican: true,
    prayers: "O God, let the light of your truth shine forth through Saint Dominic's preaching and example, and grant that we may be zealous for souls and fervent in prayer. Through Christ our Lord. Amen."
  },
  {
    id: "st-thomas-aquinas",
    name: "St. Thomas Aquinas",
    feast_day: "01-28",
    short_bio: "Doctor of the Church, philosopher and theologian",
    biography: [
      "St. Thomas Aquinas (1225-1274) was an Italian Dominican friar and Catholic priest who was an influential philosopher and theologian. Known as the 'Angelic Doctor', he is considered one of the greatest theologians and philosophers in the history of the Catholic Church.",
      "His masterwork, the Summa Theologica, remains one of the most influential works of Western literature. He successfully synthesized Aristotelian philosophy with Christian doctrine, creating a comprehensive theological system.",
      "Thomas taught at the University of Paris and wrote extensively on topics ranging from government to the existence of God. He died at the Cistercian monastery of Fossanova in 1274."
    ],
    patronage: "Academics, schools, students, theologians, universities, pencil makers",
    birth_year: 1225,
    death_year: 1274,
    is_dominican: true,
    prayers: "Creator of all things, true source of light and wisdom, origin of all being, graciously let a ray of your light penetrate the darkness of my understanding. Take from me the double darkness in which I have been born, an obscurity of sin and ignorance."
  },
  {
    id: "st-catherine-of-siena", 
    name: "St. Catherine of Siena",
    feast_day: "04-29",
    short_bio: "Doctor of the Church, mystic, and reformer",
    biography: [
      "St. Catherine of Siena (1347-1380) was an Italian Catholic mystic and Doctor of the Church. She became a Third Order Dominican and was known for her mystical experiences and her influence on Church politics during the Western Schism.",
      "She convinced Pope Gregory XI to return the papal seat from Avignon to Rome and worked tirelessly for Church reform. Her spiritual writings, particularly 'The Dialogue', are considered masterpieces of mystical literature.",
      "Catherine experienced mystical marriage with Christ and received the stigmata. She died in Rome at age 33 and was canonized in 1461, later declared a Doctor of the Church in 1970."
    ],
    patronage: "Europe, Italy, nurses, firefighters, miscarriages",
    birth_year: 1347,
    death_year: 1380,
    is_dominican: true,
    prayers: "O God, who gave Saint Catherine of Siena a wonderful love for Christ crucified and zeal for your Church, grant through her intercession that we may be united to Christ in his Passion and rejoice with him in his glory. Amen."
  },
  {
    id: "st-albertus-magnus",
    name: "St. Albertus Magnus", 
    feast_day: "11-15",
    short_bio: "Doctor of the Church, scientist and philosopher",
    biography: [
      "St. Albertus Magnus (1200-1280) was a German Dominican friar and Catholic bishop. Known as 'Albert the Great', he was one of the most prominent philosophers and scientists of the Middle Ages.",
      "He was the teacher of St. Thomas Aquinas and made significant contributions to logic, theology, botany, geography, astronomy, and mineralogy. He was among the first to comment on virtually all of Aristotle's writings.",
      "Albert served as Bishop of Regensburg and was instrumental in establishing the Dominican intellectual tradition. He was canonized and declared a Doctor of the Church in 1931."
    ],
    patronage: "Natural sciences, philosophers, scientists, students",
    birth_year: 1200,
    death_year: 1280,
    is_dominican: true,
    prayers: "Lord God, you endowed Saint Albert with the talent of combining human wisdom with divine faith. Help us so to adhere to his teaching that we may progress in the sciences and come to a deeper knowledge and love of you. Amen."
  },
  {
    id: "st-martin-de-porres",
    name: "St. Martin de Porres",
    feast_day: "11-03", 
    short_bio: "Dominican lay brother known for his charity",
    biography: [
      "St. Martin de Porres (1579-1639) was a Peruvian Dominican lay brother born in Lima. The son of a Spanish nobleman and a freed African slave, he faced racial discrimination but overcame it through his holiness.",
      "He served the sick and poor with extraordinary charity, founding an orphanage and a hospital. Martin was known for his mystical gifts, including bilocation, miraculous healing, and his ability to communicate with animals.",
      "Despite humble beginnings, he became beloved throughout Lima for his selfless service. He was canonized in 1962 and is considered a pioneer of interracial justice."
    ],
    patronage: "Mixed race people, barbers, public health workers, social justice",
    birth_year: 1579,
    death_year: 1639,
    is_dominican: true,
    prayers: "To you Saint Martin de Porres we prayerfully lift up our hearts. You who so loved God's creatures: bless our pets, heal our animals, and help us always to follow your example of treating every living being with kindness and respect. Amen."
  },
  {
    id: "st-rose-of-lima",
    name: "St. Rose of Lima",
    feast_day: "08-23",
    short_bio: "First saint of the Americas, Dominican tertiary",
    biography: [
      "St. Rose of Lima (1586-1617) was a Peruvian Catholic saint and the first person born in the Americas to be canonized. She was a member of the Third Order of Saint Dominic.",
      "Born Isabel Flores de Oliva, she was known for her beauty but chose to disfigure herself to avoid marriage, dedicating her life to prayer and penance. She lived as a recluse in her family's garden.",
      "Rose practiced severe mortifications and experienced mystical phenomena. She cared for the poor and sick, supporting her family through her needlework. She died at age 31 and was canonized in 1671."
    ],
    patronage: "Americas, Philippines, Lima, Peru, gardeners, florists",
    birth_year: 1586,
    death_year: 1617,
    is_dominican: true,
    prayers: "Saint Rose of Lima, beautiful flower of sanctity, you who made yourself a victim of love for Jesus Christ, help us to imitate your spirit of penance and your love for the poor. Amen."
  }
];
