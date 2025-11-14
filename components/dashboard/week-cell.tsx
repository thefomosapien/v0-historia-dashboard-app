"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'

interface Week {
  id: string
  week_number: number
  title: string | null
  content: string | null
  location: string | null
  life_chapter: string | null
  is_milestone: boolean
  milestone_title: string | null
  is_documented: boolean
}

interface WeekCellProps {
  weekNumber: number
  week?: Week
  isLived: boolean
  userId: string
  size: "small" | "large"
}

export function WeekCell({ weekNumber, week, isLived, userId, size }: WeekCellProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleDocumentWeek = () => {
    router.push(`/week/${weekNumber}`)
  }

  const getCellColor = () => {
    if (!isLived) return "bg-white border-stone-300"
    if (week?.is_milestone) return "bg-amber-500"
    if (week?.is_documented) return "bg-lime-600"
    return "bg-stone-400"
  }

  if (week?.is_milestone && week?.milestone_title && size === "large") {
    return (
      <div
        className={cn(
          "rounded-sm transition-all cursor-pointer border border-transparent",
          "px-2 py-1 flex items-center gap-1.5 min-w-0",
          "bg-amber-500 hover:bg-amber-600"
        )}
        onClick={handleDocumentWeek}
      >
        <Star className="w-3 h-3 text-white fill-white flex-shrink-0" />
        <span className="text-xs font-medium text-white truncate flex-1">
          {week.milestone_title}
        </span>
      </div>
    )
  }

  const cellClasses = cn(
    "rounded-sm transition-all cursor-pointer border border-transparent relative",
    size === "small" ? "w-2 h-2 hover:scale-150" : "w-10 h-10 hover:scale-105",
    getCellColor(),
    !isLived && "cursor-not-allowed",
    isLived && !week?.is_milestone && !week?.is_documented && "hover:bg-stone-500",
    isLived && week?.is_documented && !week?.is_milestone && "hover:bg-lime-700",
  )

  if (!isLived) {
    return <div className={cellClasses} />
  }

  if (size === "small") {
    return (
      <div
        className={cellClasses}
        onClick={() => handleDocumentWeek()}
        title={`Week ${weekNumber}${week?.title ? `: ${week.title}` : ""}`}
      >
        {week?.is_milestone && <Star className="absolute inset-0 m-auto w-1 h-1 text-white fill-white" />}
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cellClasses}>
          {week?.is_milestone && <Star className="absolute inset-0 m-auto w-4 h-4 text-white fill-white" />}
        </div>
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
                {week.life_chapter && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Chapter:</span>
                    <span>{week.life_chapter}</span>
                  </div>
                )}
                {week.is_milestone && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="w-3 h-3 fill-amber-600" />
                    <span className="font-medium">Milestone</span>
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
