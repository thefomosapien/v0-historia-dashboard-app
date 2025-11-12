import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { WeekStats } from "@/components/dashboard/week-stats"
import { WeekGrid } from "@/components/dashboard/week-grid"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Calculate weeks lived
  const birthDate = new Date(profile.date_of_birth)
  const today = new Date()
  const weeksLived = Math.floor((today.getTime() - birthDate.getTime()) / (7 * 24 * 60 * 60 * 1000))

  // Get documented weeks
  const { data: weeks, count: documentedCount } = await supabase
    .from("weeks")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .eq("is_documented", true)

  const { count: milestoneCount } = await supabase
    .from("weeks")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .eq("is_milestone", true)

  return (
    <div className="min-h-screen bg-stone-50">
      <DashboardHeader profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <WeekStats
          weeksLived={weeksLived}
          weeksDocumented={documentedCount || 0}
          milestoneCount={milestoneCount || 0}
          birthDate={profile.date_of_birth}
        />

        <WeekGrid weeksLived={weeksLived} documentedWeeks={weeks || []} userId={user.id} />
      </main>
    </div>
  )
}
