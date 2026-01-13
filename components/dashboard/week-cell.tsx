"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface Week {
  id: string
  week_number: number
  title: string | null
  content: string | null
  location: string | null
  chapter: string | null
  is_documented: boolean
}

interface Milestone {
  id: string
  milestone_date: string
  title: string
  description: string | null
  is_birthday: boolean
}

interface WeekCellProps {
  weekNumber: number
  week?: Week
  milestones: Milestone[]
  isLived: boolean
  userId: string
  size: "small" | "large"
}

export function WeekCell({ weekNumber, week, milestones, isLived, userId, size }: WeekCellProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleDocumentWeek = () => {
    router.push(`/week/${weekNumber}`)
  }

  const getCellColor = () => {
    if (!isLived) return "bg-white border-stone-300"
    if (week?.is_documented) return "bg-lime-600"
    return "bg-stone-400"
  }

  const formatMilestoneDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (milestones.length > 0 && size === "large") {
    return (
      <div className="flex flex-col gap-1">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={cn(
              "rounded-sm transition-all cursor-pointer border border-transparent",
              "px-2 py-1.5 flex items-center gap-1.5 min-w-0",
              "bg-amber-500 hover:bg-amber-600"
            )}
            onClick={handleDocumentWeek}
          >
            {milestone.is_birthday ? (
              <span className="text-sm flex-shrink-0">🎂</span>
            ) : (
              <svg className="w-3 h-3 text-white fill-white flex-shrink-0" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium text-white truncate">
                {milestone.title}
              </span>
              <span className="text-[10px] text-amber-100">
                {formatMilestoneDate(milestone.milestone_date)}
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const cellClasses = cn(
    "rounded-sm transition-all cursor-pointer border border-transparent relative",
    size === "small" ? "w-2 h-2 hover:scale-150" : "w-10 h-10 hover:scale-105",
    getCellColor(),
    !isLived && "cursor-not-allowed",
    isLived && !week?.is_documented && "hover:bg-stone-500",
    isLived && week?.is_documented && "hover:bg-lime-700",
  )

  if (!isLived) {
    return <div className={cellClasses} />
  }

  if (size === "small") {
    return (
      <div
        className={cellClasses}
        onClick={() => handleDocumentWeek()}
        title={`Week ${weekNumber}${week?.title ? `: ${week.title}` : ""}${milestones.length > 0 ? " (Milestone)" : ""}`}
      >
        {milestones.length > 0 && (
          <svg className="absolute inset-0 m-auto w-1 h-1 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cellClasses} />
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm text-slate-900">Week {weekNumber}</h4>
            {week?.title && <p className="text-sm font-medium text-stone-700 mt-1">{week.title}</p>}
          </div>

          {week?.is_documented ? (
            <>
              {week.content && <p className="text-sm text-stone-600 line-clamp-3">{week.content}</p>}

              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                {week.location && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Location:</span>
                    <span>{week.location}</span>
                  </div>
                )}
                {week.chapter && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Chapter:</span>
                    <span>{week.chapter}</span>
                  </div>
                )}
              </div>

              <Button size="sm" variant="outline" className="w-full bg-transparent" onClick={handleDocumentWeek}>
                View Details
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-stone-600">This week hasn't been documented yet.</p>
              <Button
                size="sm"
                className="w-full bg-lime-600 hover:bg-lime-700 text-white"
                onClick={handleDocumentWeek}
              >
                Document This Week
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
