"use client"

import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/week-utils"
import type { Phase } from "@/lib/types"

interface PhaseListProps {
  phases: Phase[]
  onEdit: (phase: Phase) => void
  onDelete: (id: string) => void
  onClick?: (phase: Phase) => void
}

export function PhaseList({ phases, onEdit, onDelete, onClick }: PhaseListProps) {
  const sortedPhases = [...phases].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())

  if (sortedPhases.length === 0) {
    return (
      <div className="text-center py-8 text-stone-500">
        <p>No phases defined yet.</p>
        <p className="text-sm mt-1">Create your first life phase to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sortedPhases.map((phase) => (
        <div
          key={phase.id}
          className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer group"
          onClick={() => onClick?.(phase)}
        >
          <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: phase.color }} />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{phase.title}</div>
            <div className="text-xs text-stone-500">
              {formatDate(phase.start_date)} - {formatDate(phase.end_date)}
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(phase)
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(phase.id)
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
