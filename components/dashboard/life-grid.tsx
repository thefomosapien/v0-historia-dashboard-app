"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WeekBlock } from "./week-block"
import { computeWeekData } from "@/lib/week-utils"
import { WEEK_COLORS } from "@/lib/types"
import type { Phase, Memory, Milestone } from "@/lib/types"

interface LifeGridProps {
  weeksLived: number
  birthDate: string
  userId: string
  phases: Phase[]
  memories: Memory[]
  milestones: Milestone[]
  onWeekClick: (weekNumber: number) => void
}

const TOTAL_YEARS = 100
const WEEKS_PER_YEAR = 52
const TOTAL_WEEKS = TOTAL_YEARS * WEEKS_PER_YEAR

export function LifeGrid({ weeksLived, birthDate, userId, phases, memories, milestones, onWeekClick }: LifeGridProps) {
  const [viewMode, setViewMode] = useState<"year" | "life">("year")
  const [selectedYear, setSelectedYear] = useState(0)

  const birth = useMemo(() => new Date(birthDate), [birthDate])
  const yearsLived = Math.ceil(weeksLived / WEEKS_PER_YEAR)
  const years = Array.from({ length: Math.max(yearsLived, 1) }, (_, i) => i)

  // Compute week data for display
  const getWeeksForView = useMemo(() => {
    if (viewMode === "year") {
      const startWeek = selectedYear * WEEKS_PER_YEAR + 1
      const endWeek = startWeek + WEEKS_PER_YEAR
      return Array.from({ length: WEEKS_PER_YEAR }, (_, i) => {
        const weekNum = startWeek + i
        return computeWeekData(birth, weekNum, weeksLived, phases, memories, milestones)
      })
    } else {
      // Life view - all 5200 weeks
      return Array.from({ length: TOTAL_WEEKS }, (_, i) => {
        const weekNum = i + 1
        return computeWeekData(birth, weekNum, weeksLived, phases, memories, milestones)
      })
    }
  }, [viewMode, selectedYear, birth, weeksLived, phases, memories, milestones])

  return (
    <Card className="border-stone-200">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="font-serif text-2xl">Your Life in Weeks</CardTitle>
            <CardDescription>Each square represents one week of your life</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value: "year" | "life") => setViewMode(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Year View</SelectItem>
                <SelectItem value="life">Life View</SelectItem>
              </SelectContent>
            </Select>

            {viewMode === "year" && (
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      Year {year + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {viewMode === "year" ? (
          <>
            <div className="mb-4 text-sm text-stone-600">
              Viewing Year {selectedYear + 1} (weeks {selectedYear * 52 + 1} - {(selectedYear + 1) * 52})
            </div>
            {/* Year view: 52 columns */}
            <div
              className="inline-grid gap-px bg-stone-100 p-1 rounded"
              style={{
                gridTemplateColumns: "repeat(52, 12px)",
                gridTemplateRows: "repeat(1, 12px)",
              }}
            >
              {getWeeksForView.map((weekData) => (
                <WeekBlock
                  key={weekData.weekNumber}
                  weekData={weekData}
                  onClick={() => onWeekClick(weekData.weekNumber)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 text-sm text-stone-600">Life View: 100 years x 52 weeks = 5,200 weeks</div>
            {/* Life view: 52 columns x 100 rows */}
            <div
              className="inline-grid gap-px bg-stone-100 p-1 rounded overflow-x-auto"
              style={{
                gridTemplateColumns: "repeat(52, 12px)",
              }}
            >
              {getWeeksForView.map((weekData) => (
                <WeekBlock
                  key={weekData.weekNumber}
                  weekData={weekData}
                  onClick={() => onWeekClick(weekData.weekNumber)}
                />
              ))}
            </div>
          </>
        )}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm border border-stone-300"
              style={{ backgroundColor: WEEK_COLORS.future }}
            />
            <span className="text-stone-600">Not yet lived</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: WEEK_COLORS.undefined }} />
            <span className="text-stone-600">Lived (no phase)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-blue-500" />
            <span className="text-stone-600">Has memory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: WEEK_COLORS.milestone }} />
            <span className="text-stone-600">Has milestone</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
