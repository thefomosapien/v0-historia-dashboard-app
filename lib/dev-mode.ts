// Dev mode configuration for testing without authentication
// Set DEV_MODE to true to bypass auth and use mock data

export const DEV_MODE = true

export const MOCK_USER = {
  id: "dev-user-123",
  email: "dev@historia.app",
}

export const MOCK_PROFILE = {
  id: "dev-user-123",
  email: "dev@historia.app",
  full_name: "Dev User",
  date_of_birth: "1990-06-15", // June 15, 1990
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Generate mock weeks with some documented
export function generateMockWeeks(userId: string, weeksLived: number) {
  const weeks = []

  // Create some documented weeks with varied content
  const documentedWeekNumbers = [1, 52, 104, 156, 260, 520, 780, 1040, 1300, 1560]

  for (const weekNum of documentedWeekNumbers) {
    if (weekNum <= weeksLived) {
      weeks.push({
        id: `week-${weekNum}`,
        user_id: userId,
        week_number: weekNum,
        title: `Week ${weekNum} memories`,
        content: `This is a sample reflection for week ${weekNum}. Life was good.`,
        location: weekNum < 500 ? "Fresno, California" : "San Francisco, California",
        chapter: weekNum < 260 ? "Early Childhood" : weekNum < 520 ? "School Years" : "Adult Life",
        is_milestone: false,
        milestone_date: null,
        is_documented: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
  }

  return weeks
}

// Generate mock milestones including birthdays
export function generateMockMilestones(userId: string, birthDate: string) {
  const milestones = []
  const birth = new Date(birthDate)
  const birthYear = birth.getFullYear()
  const birthMonth = birth.getMonth()
  const birthDay = birth.getDate()

  // Birthday milestones
  for (let age = 1; age <= 100; age++) {
    const year = birthYear + age
    milestones.push({
      id: `birthday-${age}`,
      user_id: userId,
      title: `${age} in ${year}`,
      milestone_date: new Date(year, birthMonth, birthDay).toISOString().split("T")[0],
      is_birthday: true,
      created_at: new Date().toISOString(),
    })
  }

  // Custom milestones
  milestones.push(
    {
      id: "milestone-1",
      user_id: userId,
      title: "First steps",
      milestone_date: new Date(birthYear + 1, 2, 10).toISOString().split("T")[0],
      is_birthday: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "milestone-2",
      user_id: userId,
      title: "Started kindergarten",
      milestone_date: new Date(birthYear + 5, 8, 5).toISOString().split("T")[0],
      is_birthday: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "milestone-3",
      user_id: userId,
      title: "Graduated high school",
      milestone_date: new Date(birthYear + 18, 5, 15).toISOString().split("T")[0],
      is_birthday: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "milestone-4",
      user_id: userId,
      title: "Got first job",
      milestone_date: new Date(birthYear + 22, 6, 1).toISOString().split("T")[0],
      is_birthday: false,
      created_at: new Date().toISOString(),
    },
  )

  return milestones.sort((a, b) => a.milestone_date.localeCompare(b.milestone_date))
}
