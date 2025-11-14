"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { saveWeek, deleteWeek } from "@/app/actions/week-actions"
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface WeekDocumentFormProps {
  weekNumber: number
  weekStartDate: string
  weekEndDate: string
  userId: string
  existingWeek?: {
    id: string
    title: string | null
    content: string | null
    location: string | null
    chapter: string | null
    is_milestone: boolean | null
    milestone_title: string | null
  } | null
}

const lifeChapters = [
  { value: "childhood", label: "Childhood" },
  { value: "student-years", label: "Student Years" },
  { value: "early-career", label: "Early Career" },
  { value: "established-career", label: "Established Career" },
  { value: "family-life", label: "Family Life" },
  { value: "retirement", label: "Retirement" },
  { value: "other", label: "Other" },
]

export function WeekDocumentForm({
  weekNumber,
  weekStartDate,
  weekEndDate,
  userId,
  existingWeek,
}: WeekDocumentFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(existingWeek?.title || "")
  const [content, setContent] = useState(existingWeek?.content || "")
  const [location, setLocation] = useState(existingWeek?.location || "")
  const [chapter, setChapter] = useState(existingWeek?.chapter || "")
  const [isMilestone, setIsMilestone] = useState(existingWeek?.is_milestone || false)
  const [milestoneTitle, setMilestoneTitle] = useState(existingWeek?.milestone_title || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await saveWeek({
        weekNumber,
        weekStartDate,
        weekEndDate,
        userId,
        title: title || null,
        content: content || null,
        location: location || null,
        chapter: chapter || null,
        isMilestone,
        milestoneTitle: isMilestone ? (milestoneTitle || title || null) : null,
      })

      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to save week")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!existingWeek) return

    setLoading(true)
    setError(null)

    try {
      await deleteWeek(existingWeek.id)
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to delete week")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">
            {existingWeek ? "Edit" : "Document"} Week {weekNumber}
          </CardTitle>
          <CardDescription>Reflect on your experiences and capture the essence of this week</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Week Title (Optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Started new job, Family vacation, Quiet week at home"
                className="border-stone-300"
              />
              <p className="text-sm text-stone-500">Give this week a memorable title</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Your Reflections</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What happened this week? What did you learn? How did you grow?"
                className="border-stone-300 min-h-[200px]"
              />
              <p className="text-sm text-stone-500">Capture the key moments, thoughts, and feelings</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where were you this week? (e.g., Boston, MA)"
                className="border-stone-300"
              />
              <p className="text-sm text-stone-500">Add location context to your week</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter">Life Chapter (Optional)</Label>
              <Select value={chapter} onValueChange={setChapter}>
                <SelectTrigger id="chapter" className="border-stone-300">
                  <SelectValue placeholder="Select a life phase" />
                </SelectTrigger>
                <SelectContent>
                  {lifeChapters.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-stone-500">What phase of life was this?</p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="milestone"
                checked={isMilestone}
                onCheckedChange={(checked) => setIsMilestone(checked as boolean)}
              />
              <div className="space-y-0">
                <Label htmlFor="milestone" className="cursor-pointer">
                  Mark as Milestone
                </Label>
                <p className="text-sm text-stone-500">Major life events like graduations, weddings, career changes</p>
              </div>
            </div>

            {isMilestone && (
              <div className="space-y-2 pl-6 border-l-2 border-amber-500">
                <Label htmlFor="milestoneTitle">Milestone Title (appears in grid)</Label>
                <Input
                  id="milestoneTitle"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  placeholder="e.g., Graduated College, Got Married, Started Company"
                  className="border-stone-300"
                />
                <p className="text-sm text-stone-500">
                  Short title displayed inline in the week grid (uses week title if empty)
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <div>
                {existingWeek && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive" className="gap-2" disabled={loading}>
                        <Trash2 className="w-4 h-4" />
                        Delete Week
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your documentation for week {weekNumber}. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-lime-600 hover:bg-lime-700 text-white">
                  {loading ? "Saving..." : existingWeek ? "Update Week" : "Save Week"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 bg-stone-100 border border-stone-200 rounded-lg p-4">
        <h3 className="font-medium text-slate-900 mb-2">Reflection Prompts</h3>
        <ul className="space-y-1 text-sm text-stone-600">
          <li>• What were the highlights of this week?</li>
          <li>• What challenges did you face and how did you handle them?</li>
          <li>• What did you learn about yourself?</li>
          <li>• Who did you spend time with?</li>
          <li>• What are you grateful for this week?</li>
        </ul>
      </div>
    </div>
  )
}
