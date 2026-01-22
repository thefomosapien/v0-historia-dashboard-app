"use client"

import { useState, useMemo, useCallback } from "react"
import { LifeGrid } from "./life-grid"
import { WeekStats } from "./week-stats"
import { PhasePanel } from "@/components/phases/phase-panel"
import { WeekDetailPanel } from "@/components/entries/week-detail-panel"
import { computeWeekData } from "@/lib/week-utils"
import type { Phase, Memory, Milestone, WeekData } from "@/lib/types"

interface DashboardClientProps {
  userId: string
  birthDate: string
  weeksLived: number
  initialPhases: Phase[]
  initialMemories: Memory[]
  initialMilestones: Milestone[]
}

export function DashboardClient({
  userId,
  birthDate,
  weeksLived,
  initialPhases,
  initialMemories,
  initialMilestones,
}: DashboardClientProps) {
  const [phases, setPhases] = useState<Phase[]>(initialPhases)
  const [memories, setMemories] = useState<Memory[]>(initialMemories)
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

  const birth = useMemo(() => new Date(birthDate), [birthDate])

  // Compute selected week data
  const selectedWeekData = useMemo<WeekData | null>(() => {
    if (selectedWeek === null) return null
    return computeWeekData(birth, selectedWeek, weeksLived, phases, memories, milestones)
  }, [selectedWeek, birth, weeksLived, phases, memories, milestones])

  // Phase handlers
  const handleAddPhase = useCallback(
    (data: Omit<Phase, "id" | "user_id" | "created_at" | "updated_at">) => {
      const newPhase: Phase = {
        ...data,
        id: `phase-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setPhases((prev) => [...prev, newPhase])
    },
    [userId],
  )

  const handleEditPhase = useCallback((id: string, data: Partial<Phase>) => {
    setPhases((prev) => prev.map((p) => (p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p)))
  }, [])

  const handleDeletePhase = useCallback((id: string) => {
    setPhases((prev) => prev.filter((p) => p.id !== id))
  }, [])

  // Memory handlers
  const handleAddMemory = useCallback(
    (data: Omit<Memory, "id" | "user_id" | "created_at" | "updated_at">) => {
      const newMemory: Memory = {
        ...data,
        id: `memory-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setMemories((prev) => [...prev, newMemory])
    },
    [userId],
  )

  const handleDeleteMemory = useCallback((id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id))
  }, [])

  // Milestone handlers
  const handleAddMilestone = useCallback(
    (data: Omit<Milestone, "id" | "user_id" | "created_at" | "updated_at">) => {
      const newMilestone: Milestone = {
        ...data,
        id: `milestone-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setMilestones((prev) => [...prev, newMilestone])
    },
    [userId],
  )

  const handleDeleteMilestone = useCallback((id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id))
  }, [])

  // Calculate stats
  const memoryCount = memories.length
  const milestoneCount = milestones.filter((m) => !m.is_birthday).length

  return (
    <div className="space-y-6">
      <WeekStats
        weeksLived={weeksLived}
        phasesCount={phases.length}
        memoriesCount={memoryCount}
        milestonesCount={milestoneCount}
        birthDate={birthDate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <LifeGrid
            weeksLived={weeksLived}
            birthDate={birthDate}
            userId={userId}
            phases={phases}
            memories={memories}
            milestones={milestones}
            onWeekClick={setSelectedWeek}
          />
        </div>

        <div className="lg:col-span-1">
          <PhasePanel
            phases={phases}
            onAddPhase={handleAddPhase}
            onEditPhase={handleEditPhase}
            onDeletePhase={handleDeletePhase}
          />
        </div>
      </div>

      <WeekDetailPanel
        weekData={selectedWeekData}
        isOpen={selectedWeek !== null}
        onClose={() => setSelectedWeek(null)}
        onAddMemory={handleAddMemory}
        onAddMilestone={handleAddMilestone}
        onDeleteMemory={handleDeleteMemory}
        onDeleteMilestone={handleDeleteMilestone}
      />
    </div>
  )
}
