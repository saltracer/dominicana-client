import type { Saint } from "../saint-types"
import { LiturgicalColor } from "../../liturgical-types"
import { CelebrationRank } from "../../celebrations/celebrations-types"

// October saints
export const octoberGeneralSaints: Saint[] = [
  {
    id: "francis-of-assisi",
    name: "St. Francis of Assisi",
    feast_day: "10-04",
    short_bio: "Founder of the Franciscan Order - Honored by the Dominican order",
    biography: [
      "St. Francis was born in Assisi, Italy, in 1181 or 1182, the son of a wealthy cloth merchant. In his youth, he lived a carefree and indulgent life, but after a series of experiences, including imprisonment during a war with Perugia and a serious illness, he underwent a profound spiritual conversion.",
      "Around 1208, while praying in the dilapidated church of San Damiano, Francis heard Christ speak to him from the crucifix: 'Francis, repair my house, which is falling into ruins.' Initially taking this literally, he began to restore the physical building, but later understood it as a call to reform the Church.",
      "Francis embraced a life of radical poverty, preaching repentance and peace. He attracted followers, and in 1209, he received verbal approval from Pope Innocent III for his simple rule of life. This marked the beginning of the Franciscan Order.",
      "In 1224, while praying on Mount La Verna, Francis received the stigmata, the marks of Christ's wounds on his own body. This made him the first recorded person in Christian history to bear the wounds of Christ's Passion.",
      "Francis was known for his love of nature and all creatures, famously preaching to birds and taming a wolf that was terrorizing the town of Gubbio. His 'Canticle of the Creatures' is considered one of the greatest works of early Italian literature.",
      "He died on October 3, 1226, at the age of 44, and was canonized just two years later by Pope Gregory IX. In 1979, Pope John Paul II declared him the patron saint of ecology.",
      "He is celebrated as a feast day in the Dominican Calendar.",
    ],
    image_url: "/saints/st-francis-of-assisi.jpg",
    patronage: "Animals, ecology, merchants, stowaways, Cub Scouts",
    birth_year: 1181,
    death_year: 1226,
    prayers:
      "Lord, make me an instrument of your peace. Where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; and where there is sadness, joy. O Divine Master, grant that I may not so much seek to be consoled as to console; to be understood as to understand; to be loved as to love. For it is in giving that we receive; it is in pardoning that we are pardoned; and it is in dying that we are born to eternal life. Amen.",
    is_dominican: true,
    rank: CelebrationRank.FEAST,
    color: LiturgicalColor.WHITE,
    proper: "Proper of Saints",
  },
  {
    id: "faustina",
    name: "St. Faustina Kowalska",
    feast_day: "10-05",
    short_bio: "Apostle of Divine Mercy and mystic who received visions of Jesus",
    biography: [
      "St. Faustina Kowalska was born Helena Kowalska on August 25, 1905, in Głogowiec, Poland, to a poor and religious family of peasants. She was the third of ten children. From a very young age, she was drawn to prayer, obedience, and sensitivity to the poor. She had only three years of simple education and began working as a domestic servant at age 16 to support herself and help her family.",
      "At the age of 20, she entered the Congregation of the Sisters of Our Lady of Mercy in Warsaw, taking the name Sister Maria Faustina. She lived in several religious houses, working as a cook, gardener, and porter. Externally, nothing distinguished her from other sisters, but her interior life was extraordinarily rich.",
      "Beginning in February 1931, Sister Faustina reported receiving private revelations from Jesus Christ. During one vision, Jesus appeared to her dressed in a white robe with red and pale rays emanating from his heart. He asked her to paint an image according to what she saw, with the signature 'Jesus, I trust in You.' This became the famous Divine Mercy image.",
      "Jesus also asked her to be the apostle and secretary of His mercy, to tell the world about His great mercy, and to prepare the world for His second coming. He gave her the Divine Mercy Chaplet, a prayer to be said on ordinary rosary beads, and asked for a Feast of Divine Mercy to be established on the first Sunday after Easter.",
      "Throughout her life, Sister Faustina kept a diary in which she recorded her conversations with Jesus and her spiritual experiences. This diary, later published as 'Divine Mercy in My Soul,' reveals her profound mystical life and the message of mercy that Jesus entrusted to her.",
      "Despite her mystical experiences, Sister Faustina faced many trials. She suffered from tuberculosis and numerous other physical ailments. Many of her fellow sisters and superiors did not believe in her visions, and some even ridiculed her. She endured these sufferings with patience and offered them for sinners.",
      "Sister Faustina died on October 5, 1938, at the age of 33. At the time of her death, the message of Divine Mercy was known only to her spiritual director and a few of her superiors. After World War II, the devotion began to spread, but in 1959, the Holy See, based on a faulty translation of her diary, prohibited the devotion.",
      "The ban was lifted in 1978, thanks to the efforts of Cardinal Karol Wojtyła (later Pope John Paul II), who had been promoting an investigation into her life and virtues. Sister Faustina was beatified on April 18, 1993, and canonized on April 30, 2000, by Pope John Paul II, who also established the Feast of Divine Mercy on the first Sunday after Easter, as Jesus had requested.",
      "St. Faustina is known today as the 'Apostle of Divine Mercy.' Her diary has been translated into many languages and has inspired the worldwide devotion to the Divine Mercy of Jesus. Her life and message remind us that God's mercy is greater than our sins, and that we are called to trust in His mercy and extend it to others.",
    ],
    image_url: "/saints/st-faustina.jpg",
    patronage: "Divine Mercy devotees, World Youth Day, Poland, mercy",
    birth_year: 1905,
    death_year: 1938,
    prayers:
      "O Jesus, Eternal Truth, our Life, I call upon You and I beg Your mercy for poor sinners. O sweetest Heart of my Lord, full of pity and unfathomable mercy, I plead with You for poor sinners. O Most Sacred Heart, Fount of Mercy from which gush forth rays of inconceivable graces upon the entire human race, I beg of You light for poor sinners. O Jesus, be mindful of Your own bitter Passion and do not permit the loss of souls redeemed at so dear a price of Your most precious Blood. Through the intercession of St. Faustina, apostle of Your mercy, grant us the grace to trust in Your mercy all the days of our life. Amen.",
    is_dominican: false,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    proper: "Proper of Saints",
  },
  {
    id: "john-paul-ii",
    name: "St. John Paul II",
    feast_day: "10-22",
    short_bio: "Pope who helped end communism in Europe and championed human dignity",
    biography: [
      "St. John Paul II was born Karol Józef Wojtyła on May 18, 1920, in Wadowice, Poland. His early life was marked by tragedy, losing his mother at age 9, his brother at 12, and his father at 20. During the Nazi occupation of Poland, he worked in a quarry and chemical factory while secretly studying for the priesthood in an underground seminary.",
      "Ordained a priest in 1946, he pursued further studies in Rome before returning to Poland where he ministered under the communist regime. He became a professor of ethics and eventually was appointed Archbishop of Kraków in 1964 and made a cardinal by Pope Paul VI in 1967.",
      "On October 16, 1978, Cardinal Wojtyła was elected pope, taking the name John Paul II. At 58, he was the youngest pope in 132 years and the first non-Italian pope in 455 years. His papacy, spanning 26 years until his death in 2005, was one of the longest and most influential in modern history.",
      "John Paul II was a tireless advocate for human rights, dignity, and religious freedom. His support for the Solidarity movement in Poland contributed significantly to the fall of communism in Eastern Europe. He made 104 international trips, visiting 129 countries, earning him the nickname 'The Pilgrim Pope.'",
      "His teachings were prolific, including 14 encyclicals, 15 apostolic exhortations, and 11 apostolic constitutions. He established World Youth Day, canonized 482 saints (more than all his predecessors combined), and developed the Theology of the Body, a comprehensive vision of human sexuality and marriage.",
      "Despite surviving an assassination attempt in 1981, John Paul II forgave his would-be assassin and later met with him in prison. In his later years, he suffered from Parkinson's disease but continued his papal duties, offering a powerful witness of dignity in suffering.",
      "He died on April 2, 2005, with his last words reportedly being 'Let me go to the house of the Father.' His funeral drew millions to Rome and was one of the largest gatherings of heads of state in history. He was beatified by Pope Benedict XVI on May 1, 2011, and canonized by Pope Francis on April 27, 2014.",
    ],
    image_url: "/saints/st-john-paul-ii.jpg",
    patronage: "World Youth Day, young Catholics, families, Polish people",
    birth_year: 1920,
    death_year: 2005,
    prayers:
      "O God, who are rich in mercy and who willed that Saint John Paul II should preside as Pope over your universal Church, grant, we pray, that instructed by his teaching, we may open our hearts to the saving grace of Christ, the sole Redeemer of mankind. Who lives and reigns with you in the unity of the Holy Spirit, one God, for ever and ever. Amen.",
    is_dominican: false,
    rank: CelebrationRank.MEMORIAL,
    color: LiturgicalColor.WHITE,
    proper: "Proper of Saints",
  },
]
