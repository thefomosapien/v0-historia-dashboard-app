// Dev mode configuration for testing without authentication
// Set DEV_MODE to true to bypass auth and use mock data

import type { Phase, Memory, Milestone } from "./types"

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

// Generate mock phases
export function generateMockPhases(userId: string, birthDate: string): Phase[] {
  const birth = new Date(birthDate)
  const birthYear = birth.getFullYear()

  return [
    {
      id: "phase-1",
      user_id: userId,
      title: "Early Childhood",
      description: "Growing up in Fresno, California",
      start_date: birthDate,
      end_date: new Date(birthYear + 5, 7, 31).toISOString().split("T")[0],
      color: "#84CC16", // Lime
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "phase-2",
      user_id: userId,
      title: "Elementary School",
      description: "Learning and making friends",
      start_date: new Date(birthYear + 5, 8, 1).toISOString().split("T")[0],
      end_date: new Date(birthYear + 11, 5, 15).toISOString().split("T")[0],
      color: "#06B6D4", // Cyan
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "phase-3",
      user_id: userId,
      title: "Middle School",
      description: "The awkward years",
      start_date: new Date(birthYear + 11, 8, 1).toISOString().split("T")[0],
      end_date: new Date(birthYear + 14, 5, 15).toISOString().split("T")[0],
      color: "#6366F1", // Indigo
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "phase-4",
      user_id: userId,
      title: "High School",
      description: "Finding myself",
      start_date: new Date(birthYear + 14, 8, 1).toISOString().split("T")[0],
      end_date: new Date(birthYear + 18, 5, 15).toISOString().split("T")[0],
      color: "#EC4899", // Pink
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "phase-5",
      user_id: userId,
      title: "College Years",
      description: "Living in Brooklyn, studying hard",
      start_date: new Date(birthYear + 18, 8, 1).toISOString().split("T")[0],
      end_date: new Date(birthYear + 22, 5, 15).toISOString().split("T")[0],
      color: "#3B82F6", // Blue
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "phase-6",
      user_id: userId,
      title: "Early Career",
      description: "Working at Acme Corp, based in LA",
      start_date: new Date(birthYear + 22, 6, 1).toISOString().split("T")[0],
      end_date: new Date(birthYear + 28, 11, 31).toISOString().split("T")[0],
      color: "#F97316", // Orange
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "phase-7",
      user_id: userId,
      title: "Growth Phase",
      description: "Senior role, more responsibilities",
      start_date: new Date(birthYear + 29, 0, 1).toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      color: "#22C55E", // Green
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}

// Generate mock memories
export function generateMockMemories(userId: string, birthDate: string): Memory[] {
  const birth = new Date(birthDate)
  const birthYear = birth.getFullYear()

  return [
    {
      id: "memory-1",
      user_id: userId,
      title: "First day of school",
      content: "I was so nervous but made a friend named Tommy.",
      memory_date: new Date(birthYear + 5, 8, 5).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "memory-2",
      user_id: userId,
      title: "Got my first bike",
      content: "A red Schwinn! I rode it everywhere that summer.",
      memory_date: new Date(birthYear + 7, 5, 20).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "memory-3",
      user_id: userId,
      title: "Family vacation to Yosemite",
      content: "Saw Half Dome for the first time. It was breathtaking.",
      memory_date: new Date(birthYear + 10, 6, 15).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "memory-4",
      user_id: userId,
      title: "High school graduation",
      content: "Finally done! Ready for the next chapter.",
      memory_date: new Date(birthYear + 18, 5, 10).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "memory-5",
      user_id: userId,
      title: "Moved to Brooklyn",
      content: "My first apartment. Tiny but mine.",
      memory_date: new Date(birthYear + 18, 7, 25).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "memory-6",
      user_id: userId,
      title: "Got the job offer",
      content: "Called mom immediately. She cried happy tears.",
      memory_date: new Date(birthYear + 22, 5, 1).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}

// Generate mock milestones including birthdays
export function generateMockMilestones(userId: string, birthDate: string): Milestone[] {
  const milestones: Milestone[] = []
  const birth = new Date(birthDate)
  const birthYear = birth.getFullYear()
  const birthMonth = birth.getMonth()
  const birthDay = birth.getDate()

  // Birthday milestones for ages 1-100
  for (let age = 1; age <= 100; age++) {
    const year = birthYear + age
    milestones.push({
      id: `birthday-${age}`,
      user_id: userId,
      title: `${age} in ${year}`,
      description: null,
      milestone_date: new Date(year, birthMonth, birthDay).toISOString().split("T")[0],
      is_birthday: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  // Custom milestones
  milestones.push(
    {
      id: "milestone-1",
      user_id: userId,
      title: "First steps",
      description: "Walked across the living room to dad",
      milestone_date: new Date(birthYear + 1, 2, 10).toISOString().split("T")[0],
      is_birthday: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "milestone-2",
      user_id: userId,
      title: "Started kindergarten",
      description: "Big kid now!",
      milestone_date: new Date(birthYear + 5, 8, 5).toISOString().split("T")[0],
      is_birthday: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "milestone-3",
      user_id: userId,
      title: "Graduated high school",
      description: "Valedictorian!",
      milestone_date: new Date(birthYear + 18, 5, 15).toISOString().split("T")[0],
      is_birthday: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "milestone-4",
      user_id: userId,
      title: "College graduation",
      description: "BA in Computer Science",
      milestone_date: new Date(birthYear + 22, 4, 20).toISOString().split("T")[0],
      is_birthday: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "milestone-5",
      user_id: userId,
      title: "Got first job",
      description: "Software Engineer at Acme Corp",
      milestone_date: new Date(birthYear + 22, 6, 1).toISOString().split("T")[0],
      is_birthday: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  )

  return milestones.sort((a, b) => a.milestone_date.localeCompare(b.milestone_date))
}
