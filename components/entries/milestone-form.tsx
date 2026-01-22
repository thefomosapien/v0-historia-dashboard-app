"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Milestone, Phase } from "@/lib/types"

interface MilestoneFormProps {
  phase?: Phase | null
  weekStartDate?: string
  weekEndDate?: string
  initialData?: Milestone
  onSubmit: (data: Omit<Milestone, "id" | "user_id" | "created_at" | "updated_at">) => void
  onCancel: () => void
}

export function MilestoneForm({
  phase,
  weekStartDate,
  weekEndDate,
  initialData,
  onSubmit,
  onCancel,
}: MilestoneFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [milestoneDate, setMilestoneDate] = useState(initialData?.milestone_date || weekStartDate || "")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!milestoneDate) {
      setError("Date is required")
      return
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      milestone_date: milestoneDate,
      is_birthday: false,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {phase && (
        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: phase.color }} />
            <span className="text-sm font-medium">{phase.title}</span>
          </div>
          {phase.description && <p className="text-xs text-stone-500 mt-1">{phase.description}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="milestoneTitle">Title</Label>
        <Input
          id="milestoneTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Got married!"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="milestoneDescription">Description (optional)</Label>
        <Textarea
          id="milestoneDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details about this milestone..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="milestoneDate">Date</Label>
        <Input
          id="milestoneDate"
          type="date"
          value={milestoneDate}
          onChange={(e) => setMilestoneDate(e.target.value)}
          min={weekStartDate}
          max={weekEndDate}
        />
        {weekStartDate && weekEndDate && (
          <p className="text-xs text-stone-500">
            This week: {weekStartDate} to {weekEndDate}
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
          {initialData ? "Save Changes" : "Add Milestone"}
        </Button>
      </div>
    </form>
  )
}
