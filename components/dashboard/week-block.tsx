"use client"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { WEEK_COLORS } from "@/lib/types"
import type { WeekData } from "@/lib/types"

interface WeekBlockProps {
  weekData: WeekData
  onClick: () => void
}

export function WeekBlock({ weekData, onClick }: WeekBlockProps) {
  const { weekNumber, isLived, phase, memories, milestones } = weekData

  // Determine block color based on priority:
  // 1. Milestone (gold) - highest
  // 2. Memory (blue)
  // 3. Phase color
  // 4. Undefined gray (lived but no phase)
  // 5. White (future)
  const getBlockColor = () => {
    if (!isLived) return WEEK_COLORS.future
    if (milestones.length > 0) return WEEK_COLORS.milestone
    if (memories.length > 0) return WEEK_COLORS.memory
    if (phase) return phase.color
    return WEEK_COLORS.undefined
  }

  const blockColor = getBlockColor()
  const hasBorder = !isLived

  // Build tooltip content
  const getTooltipContent = () => {
    const lines: string[] = [`Week ${weekNumber}`]

    if (phase) {
      lines.push(`Phase: ${phase.title}`)
    }

    if (memories.length > 0) {
      lines.push(`${memories.length} ${memories.length === 1 ? "memory" : "memories"}`)
    }

    if (milestones.length > 0) {
      lines.push(`${milestones.length} ${milestones.length === 1 ? "milestone" : "milestones"}`)
    }

    return lines
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-3 h-3 rounded-sm transition-all",
              isLived && "cursor-pointer hover:scale-150 hover:z-10",
              !isLived && "cursor-default",
              hasBorder && "border border-stone-300",
            )}
            style={{ backgroundColor: blockColor }}
            onClick={isLived ? onClick : undefined}
            disabled={!isLived}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <div className="space-y-0.5">
            {getTooltipContent().map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
