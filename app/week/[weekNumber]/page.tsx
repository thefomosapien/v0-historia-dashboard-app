import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { WeekDocumentForm } from "@/components/week/week-document-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PageProps {
  params: Promise<{ weekNumber: string }>
}

export default async function WeekPage({ params }: PageProps) {
  const { weekNumber } = await params
  const weekNum = Number.parseInt(weekNumber)

  if (isNaN(weekNum) || weekNum < 1) {
    notFound()
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile to calculate dates
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Calculate week start and end dates
  const birthDate = new Date(profile.date_of_birth)
  const weekStartDate = new Date(birthDate)
  weekStartDate.setDate(weekStartDate.getDate() + (weekNum - 1) * 7)

  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekEndDate.getDate() + 6)

  // Check if this week has already passed
  const today = new Date()
  const hasOccurred = weekStartDate <= today

  // Get existing week data
  const { data: weekData } = await supabase.from("weeks").select("*").eq("user_id", user.id).eq("week_number", weekNum)

  const existingWeek = weekData?.[0] || null

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-2">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="font-serif text-3xl font-bold text-slate-900">Week {weekNum}</h1>
          <p className="text-stone-600 mt-1">
            {weekStartDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            {" - "}
            {weekEndDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!hasOccurred ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
              <h2 className="font-serif text-xl font-semibold text-amber-900 mb-2">This Week Hasn't Happened Yet</h2>
              <p className="text-amber-800">
                This week starts on {weekStartDate.toLocaleDateString()}. Come back then to document it!
              </p>
            </div>
          </div>
        ) : (
          <WeekDocumentForm
            weekNumber={weekNum}
            weekStartDate={weekStartDate.toISOString().split("T")[0]}
            weekEndDate={weekEndDate.toISOString().split("T")[0]}
            userId={user.id}
            existingWeek={existingWeek}
          />
        )}
      </main>
    </div>
  )
}
