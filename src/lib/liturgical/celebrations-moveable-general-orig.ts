import { LiturgicalColor, LiturgicalRank } from "./liturgical-types"
import { calculateEaster } from "./liturgical-seasons"
import type { FixedCelebration } from "./celebrations"

// Define the moveable feasts and solemnities (those that depend on the date of Easter)
export function moveableGeneralCelebrations(year: number): FixedCelebration[] {
  const easterDate = calculateEaster(year)
  const easterMonth = easterDate.getMonth() + 1 // JavaScript months are 0-indexed
  const easterDay = easterDate.getDate()

  // Format Easter date as "MM-DD"
  const easterDateString = `${easterMonth.toString().padStart(2, "0")}-${easterDay.toString().padStart(2, "0")}`

  // Calculate other dates based on Easter
  const ashWednesdayDate = new Date(easterDate)
  ashWednesdayDate.setDate(easterDate.getDate() - 46) // 46 days before Easter
  const ashWednesdayMonth = ashWednesdayDate.getMonth() + 1
  const ashWednesdayDay = ashWednesdayDate.getDate()
  const ashWednesdayString = `${ashWednesdayMonth.toString().padStart(2, "0")}-${ashWednesdayDay.toString().padStart(2, "0")}`

  // Holy Week - Monday, Tuesday, Wednesday
  const holyMondayDate = new Date(easterDate)
  holyMondayDate.setDate(easterDate.getDate() - 6) // 6 days before Easter
  const holyMondayMonth = holyMondayDate.getMonth() + 1
  const holyMondayDay = holyMondayDate.getDate()
  const holyMondayString = `${holyMondayMonth.toString().padStart(2, "0")}-${holyMondayDay.toString().padStart(2, "0")}`

  const holyTuesdayDate = new Date(easterDate)
  holyTuesdayDate.setDate(easterDate.getDate() - 5) // 5 days before Easter
  const holyTuesdayMonth = holyTuesdayDate.getMonth() + 1
  const holyTuesdayDay = holyTuesdayDate.getDate()
  const holyTuesdayString = `${holyTuesdayMonth.toString().padStart(2, "0")}-${holyTuesdayDay.toString().padStart(2, "0")}`

  const holyWednesdayDate = new Date(easterDate)
  holyWednesdayDate.setDate(easterDate.getDate() - 4) // 4 days before Easter
  const holyWednesdayMonth = holyWednesdayDate.getMonth() + 1
  const holyWednesdayDay = holyWednesdayDate.getDate()
  const holyWednesdayString = `${holyWednesdayMonth.toString().padStart(2, "0")}-${holyWednesdayDay.toString().padStart(2, "0")}`

  const palmSundayDate = new Date(easterDate)
  palmSundayDate.setDate(easterDate.getDate() - 7) // 7 days before Easter
  const palmSundayMonth = palmSundayDate.getMonth() + 1
  const palmSundayDay = palmSundayDate.getDate()
  const palmSundayString = `${palmSundayMonth.toString().padStart(2, "0")}-${palmSundayDay.toString().padStart(2, "0")}`

  // Calculate Laetare Sunday (4th Sunday of Lent - 3 weeks before Easter)
  const laetareSundayDate = new Date(easterDate)
  laetareSundayDate.setDate(easterDate.getDate() - 21) // 21 days (3 weeks) before Easter
  const laetareSundayMonth = laetareSundayDate.getMonth() + 1
  const laetareSundayDay = laetareSundayDate.getDate()
  const laetareSundayString = `${laetareSundayMonth.toString().padStart(2, "0")}-${laetareSundayDay.toString().padStart(2, "0")}`

  const holyThursdayDate = new Date(easterDate)
  holyThursdayDate.setDate(easterDate.getDate() - 3) // 3 days before Easter
  const holyThursdayMonth = holyThursdayDate.getMonth() + 1
  const holyThursdayDay = holyThursdayDate.getDate()
  const holyThursdayString = `${holyThursdayMonth.toString().padStart(2, "0")}-${holyThursdayDay.toString().padStart(2, "0")}`

  const goodFridayDate = new Date(easterDate)
  goodFridayDate.setDate(easterDate.getDate() - 2) // 2 days before Easter
  const goodFridayMonth = goodFridayDate.getMonth() + 1
  const goodFridayDay = goodFridayDate.getDate()
  const goodFridayString = `${goodFridayMonth.toString().padStart(2, "0")}-${goodFridayDay.toString().padStart(2, "0")}`

  const holySaturdayDate = new Date(easterDate)
  holySaturdayDate.setDate(easterDate.getDate() - 1) // 1 day before Easter
  const holySaturdayMonth = holySaturdayDate.getMonth() + 1
  const holySaturdayDay = holySaturdayDate.getDate()
  const holySaturdayString = `${holySaturdayMonth.toString().padStart(2, "0")}-${holySaturdayDay.toString().padStart(2, "0")}`

  // Easter Octave - Monday through Saturday
  const easterMondayDate = new Date(easterDate)
  easterMondayDate.setDate(easterDate.getDate() + 1) // 1 day after Easter
  const easterMondayMonth = easterMondayDate.getMonth() + 1
  const easterMondayDay = easterMondayDate.getDate()
  const easterMondayString = `${easterMondayMonth.toString().padStart(2, "0")}-${easterMondayDay.toString().padStart(2, "0")}`

  const easterTuesdayDate = new Date(easterDate)
  easterTuesdayDate.setDate(easterDate.getDate() + 2) // 2 days after Easter
  const easterTuesdayMonth = easterTuesdayDate.getMonth() + 1
  const easterTuesdayDay = easterTuesdayDate.getDate()
  const easterTuesdayString = `${easterTuesdayMonth.toString().padStart(2, "0")}-${easterTuesdayDay.toString().padStart(2, "0")}`

  const easterWednesdayDate = new Date(easterDate)
  easterWednesdayDate.setDate(easterDate.getDate() + 3) // 3 days after Easter
  const easterWednesdayMonth = easterWednesdayDate.getMonth() + 1
  const easterWednesdayDay = easterWednesdayDate.getDate()
  const easterWednesdayString = `${easterWednesdayMonth.toString().padStart(2, "0")}-${easterWednesdayDay.toString().padStart(2, "0")}`

  const easterThursdayDate = new Date(easterDate)
  easterThursdayDate.setDate(easterDate.getDate() + 4) // 4 days after Easter
  const easterThursdayMonth = easterThursdayDate.getMonth() + 1
  const easterThursdayDay = easterThursdayDate.getDate()
  const easterThursdayString = `${easterThursdayMonth.toString().padStart(2, "0")}-${easterThursdayDay.toString().padStart(2, "0")}`

  const easterFridayDate = new Date(easterDate)
  easterFridayDate.setDate(easterDate.getDate() + 5) // 5 days after Easter
  const easterFridayMonth = easterFridayDate.getMonth() + 1
  const easterFridayDay = easterFridayDate.getDate()
  const easterFridayString = `${easterFridayMonth.toString().padStart(2, "0")}-${easterFridayDay.toString().padStart(2, "0")}`

  const easterSaturdayDate = new Date(easterDate)
  easterSaturdayDate.setDate(easterDate.getDate() + 6) // 6 days after Easter
  const easterSaturdayMonth = easterSaturdayDate.getMonth() + 1
  const easterSaturdayDay = easterSaturdayDate.getDate()
  const easterSaturdayString = `${easterSaturdayMonth.toString().padStart(2, "0")}-${easterSaturdayDay.toString().padStart(2, "0")}`

  const divineMercyDate = new Date(easterDate)
  divineMercyDate.setDate(easterDate.getDate() + 7) // 7 days (one week) after Easter
  const divineMercyMonth = divineMercyDate.getMonth() + 1
  const divineMercyDay = divineMercyDate.getDate()
  const divineMercyString = `${divineMercyMonth.toString().padStart(2, "0")}-${divineMercyDay.toString().padStart(2, "0")}`

  const ascensionDate = new Date(easterDate)
  ascensionDate.setDate(easterDate.getDate() + 39) // 39 days after Easter (traditionally 40, but we're calculating from Easter Sunday)
  const ascensionMonth = ascensionDate.getMonth() + 1
  const ascensionDay = ascensionDate.getDate()
  const ascensionString = `${ascensionMonth.toString().padStart(2, "0")}-${ascensionDay.toString().padStart(2, "0")}`

  const pentecostDate = new Date(easterDate)
  pentecostDate.setDate(easterDate.getDate() + 49) // 49 days after Easter (7 weeks)
  const pentecostMonth = pentecostDate.getMonth() + 1
  const pentecostDay = pentecostDate.getDate()
  const pentecostString = `${pentecostMonth.toString().padStart(2, "0")}-${pentecostDay.toString().padStart(2, "0")}`

  const trinityDate = new Date(easterDate)
  trinityDate.setDate(easterDate.getDate() + 56) // 56 days after Easter (8 weeks)
  const trinityMonth = trinityDate.getMonth() + 1
  const trinityDay = trinityDate.getDate()
  const trinityString = `${trinityMonth.toString().padStart(2, "0")}-${trinityDay.toString().padStart(2, "0")}`

  const corpusChristiDate = new Date(easterDate)
  corpusChristiDate.setDate(easterDate.getDate() + 60) // 60 days after Easter (Thursday after Trinity Sunday)
  const corpusChristiMonth = corpusChristiDate.getMonth() + 1
  const corpusChristiDay = corpusChristiDate.getDate()
  const corpusChristiString = `${corpusChristiMonth.toString().padStart(2, "0")}-${corpusChristiDay.toString().padStart(2, "0")}`

  const sacredHeartDate = new Date(easterDate)
  sacredHeartDate.setDate(easterDate.getDate() + 68) // 68 days after Easter (Friday after Corpus Christi)
  const sacredHeartMonth = sacredHeartDate.getMonth() + 1
  const sacredHeartDay = sacredHeartDate.getDate()
  const sacredHeartString = `${sacredHeartMonth.toString().padStart(2, "0")}-${sacredHeartDay.toString().padStart(2, "0")}`

  // Calculate Gaudete Sunday (3rd Sunday of Advent - approximately 2 weeks before Christmas)
  const christmasDate = new Date(year, 11, 25) // December 25
  const gaudeteDate = new Date(christmasDate)
  // Find the Sunday before Christmas
  const daysToLastSunday = christmasDate.getDay() === 0 ? 7 : christmasDate.getDay()
  // Go back to 4th Sunday of Advent, then back one more week to 3rd Sunday (Gaudete)
  gaudeteDate.setDate(christmasDate.getDate() - daysToLastSunday - 7)
  const gaudeteMonth = gaudeteDate.getMonth() + 1
  const gaudeteDay = gaudeteDate.getDate()
  const gaudeteString = `${gaudeteMonth.toString().padStart(2, "0")}-${gaudeteDay.toString().padStart(2, "0")}`

  // Calculate Holy Family (Sunday within the Octave of Christmas, or December 30 if no Sunday falls within the Octave)
  const holyFamilyDate = new Date(christmasDate) // Start with Christmas
  // Find the next Sunday after Christmas, or December 30 if there is no Sunday within the Octave
  const christmasDay = holyFamilyDate.getDay() // Day of the week for Christmas (0 = Sunday, 1 = Monday, etc.)
  if (christmasDay === 0) {
    // If Christmas is on Sunday, Holy Family is on December 30
    holyFamilyDate.setDate(30)
  } else {
    // Otherwise, find the next Sunday after Christmas
    const daysUntilSunday = 7 - christmasDay
    holyFamilyDate.setDate(25 + daysUntilSunday)
    // If this Sunday is after January 1, set to December 30
    if (holyFamilyDate.getDate() > 31 || holyFamilyDate.getMonth() > 11) {
      holyFamilyDate.setDate(30)
      holyFamilyDate.setMonth(11) // December
    }
  }
  const holyFamilyMonth = holyFamilyDate.getMonth() + 1
  const holyFamilyDay = holyFamilyDate.getDate()
  const holyFamilyString = `${holyFamilyMonth.toString().padStart(2, "0")}-${holyFamilyDay.toString().padStart(2, "0")}`

  // Create the array of moveable celebrations
  return [
    {
      id: "ash-wednesday",
      name: "Ash Wednesday",
      date: ashWednesdayString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.VIOLET,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The beginning of Lent, a day of fasting and abstinence.",
      description: [
        "Ash Wednesday marks the beginning of Lent, a 40-day period of prayer, fasting, and almsgiving that prepares us for Easter.",
        "On this day, Catholics receive ashes on their foreheads as a sign of repentance and a reminder of mortality.",
        "The ashes are made from blessed palm branches from the previous year's Palm Sunday.",
        "The priest or minister marks the forehead with ashes in the sign of the cross, saying either 'Remember that you are dust, and to dust you shall return' or 'Repent and believe in the Gospel.'",
        "Ash Wednesday is a day of fasting and abstinence from meat for Catholics.",
      ],
    },
    {
      id: "laetare-sunday",
      name: "Laetare Sunday",
      date: laetareSundayString,
      rank: LiturgicalRank.FEAST,
      color: LiturgicalColor.ROSE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The fourth Sunday of Lent, a day of rejoicing amid the penitential season.",
      description: [
        "Laetare Sunday is the fourth Sunday of Lent, marking the halfway point of the Lenten season.",
        "The name comes from the Latin word 'laetare,' meaning 'rejoice,' which is the first word of the entrance antiphon for the Mass on this day.",
        "It is a day of joy and hope amid the penitential season of Lent, symbolized by the rose-colored vestments worn by the priest instead of the usual violet.",
        "Traditionally, this Sunday was a day of relaxation from the normal Lenten rigors, a day of hope with Easter at last within sight.",
      ],
    },
    {
      id: "palm-sunday",
      name: "Palm Sunday of the Lord's Passion",
      date: palmSundayString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.RED,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Commemorates Jesus' triumphal entry into Jerusalem and marks the beginning of Holy Week.",
      description: [
        "Palm Sunday commemorates Jesus' triumphal entry into Jerusalem, when the crowd laid palms at his feet and proclaimed him king.",
        "It marks the beginning of Holy Week, the most solemn week in the Christian calendar.",
        "The liturgy begins with a blessing of palms and a procession, symbolizing Jesus' entry into Jerusalem.",
        "The Gospel reading for the day is the Passion narrative, recounting Jesus' suffering and death.",
        "The blessed palms are taken home by the faithful and kept as sacramentals, often placed behind crucifixes or religious images.",
      ],
    },
    {
      id: "holy-monday",
      name: "Monday of Holy Week",
      date: holyMondayString,
      rank: LiturgicalRank.MEMORIAL,
      color: LiturgicalColor.VIOLET,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The Monday of Holy Week, commemorating Jesus' actions in Jerusalem.",
      description: [
        "Monday of Holy Week continues the solemn preparation for Easter.",
        "The Gospel reading for this day often focuses on Jesus' anointing at Bethany, where Mary anoints his feet with costly perfume.",
        "This day is part of the final week of Lent, leading up to the Easter Triduum.",
      ],
    },
    {
      id: "holy-tuesday",
      name: "Tuesday of Holy Week",
      date: holyTuesdayString,
      rank: LiturgicalRank.MEMORIAL,
      color: LiturgicalColor.VIOLET,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The Tuesday of Holy Week, commemorating Jesus' teachings in Jerusalem.",
      description: [
        "Tuesday of Holy Week continues the solemn preparation for Easter.",
        "The Gospel reading for this day often focuses on Jesus' prediction of his betrayal by Judas and denial by Peter.",
        "This day is part of the final week of Lent, leading up to the Easter Triduum.",
      ],
    },
    {
      id: "holy-wednesday",
      name: "Wednesday of Holy Week",
      date: holyWednesdayString,
      rank: LiturgicalRank.MEMORIAL,
      color: LiturgicalColor.VIOLET,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The Wednesday of Holy Week, traditionally known as 'Spy Wednesday' for Judas' betrayal.",
      description: [
        "Wednesday of Holy Week continues the solemn preparation for Easter.",
        "Traditionally known as 'Spy Wednesday,' this day commemorates Judas' agreement to betray Jesus for 30 pieces of silver.",
        "The Gospel reading for this day often focuses on Jesus' betrayal and the preparations for the Last Supper.",
        "This day is part of the final week of Lent, leading up to the Easter Triduum.",
      ],
    },
    {
      id: "holy-thursday",
      name: "Holy Thursday (Mass of the Lord's Supper)",
      date: holyThursdayString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Commemorates the Last Supper and the institution of the Eucharist and the priesthood.",
      description: [
        "Holy Thursday commemorates the Last Supper, when Jesus instituted the Eucharist and the priesthood.",
        "The Mass of the Lord's Supper is celebrated in the evening, marking the beginning of the Easter Triduum.",
        "During this Mass, the priest washes the feet of selected parishioners, reenacting Jesus' washing of the disciples' feet.",
        "After the Mass, the Blessed Sacrament is transferred to an altar of repose, and the main altar is stripped bare.",
        "The faithful are encouraged to spend time in adoration before the Blessed Sacrament, commemorating Jesus' agony in the Garden of Gethsemane.",
      ],
    },
    {
      id: "good-friday",
      name: "Good Friday of the Lord's Passion",
      date: goodFridayString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.RED,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Commemorates the crucifixion and death of Jesus Christ.",
      description: [
        "Good Friday commemorates the crucifixion and death of Jesus Christ.",
        "It is a day of fasting and abstinence from meat for Catholics.",
        "The liturgy includes the reading of the Passion narrative, the veneration of the cross, and Holy Communion (consecrated on Holy Thursday).",
        "The altar remains bare, and the church is notably austere, reflecting the solemnity of the day.",
        "Good Friday is the second day of the Easter Triduum, which began on Holy Thursday evening and concludes on Easter Sunday evening.",
      ],
    },
    {
      id: "holy-saturday",
      name: "Holy Saturday (Easter Vigil)",
      date: holySaturdayString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Commemorates Jesus' burial and descent into hell; the Easter Vigil celebrates his resurrection.",
      description: [
        "Holy Saturday commemorates Jesus' burial and descent into hell.",
        "During the day, the church remains in mourning, with no Mass celebrated until the Easter Vigil in the evening.",
        "The Easter Vigil is the first celebration of Easter, traditionally held after sunset on Holy Saturday.",
        "The Vigil begins with the Service of Light, where the Paschal candle is blessed and lit from a new fire, symbolizing Christ as the Light of the World.",
        "The liturgy includes the Exsultet (Easter Proclamation), several readings from the Old Testament, the renewal of baptismal promises, and the first Mass of Easter.",
        "The Easter Vigil is also a traditional time for the reception of new members into the Church through Baptism, Confirmation, and First Communion.",
      ],
    },
    {
      id: "easter",
      name: "Easter Sunday of the Resurrection of the Lord",
      date: easterDateString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Celebrates the resurrection of Jesus Christ from the dead.",
      description: [
        "Easter Sunday celebrates the resurrection of Jesus Christ from the dead, the central feast of the Christian liturgical year.",
        "According to the Gospels, Jesus rose from the dead on the third day after his crucifixion, bringing salvation to humanity.",
        "Easter is the culmination of Holy Week and the Easter Triduum, and the beginning of the Easter season, which lasts for 50 days until Pentecost.",
        "The Easter liturgy is characterized by joy and celebration, with the church adorned with flowers, the return of the 'Alleluia' (which is not said during Lent), and festive music.",
        "Easter customs vary around the world but often include special foods, family gatherings, and activities like egg hunts for children.",
      ],
    },
    {
      id: "easter-monday",
      name: "Monday within the Octave of Easter",
      date: easterMondayString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The Monday after Easter Sunday, part of the Octave of Easter.",
      description: [
        "Easter Monday is the second day of the Octave of Easter, the eight-day period that follows Easter Sunday.",
        "During the Octave of Easter, each day is celebrated as a solemnity, the highest rank of feast in the Catholic Church.",
        "The Gospel readings during the Octave focus on the appearances of the risen Jesus to his disciples.",
        "In many countries, Easter Monday is a public holiday, allowing for extended Easter celebrations.",
      ],
    },
    {
      id: "easter-tuesday",
      name: "Tuesday within the Octave of Easter",
      date: easterTuesdayString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The Tuesday after Easter Sunday, part of the Octave of Easter.",
      description: [
        "Easter Tuesday is the third day of the Octave of Easter, the eight-day period that follows Easter Sunday.",
        "During the Octave of Easter, each day is celebrated as a solemnity, the highest rank of feast in the Catholic Church.",
        "The Gospel readings during the Octave focus on the appearances of the risen Jesus to his disciples.",
      ],
    },
    {
      id: "easter-wednesday",
      name: "Wednesday within the Octave of Easter",
      date: easterWednesdayString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The Wednesday after Easter Sunday, part of the Octave of Easter.",
      description: [
        "Easter Wednesday is the fourth day of the Octave of Easter, the eight-day period that follows Easter Sunday.",
        "During the Octave of Easter, each day is celebrated as a solemnity, the highest rank of feast in the Catholic Church.",
        "The Gospel readings during the Octave focus on the appearances of the risen Jesus to his disciples.",
      ],
    },
    {
      id: "easter-thursday",
      name: "Thursday within the Octave of Easter",
      date: easterThursdayString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The Thursday after Easter Sunday, part of the Octave of Easter.",
      description: [
        "Easter Thursday is the fifth day of the Octave of Easter, the eight-day period that follows Easter Sunday.",
        "During the Octave of Easter, each day is celebrated as a solemnity, the highest rank of feast in the Catholic Church.",
        "The Gospel readings during the Octave focus on the appearances of the risen Jesus to his disciples.",
      ],
    },
    {
      id: "easter-friday",
      name: "Friday within the Octave of Easter",
      date: easterFridayString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The Friday after Easter Sunday, part of the Octave of Easter.",
      description: [
        "Easter Friday is the sixth day of the Octave of Easter, the eight-day period that follows Easter Sunday.",
        "During the Octave of Easter, each day is celebrated as a solemnity, the highest rank of feast in the Catholic Church.",
        "The Gospel readings during the Octave focus on the appearances of the risen Jesus to his disciples.",
      ],
    },
    {
      id: "easter-saturday",
      name: "Saturday within the Octave of Easter",
      date: easterSaturdayString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The Saturday after Easter Sunday, part of the Octave of Easter.",
      description: [
        "Easter Saturday is the seventh day of the Octave of Easter, the eight-day period that follows Easter Sunday.",
        "During the Octave of Easter, each day is celebrated as a solemnity, the highest rank of feast in the Catholic Church.",
        "The Gospel readings during the Octave focus on the appearances of the risen Jesus to his disciples.",
      ],
    },
    {
      id: "divine-mercy",
      name: "Second Sunday of Easter (Divine Mercy Sunday)",
      date: divineMercyString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The Sunday after Easter, also known as Divine Mercy Sunday.",
      description: [
        "The Second Sunday of Easter, also known as Divine Mercy Sunday, concludes the Octave of Easter.",
        "Divine Mercy Sunday was established by Pope John Paul II in 2000, based on the visions of St. Faustina Kowalska.",
        "The Gospel reading for this day recounts Jesus' appearance to the disciples in the Upper Room, when he gave them the power to forgive sins.",
        "The Divine Mercy devotion emphasizes God's merciful love and forgiveness, symbolized by the image of Jesus with rays of red and pale light emanating from his heart.",
        "Special devotions on this day include the recitation of the Divine Mercy Chaplet and veneration of the Divine Mercy image.",
      ],
    },
    {
      id: "ascension",
      name: "The Ascension of the Lord",
      date: ascensionString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Commemorates Jesus' ascension into heaven 40 days after his resurrection.",
      description: [
        "The Ascension of the Lord commemorates Jesus' ascension into heaven 40 days after his resurrection.",
        "According to the Acts of the Apostles, Jesus appeared to his disciples during these 40 days, teaching them about the kingdom of God.",
        "Before ascending, Jesus commissioned his disciples to be his witnesses to the ends of the earth and promised the coming of the Holy Spirit.",
        "Traditionally celebrated on a Thursday (40 days after Easter), in many countries it is now observed on the following Sunday.",
        "The Ascension marks the end of Jesus' earthly ministry and his exaltation at the right hand of the Father.",
      ],
    },
    {
      id: "pentecost",
      name: "Pentecost Sunday",
      date: pentecostString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.RED,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Celebrates the descent of the Holy Spirit upon the Apostles and the birth of the Church.",
      description: [
        "Pentecost Sunday celebrates the descent of the Holy Spirit upon the Apostles and the birth of the Church.",
        "It occurs 50 days after Easter (the name 'Pentecost' comes from the Greek word for 'fiftieth').",
        "According to the Acts of the Apostles, the Holy Spirit descended upon the Apostles like tongues of fire, giving them the ability to speak in different languages.",
        "Pentecost marks the end of the Easter season in the liturgical calendar.",
        "It is often called the 'birthday of the Church' because it was after receiving the Holy Spirit that the Apostles began to preach the Gospel and baptize converts.",
      ],
    },
    {
      id: "trinity",
      name: "The Most Holy Trinity",
      date: trinityString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Celebrates the mystery of the Holy Trinity: Father, Son, and Holy Spirit.",
      description: [
        "The Solemnity of the Most Holy Trinity celebrates the central mystery of the Christian faith: one God in three Persons - Father, Son, and Holy Spirit.",
        "It is celebrated on the Sunday after Pentecost.",
        "Unlike many other feasts, Trinity Sunday does not commemorate a specific event but rather a doctrine of the Church.",
        "The Trinity is a mystery that cannot be fully comprehended by human reason alone but is revealed in Scripture and Tradition.",
        "The doctrine of the Trinity was formally defined at the First Council of Nicaea in 325 AD.",
      ],
    },
    {
      id: "corpus-christi",
      name: "The Most Holy Body and Blood of Christ (Corpus Christi)",
      date: corpusChristiString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Celebrates the Real Presence of Jesus Christ in the Eucharist.",
      description: [
        "The Solemnity of the Most Holy Body and Blood of Christ (Corpus Christi) celebrates the Real Presence of Jesus Christ in the Eucharist.",
        "Traditionally celebrated on the Thursday after Trinity Sunday, in many countries it is now observed on the following Sunday.",
        "The feast originated in the 13th century after St. Juliana of Liège had visions calling for a feast to honor the Blessed Sacrament.",
        "Pope Urban IV instituted the feast for the universal Church in 1264.",
        "Corpus Christi is often celebrated with Eucharistic processions, where the Blessed Sacrament is carried through the streets, accompanied by hymns and prayers.",
      ],
    },
    {
      id: "sacred-heart",
      name: "The Most Sacred Heart of Jesus",
      date: sacredHeartString,
      rank: LiturgicalRank.SOLEMNITY,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Celebrates the love of Jesus Christ for humanity, symbolized by his physical heart.",
      description: [
        "The Solemnity of the Most Sacred Heart of Jesus celebrates the love of Jesus Christ for humanity, symbolized by his physical heart.",
        "It is celebrated on the Friday following the second Sunday after Pentecost (19 days after Pentecost).",
        "The devotion to the Sacred Heart has its origins in the 11th century but became widespread after the visions of St. Margaret Mary Alacoque in the 17th century.",
        "Pope Pius IX extended the feast to the universal Church in 1856.",
        "The Sacred Heart is often depicted in art as a heart surrounded by a crown of thorns, with flames and a cross at the top, symbolizing Jesus' sacrificial love.",
      ],
    },
    {
      id: "holy-family",
      name: "The Holy Family of Jesus, Mary, and Joseph",
      date: holyFamilyString,
      rank: LiturgicalRank.FEAST,
      color: LiturgicalColor.WHITE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "Celebrates the family life of Jesus, Mary, and Joseph in Nazareth.",
      description: [
        "The Feast of the Holy Family celebrates the family life of Jesus, Mary, and Joseph in Nazareth.",
        "It is celebrated on the Sunday within the Octave of Christmas (between December 25 and January 1), or on December 30 if no Sunday falls within the Octave.",
        "The feast was instituted by Pope Leo XIII in 1893 and promotes the Holy Family as a model for Christian families.",
        "The Holy Family is seen as exemplifying the virtues of family life and the importance of living in communion with God.",
        "The feast is an opportunity to reflect on the importance of family life and to pray for families facing challenges.",
      ],
    },
    {
      id: "gaudete-sunday",
      name: "Gaudete Sunday",
      date: gaudeteString,
      rank: LiturgicalRank.FEAST,
      color: LiturgicalColor.ROSE,
      proper: "Proper of Time",
      type: "universal",
      short_desc: "The third Sunday of Advent, a day of rejoicing amid the penitential season.",
      description: [
        "Gaudete Sunday is the third Sunday of Advent, marking the halfway point of the Advent season.",
        "The name comes from the Latin word 'gaudete,' meaning 'rejoice,' which is the first word of the entrance antiphon for the Mass on this day.",
        "It is a day of joy and hope amid the penitential season of Advent, symbolized by the rose-colored vestments worn by the priest instead of the usual violet.",
        "Traditionally, this Sunday was a day of relaxation from the normal Advent rigors, a day of hope with Christmas drawing near.",
      ],
    },
  ]
}
