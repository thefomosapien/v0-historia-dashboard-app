"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Memory, Phase } from "@/lib/types"

interface MemoryFormProps {
  phase?: Phase | null
  weekStartDate?: string
  weekEndDate?: string
  initialData?: Memory
  onSubmit: (data: Omit<Memory, "id" | "user_id" | "created_at" | "updated_at">) => void
  onCancel: () => void
}

export function MemoryForm({ phase, weekStartDate, weekEndDate, initialData, onSubmit, onCancel }: MemoryFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [memoryDate, setMemoryDate] = useState(initialData?.memory_date || weekStartDate || "")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!memoryDate) {
      setError("Date is required")
      return
    }

    onSubmit({
      title: title.trim(),
      content: content.trim() || null,
      memory_date: memoryDate,
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
        <Label htmlFor="memoryTitle">Title</Label>
        <Input
          id="memoryTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., First day at new job"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="memoryContent">Content</Label>
        <Textarea
          id="memoryContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write about this memory..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="memoryDate">Date</Label>
        <Input
          id="memoryDate"
          type="date"
          value={memoryDate}
          onChange={(e) => setMemoryDate(e.target.value)}
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
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {initialData ? "Save Changes" : "Add Memory"}
        </Button>
      </div>
    </form>
  )
}
