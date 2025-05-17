import type { Saint } from "../saint-types"
import { LiturgicalRank, LiturgicalColor } from "../../liturgical-types"

// November saints
export const novemberGeneralSaints: Saint[] = [
  {
    id: "cecilia",
    name: "St. Cecilia",
    feast_day: "11-22",
    short_bio: "Virgin martyr and patroness of musicians",
    biography: [
      "St. Cecilia was born to a noble Roman family in the early 3rd century. According to tradition, she was a devout Christian from an early age, despite living during a time of persecution. She is said to have heard heavenly music in her heart, which led to her association with music and musicians.",
      "Though she had consecrated her virginity to God, Cecilia's parents arranged for her to marry a young pagan nobleman named Valerian. On their wedding night, she told Valerian that an angel watched over her and would protect her virginity. Valerian asked to see this angel and Cecilia told him he would be able to if he was baptized.",
      "Valerian sought out Pope Urban I, who was hiding in the catacombs, and was instructed and baptized. When he returned to Cecilia, he found her praying in her room with an angel beside her. The angel crowned Cecilia with a wreath of roses and lilies. Valerian's brother, Tiburtius, was also converted after witnessing this miracle.",
      "The brothers began to bury the bodies of martyred Christians, which was forbidden by Roman law. They were arrested and brought before the prefect Turcius Almachius. When they refused to sacrifice to the Roman gods, they were executed. Cecilia buried their bodies and was soon arrested herself for her Christian faith.",
      "Almachius ordered Cecilia to be suffocated in the baths of her own home. When this failed to kill her, an executioner was sent to behead her. The executioner struck her neck three times (the maximum allowed by Roman law) but failed to sever her head completely. Cecilia lived for three more days, during which time she gave away her possessions to the poor and converted many who came to visit her.",
      "She died around 230 AD and was buried in the Catacomb of Callixtus. In 821, her body was transferred to the Church of St. Cecilia in Trastevere, Rome. When her tomb was opened in 1599, her body was found incorrupt, appearing as if she had just died. The sculptor Stefano Maderno created a famous statue depicting her exactly as she was found.",
      "St. Cecilia is one of the most venerated martyrs of Christian antiquity and is mentioned in the Roman Canon of the Mass. Her feast day has been celebrated since the 4th century. She became the patroness of musicians and music in the Middle Ages, and many musical societies and conservatories around the world bear her name.",
      "Artistic depictions of St. Cecilia typically show her playing an organ or other musical instrument, often with an angel nearby. Her story has inspired countless works of art, music, and literature throughout the centuries, including Handel's 'Ode for St. Cecilia's Day' and Raphael's famous painting of the saint.",
    ],
    image_url: "/saints/st-cecilia.jpg",
    patronage: "Musicians, composers, poets, singers, church music, musical instrument makers",
    birth_year: 200,
    death_year: 230,
    prayers:
      "O God, who gladden us with the yearly feast of blessed Cecilia, grant, we pray, that what we venerate in her may be imitated in our lives. Through our Lord Jesus Christ, your Son, who lives and reigns with you in the unity of the Holy Spirit, one God, for ever and ever. Amen.",
    is_dominican: false,
    rank: LiturgicalRank.MEMORIAL,
    color: LiturgicalColor.RED,
    proper: "Proper of Saints",
  },
]
