// Historia Data Types

export interface Phase {
  id: string
  user_id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  color: string
  created_at: string
  updated_at: string
}

export interface Memory {
  id: string
  user_id: string
  title: string
  content: string | null
  memory_date: string
  created_at: string
  updated_at: string
}

export interface Milestone {
  id: string
  user_id: string
  title: string
  description: string | null
  milestone_date: string
  is_birthday: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  date_of_birth: string
  created_at: string
  updated_at: string
}

// Computed week data (not stored in DB)
export interface WeekData {
  weekNumber: number
  startDate: Date
  endDate: Date
  isLived: boolean
  phase: Phase | null
  memories: Memory[]
  milestones: Milestone[]
}

// Phase color presets
export const PHASE_COLORS = [
  { name: "Slate", value: "#64748B" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Lime", value: "#84CC16" },
  { name: "Green", value: "#22C55E" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Purple", value: "#A855F7" },
  { name: "Pink", value: "#EC4899" },
  { name: "Rose", value: "#F43F5E" },
]

// Visual hierarchy colors
export const WEEK_COLORS = {
  milestone: "#F59E0B", // Gold - highest priority
  memory: "#3B82F6", // Blue - second priority
  undefined: "#9CA3AF", // Gray - no phase defined
  future: "#FFFFFF", // White - not lived yet
}
