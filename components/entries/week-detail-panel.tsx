"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MemoryForm } from "./memory-form"
import { MilestoneForm } from "./milestone-form"
import { formatDate } from "@/lib/week-utils"
import type { WeekData, Memory, Milestone } from "@/lib/types"

interface WeekDetailPanelProps {
  weekData: WeekData | null
  isOpen: boolean
  onClose: () => void
  onAddMemory: (data: Omit<Memory, "id" | "user_id" | "created_at" | "updated_at">) => void
  onAddMilestone: (data: Omit<Milestone, "id" | "user_id" | "created_at" | "updated_at">) => void
  onDeleteMemory: (id: string) => void
  onDeleteMilestone: (id: string) => void
}

export function WeekDetailPanel({
  weekData,
  isOpen,
  onClose,
  onAddMemory,
  onAddMilestone,
  onDeleteMemory,
  onDeleteMilestone,
}: WeekDetailPanelProps) {
  const [showMemoryForm, setShowMemoryForm] = useState(false)
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)

  if (!weekData) return null

  const { weekNumber, startDate, endDate, phase, memories, milestones } = weekData
  const weekStartStr = startDate.toISOString().split("T")[0]
  const weekEndStr = endDate.toISOString().split("T")[0]

  const handleAddMemory = (data: Omit<Memory, "id" | "user_id" | "created_at" | "updated_at">) => {
    onAddMemory(data)
    setShowMemoryForm(false)
  }

  const handleAddMilestone = (data: Omit<Milestone, "id" | "user_id" | "created_at" | "updated_at">) => {
    onAddMilestone(data)
    setShowMilestoneForm(false)
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-serif">Week {weekNumber}</SheetTitle>
            <SheetDescription>
              {formatDate(startDate)} - {formatDate(endDate)}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Phase Section */}
            <div>
              <h3 className="text-sm font-medium text-stone-500 mb-2">Life Phase</h3>
              {phase ? (
                <div className="p-3 rounded-lg border border-stone-200">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: phase.color }} />
                    <span className="font-medium">{phase.title}</span>
                  </div>
                  {phase.description && <p className="text-sm text-stone-600 mt-2">{phase.description}</p>}
                  <p className="text-xs text-stone-500 mt-2">
                    {formatDate(phase.start_date)} - {formatDate(phase.end_date)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-stone-500 italic">No phase defined for this period</p>
              )}
            </div>

            {/* Milestones Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-stone-500">Milestones</h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs bg-transparent"
                  onClick={() => setShowMilestoneForm(true)}
                >
                  Add Milestone
                </Button>
              </div>
              {milestones.length > 0 ? (
                <div className="space-y-2">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="p-3 rounded-lg border border-amber-200 bg-amber-50 group">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {milestone.is_birthday && <span className="text-sm">🎂</span>}
                            <span className="font-medium text-sm">{milestone.title}</span>
                          </div>
                          {milestone.description && (
                            <p className="text-sm text-stone-600 mt-1">{milestone.description}</p>
                          )}
                          <p className="text-xs text-stone-500 mt-1">{formatDate(milestone.milestone_date)}</p>
                        </div>
                        {!milestone.is_birthday && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs text-red-600 opacity-0 group-hover:opacity-100"
                            onClick={() => onDeleteMilestone(milestone.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500 italic">No milestones this week</p>
              )}
            </div>

            {/* Memories Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-stone-500">Memories</h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs bg-transparent"
                  onClick={() => setShowMemoryForm(true)}
                >
                  Add Memory
                </Button>
              </div>
              {memories.length > 0 ? (
                <div className="space-y-2">
                  {memories.map((memory) => (
                    <div key={memory.id} className="p-3 rounded-lg border border-blue-200 bg-blue-50 group">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-medium text-sm">{memory.title}</span>
                          {memory.content && <p className="text-sm text-stone-600 mt-1">{memory.content}</p>}
                          <p className="text-xs text-stone-500 mt-1">{formatDate(memory.memory_date)}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs text-red-600 opacity-0 group-hover:opacity-100"
                          onClick={() => onDeleteMemory(memory.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500 italic">No memories this week</p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Memory Dialog */}
      <Dialog open={showMemoryForm} onOpenChange={setShowMemoryForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Memory</DialogTitle>
            <DialogDescription>Record a memory from Week {weekNumber}</DialogDescription>
          </DialogHeader>
          <MemoryForm
            phase={phase}
            weekStartDate={weekStartStr}
            weekEndDate={weekEndStr}
            onSubmit={handleAddMemory}
            onCancel={() => setShowMemoryForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Add Milestone Dialog */}
      <Dialog open={showMilestoneForm} onOpenChange={setShowMilestoneForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Milestone</DialogTitle>
            <DialogDescription>Record a significant life event from Week {weekNumber}</DialogDescription>
          </DialogHeader>
          <MilestoneForm
            phase={phase}
            weekStartDate={weekStartStr}
            weekEndDate={weekEndStr}
            onSubmit={handleAddMilestone}
            onCancel={() => setShowMilestoneForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
