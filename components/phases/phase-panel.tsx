"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PhaseForm } from "./phase-form"
import { PhaseList } from "./phase-list"
import type { Phase } from "@/lib/types"

interface PhasePanelProps {
  phases: Phase[]
  onAddPhase: (phase: Omit<Phase, "id" | "user_id" | "created_at" | "updated_at">) => void
  onEditPhase: (id: string, phase: Partial<Phase>) => void
  onDeletePhase: (id: string) => void
  onPhaseClick?: (phase: Phase) => void
}

export function PhasePanel({ phases, onAddPhase, onEditPhase, onDeletePhase, onPhaseClick }: PhasePanelProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null)

  const handleAddPhase = (data: Omit<Phase, "id" | "user_id" | "created_at" | "updated_at">) => {
    onAddPhase(data)
    setIsAddDialogOpen(false)
  }

  const handleEditPhase = (data: Omit<Phase, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (editingPhase) {
      onEditPhase(editingPhase.id, data)
      setEditingPhase(null)
    }
  }

  return (
    <Card className="border-stone-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-serif text-xl">Life Phases</CardTitle>
            <CardDescription>Define the chapters of your life</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-stone-800 hover:bg-stone-900">
                Add Phase
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Phase</DialogTitle>
                <DialogDescription>
                  Define a chapter of your life with a title, date range, and color.
                </DialogDescription>
              </DialogHeader>
              <PhaseForm existingPhases={phases} onSubmit={handleAddPhase} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <PhaseList phases={phases} onEdit={setEditingPhase} onDelete={onDeletePhase} onClick={onPhaseClick} />

        {/* Edit Dialog */}
        <Dialog open={!!editingPhase} onOpenChange={(open) => !open && setEditingPhase(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Phase</DialogTitle>
              <DialogDescription>Update the details of this life phase.</DialogDescription>
            </DialogHeader>
            {editingPhase && (
              <PhaseForm
                existingPhases={phases.filter((p) => p.id !== editingPhase.id)}
                initialData={editingPhase}
                onSubmit={handleEditPhase}
                onCancel={() => setEditingPhase(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
