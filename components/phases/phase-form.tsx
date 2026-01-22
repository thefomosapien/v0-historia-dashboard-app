"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PHASE_COLORS, type Phase } from "@/lib/types"
import { cn } from "@/lib/utils"

interface PhaseFormProps {
  existingPhases: Phase[]
  initialData?: Phase
  onSubmit: (data: Omit<Phase, "id" | "user_id" | "created_at" | "updated_at">) => void
  onCancel: () => void
}

export function PhaseForm({ existingPhases, initialData, onSubmit, onCancel }: PhaseFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [startDate, setStartDate] = useState(initialData?.start_date || "")
  const [endDate, setEndDate] = useState(initialData?.end_date || "")
  const [color, setColor] = useState(initialData?.color || PHASE_COLORS[0].value)
  const [error, setError] = useState<string | null>(null)

  const checkOverlap = (start: string, end: string): boolean => {
    const newStart = new Date(start)
    const newEnd = new Date(end)

    for (const phase of existingPhases) {
      const phaseStart = new Date(phase.start_date)
      const phaseEnd = new Date(phase.end_date)

      // Check if date ranges overlap
      if (newStart <= phaseEnd && newEnd >= phaseStart) {
        return true
      }
    }
    return false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!startDate || !endDate) {
      setError("Start and end dates are required")
      return
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date must be after start date")
      return
    }

    if (checkOverlap(startDate, endDate)) {
      setError("This phase overlaps with an existing phase. Please adjust the dates.")
      return
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      start_date: startDate,
      end_date: endDate,
      color,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., College Years" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Living in Brooklyn, studying Computer Science"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {PHASE_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              className={cn(
                "w-8 h-8 rounded-md transition-all",
                color === c.value && "ring-2 ring-offset-2 ring-stone-800",
              )}
              style={{ backgroundColor: c.value }}
              onClick={() => setColor(c.value)}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-stone-800 hover:bg-stone-900">
          {initialData ? "Save Changes" : "Create Phase"}
        </Button>
      </div>
    </form>
  )
}
