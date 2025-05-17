import { addDays, format, getYear, isEqual, isSunday, parseISO } from "date-fns"
import { type Celebration } from "./celebrations/celebrations-types"
import { CelebrationRank } from "./celebrations/celebrations-types"
import { getLiturgicalSeason, getLiturgicalWeek } from "./liturgical-seasons"
import { getAllCelebrations, getAllMoveableCelebrations } from "./celebrations"
import { getSaintsForDate } from "./saints"

export interface CalendarDay {
  date: Date
  celebrations: Celebration[]
  season: string
  week: string
}

export function getCelebrationsForDate(date: Date): Celebration[] {
  try {
    const year = getYear(date)
    const formattedDate = format(date, "MM-dd")
    const isoDate = format(date, "yyyy-MM-dd")

    // Get fixed celebrations (saints) - but not if it's a Sunday
    const saints = isSunday(date) ? [] : getSaintsForDate(date)

    // Get moveable celebrations (Easter, Pentecost, etc.)
    const allCelebrations = getAllCelebrations(year)

    //console.log("moveableCelebrations celebrations:"+JSON.stringify(moveableCelebrations))
    // Find if there's a moveable celebration on this date
    const moveable = allCelebrations.filter((celebration) => {
      try {
        // Convert celebration date to ISO format
        const celebrationDate = parseISO(`${year}-${celebration.date}`)
        //console.log("celebrationDate="+JSON.stringify(celebrationDate)
        //console.log("comparisonDate="+JSON.stringify(date.toDateString())
        return isEqual(celebrationDate, date)
      } catch (error) {
        console.error("Error parsing celebration date:", error)
        return false
      }
    })
    //console.log("moveable celebrations:"+JSON.stringify(moveable))
    // Combine all celebrations
    let celebrations = [...saints, ...moveable]

    // If no celebrations, add a ferial day
    if (celebrations.length === 0) {
      const season = getLiturgicalSeason(date)
      const weekInfo = getLiturgicalWeek(date, season)
      const isoDate = format(date, "yyyy-MM-dd")

      celebrations = [
        {
          id: `Ferial-${isoDate}`,
          name: `${season.name} Weekday`,
          rank: CelebrationRank.FERIAL,
          color: season.color.toLowerCase(),
          date: isoDate,
          isDominican: false,
          description: `Ferial day in ${season.name}, ${weekInfo}`,
        },
      ]
    }


    // Sort celebrations by importance
    // Helper function to safely parse and format dates for comparison
    const safeFormatDate = (dateStr: string): string => {
      try {
        // First try to parse as full date
        const parsed = parseISO(dateStr);
        if (!isNaN(parsed.getTime())) {
          return format(parsed, 'MM-dd');
        }
        
        // If that fails, try to parse as MM-DD format
        if (/^\d{2}-\d{2}$/.test(dateStr)) {
          return dateStr; // Already in MM-DD format
        }
        
        //console.warn(`Unexpected date format: ${dateStr}`);
        return '12-31'; // Default to end of year for invalid dates
      } catch (error) {
        //console.error(`Error parsing date '${dateStr}':`, error);
        return '12-31'; // Default to end of year for invalid dates
      }
    };

    //console.log('Sorting celebrations:', 
    celebrations.map(c => ({
      name: c.name,
      date: c.date,
      rank: c.rank,
      formattedDate: safeFormatDate(c.date)
    }));
  //);

    celebrations.sort((a, b) => {
      const typeOrder: Record<string, number> = {
        [CelebrationRank.SOLEMNITY]: 1,
        [CelebrationRank.FEAST]: 2,
        [CelebrationRank.MEMORIAL]: 3,
        [CelebrationRank.OPTIONAL_MEMORIAL]: 4,
        [CelebrationRank.FERIAL]: 5,
      };

      // Get the numeric rank for each celebration with fallback
      const rankA = a.rank in typeOrder ? typeOrder[a.rank] : 5;
      const rankB = b.rank in typeOrder ? typeOrder[b.rank] : 5;

      //console.log(`Comparing ${a.name} (${a.rank}, ${a.date}) vs ${b.name} (${b.rank}, ${b.date})`);

      // If ranks are equal, sort by date
      if (rankA === rankB) {
        const dateA = safeFormatDate(a.date);
        const dateB = safeFormatDate(b.date);
        //console.log(`  Same rank (${a.rank}), comparing dates: ${dateA} vs ${dateB}`);
        return dateA < dateB ? -1 : 1;
      }


      //console.log(`  Different ranks: ${rankA} vs ${rankB}`);
      return rankA - rankB;
    });

    //console.log("the celebrations:"+JSON.stringify(celebrations))
    return celebrations
  } catch (error) {
    console.error("Error in getCelebrationsForDate:", error)
    // Return a default ferial day instead of empty array
    return [
      {
        id: `Ferial-${isoDate}`,
        name: "Ordinary Time Weekday",
        rank: CelebrationRank.FERIAL,
        color: "green",
        date: format(date, "MM-dd"),
        isDominican: false,
        description: "Ferial day in Ordinary Time",
      },
    ]
  }
}

export function getCalendarMonth(year: number, month: number): CalendarDay[] {
  const result: CalendarDay[] = []

  try {
    // Create a date for the first day of the month
    const startDate = new Date(year, month - 1, 1)

    // Create a date for the last day of the month
    const endDate = new Date(year, month, 0)

    // Loop through each day of the month
    let currentDate = startDate
    while (currentDate <= endDate) {
      const celebrations = getCelebrationsForDate(currentDate)
      const season = getLiturgicalSeason(currentDate)
      const week = getLiturgicalWeek(currentDate, season)

      result.push({
        date: new Date(currentDate),
        celebrations,
        season: season.name,
        week,
      })

      // Move to the next day
      currentDate = addDays(currentDate, 1)
    }
  } catch (error) {
    console.error("Error in getCalendarMonth:", error)
  }

  return result
}

export function getCalendarYear(year: number): CalendarDay[] {
  const result: CalendarDay[] = []

  try {
    // Loop through each month
    for (let month = 1; month <= 12; month++) {
      result.push(...getCalendarMonth(year, month))
    }
  } catch (error) {
    console.error("Error in getCalendarYear:", error)
  }

  return result
}

export function getSpecialSeasonClass(date: Date): string {
  try {
    const season = getLiturgicalSeason(date)

    if (season.name === "Lent") return "lent"
    if (season.name === "Easter") return "easter"
    if (season.name === "Pentecost") return "pentecost"
    return ""
  } catch (error) {
    console.error("Error in getSpecialSeasonClass:", error)
    return ""
  }
}
