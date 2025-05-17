import type { Saint } from "../saint-types"
import { LiturgicalRank, LiturgicalColor } from "../../liturgical-types"

// September saints
export const septemberGeneralSaints: Saint[] = [
  {
    id: "teresa-of-calcutta",
    name: "St. Teresa of Calcutta",
    feast_day: "09-05",
    short_bio: "Founder of the Missionaries of Charity and Nobel Peace Prize recipient",
    biography: [
      "St. Teresa of Calcutta, commonly known as Mother Teresa, was born Anjezë Gonxhe Bojaxhiu on August 26, 1910, in Skopje, now the capital of North Macedonia. She was the youngest child in an Albanian Catholic family. At the age of 12, she felt strongly called to religious life after hearing stories of missionaries serving in Bengal, India.",
      "At 18, she left home to join the Sisters of Loreto in Ireland, where she received the name Sister Mary Teresa. In 1929, she was sent to India and began teaching at St. Mary's School for girls in Calcutta. She took her final vows in 1937 and became known as Mother Teresa.",
      "On September 10, 1946, during a train journey from Calcutta to Darjeeling, Mother Teresa received what she described as a 'call within a call.' She felt Christ asking her to serve the 'poorest of the poor' and to live among them. After receiving permission from the Vatican, she left the Loreto convent in 1948 to work in the slums of Calcutta.",
      "In 1950, she founded the Missionaries of Charity, a religious congregation dedicated to serving the 'poorest of the poor.' The order began with just 13 members but grew rapidly. Today, it comprises thousands of sisters running orphanages, hospices, and charity centers worldwide.",
      "Mother Teresa's work gained international recognition. In 1979, she was awarded the Nobel Peace Prize for her humanitarian efforts. When asked what people could do to promote peace, she famously replied, 'Go home and love your family.' She declined the traditional Nobel banquet and requested that the prize money of $192,000 be given to the poor in India.",
      "Despite her global acclaim, Mother Teresa faced criticism for the quality of medical care in her facilities, her stance on abortion and contraception, and her acceptance of donations from controversial figures. She maintained that her mission was to provide dignity and love to those who had been rejected by society.",
      "After years of declining health, including heart problems and malaria, Mother Teresa died on September 5, 1997, at the age of 87. Her funeral was attended by dignitaries from around the world, and the Indian government honored her with a state funeral.",
      "Mother Teresa was beatified in 2003 by Pope John Paul II and canonized as a saint by Pope Francis on September 4, 2016, almost exactly 19 years after her death. Her feast day is celebrated annually on September 5, the anniversary of her death.",
    ],
    image_url: "/saints/st-teresa-of-calcutta.jpg",
    patronage: "World Youth Day, Missionaries of Charity, the poor and sick, Calcutta, India",
    birth_year: 1910,
    death_year: 1997,
    prayers:
      "Saint Teresa of Calcutta, you allowed the thirsting love of Jesus on the Cross to become a living flame within you, and so became the light of His love to all. Teach me to allow Jesus to penetrate and possess my whole being so completely that my life, too, may radiate His light and love to others. Amen.",
    is_dominican: false,
    rank: LiturgicalRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    proper: "Proper of Saints",
  },
]
