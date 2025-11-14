"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WeekCell } from "./week-cell"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Week {
  id: string
  week_number: number
  title: string | null
  content: string | null
  mood: string | null
  energy_level: number | null
  is_documented: boolean
  is_milestone: boolean
}

interface WeekGridProps {
  weeksLived: number
  documentedWeeks: Week[]
  userId: string
}

export function WeekGrid({ weeksLived, documentedWeeks, userId }: WeekGridProps) {
  const [viewMode, setViewMode] = useState<"year" | "all">("year")
  const [selectedYear, setSelectedYear] = useState(0)

  // Create a map for quick lookup
  const weekMap = new Map(documentedWeeks.map((week) => [week.week_number, week]))

  // Calculate years lived
  const yearsLived = Math.ceil(weeksLived / 52)
  const weeksPerYear = 52

  // Generate years array for selector
  const years = Array.from({ length: yearsLived }, (_, i) => i)

  // Get weeks to display based on view mode
  const getWeeksToDisplay = () => {
    if (viewMode === "year") {
      const startWeek = selectedYear * weeksPerYear
      const endWeek = Math.min(startWeek + weeksPerYear, weeksLived)
      return Array.from({ length: endWeek - startWeek }, (_, i) => startWeek + i + 1)
    } else {
      // Show all weeks in a compact grid (80 years)
      return Array.from({ length: 80 * 52 }, (_, i) => i + 1)
    }
  }

  const weeksToDisplay = getWeeksToDisplay()

  return (
    <Card className="border-stone-200">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="font-serif text-2xl">Your Life in Weeks</CardTitle>
            <CardDescription>Each square represents one week of your life</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value: "year" | "all") => setViewMode(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Year View</SelectItem>
                <SelectItem value="all">Life View</SelectItem>
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
              Viewing weeks {selectedYear * 52 + 1} - {Math.min((selectedYear + 1) * 52, weeksLived)} of your life
            </div>
            <div className="flex flex-wrap gap-1">
              {weeksToDisplay.map((weekNumber) => {
                const week = weekMap.get(weekNumber)
                const isLived = weekNumber <= weeksLived

                return (
                  <WeekCell
                    key={weekNumber}
                    weekNumber={weekNumber}
                    week={week}
                    isLived={isLived}
                    userId={userId}
                    size="large"
                  />
                )
              })}
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 text-sm text-stone-600">
              Viewing your entire life timeline (80 years = 4,160 weeks)
            </div>
            <div className="grid grid-cols-52 gap-0.5">
              {weeksToDisplay.map((weekNumber) => {
                const week = weekMap.get(weekNumber)
                const isLived = weekNumber <= weeksLived

                return (
                  <WeekCell
                    key={weekNumber}
                    weekNumber={weekNumber}
                    week={week}
                    isLived={isLived}
                    userId={userId}
                    size="small"
                  />
                )
              })}
            </div>
          </>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-stone-300 bg-white rounded-sm"></div>
            <span className="text-stone-600">Not yet lived</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-stone-500 rounded-sm"></div>
            <span className="text-stone-600">Lived, not documented</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-lime-600 rounded-sm"></div>
            <span className="text-stone-600">Documented</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-4 h-4 bg-amber-500 rounded-sm flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="text-stone-600">Milestone</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
