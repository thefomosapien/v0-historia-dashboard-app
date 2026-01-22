// Week calculation utilities

import type { Phase, Memory, Milestone, WeekData } from "./types"

export function getWeekNumber(birthDate: Date, targetDate: Date): number {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  return Math.floor((targetDate.getTime() - birthDate.getTime()) / msPerWeek) + 1
}

export function getWeekDates(birthDate: Date, weekNumber: number): { start: Date; end: Date } {
  const msPerDay = 24 * 60 * 60 * 1000
  const msPerWeek = 7 * msPerDay

  const start = new Date(birthDate.getTime() + (weekNumber - 1) * msPerWeek)
  const end = new Date(start.getTime() + 6 * msPerDay)

  return { start, end }
}

export function getPhaseForWeek(phases: Phase[], weekStart: Date, weekEnd: Date): Phase | null {
  // Find a phase that overlaps with this week
  return (
    phases.find((phase) => {
      const phaseStart = new Date(phase.start_date)
      const phaseEnd = new Date(phase.end_date)
      // Week overlaps with phase if week start is before phase end AND week end is after phase start
      return weekStart <= phaseEnd && weekEnd >= phaseStart
    }) || null
  )
}

export function getMemoriesForWeek(memories: Memory[], weekStart: Date, weekEnd: Date): Memory[] {
  return memories.filter((memory) => {
    const memoryDate = new Date(memory.memory_date)
    return memoryDate >= weekStart && memoryDate <= weekEnd
  })
}

export function getMilestonesForWeek(milestones: Milestone[], weekStart: Date, weekEnd: Date): Milestone[] {
  return milestones.filter((milestone) => {
    const milestoneDate = new Date(milestone.milestone_date)
    return milestoneDate >= weekStart && milestoneDate <= weekEnd
  })
}

export function computeWeekData(
  birthDate: Date,
  weekNumber: number,
  weeksLived: number,
  phases: Phase[],
  memories: Memory[],
  milestones: Milestone[],
): WeekData {
  const { start, end } = getWeekDates(birthDate, weekNumber)

  return {
    weekNumber,
    startDate: start,
    endDate: end,
    isLived: weekNumber <= weeksLived,
    phase: getPhaseForWeek(phases, start, end),
    memories: getMemoriesForWeek(memories, start, end),
    milestones: getMilestonesForWeek(milestones, start, end),
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
