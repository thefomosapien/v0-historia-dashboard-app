import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
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
  const { data: profiles } = await supabase.from("profiles").select("*").eq("id", user.id)

  let profile = profiles?.[0]

  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || "User",
        date_of_birth: user.user_metadata?.date_of_birth || new Date().toISOString().split("T")[0],
      })
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Failed to create profile:", insertError)
      redirect("/auth/login")
    }

    profile = newProfile
  }

  if (!profile) {
    redirect("/auth/login")
  }

  // Calculate weeks lived
  const birthDate = new Date(profile.date_of_birth)
  const today = new Date()
  const weeksLived = Math.floor((today.getTime() - birthDate.getTime()) / (7 * 24 * 60 * 60 * 1000))

  const birthMonth = birthDate.getMonth()
  const birthDay = birthDate.getDate()
  const birthYear = birthDate.getFullYear()

  const birthdayMilestones = []
  
  for (let age = 1; age <= 100; age++) {
    const birthdayYear = birthYear + age
    const birthdayDate = new Date(birthdayYear, birthMonth, birthDay)
    
    birthdayMilestones.push({
      user_id: user.id,
      milestone_date: birthdayDate.toISOString().split('T')[0],
      title: `${age} in ${birthdayYear}`,
      is_birthday: true,
    })
  }

  // Check which birthday milestones already exist
  const { data: existingBirthdays } = await supabase
    .from("milestones")
    .select("milestone_date")
    .eq("user_id", user.id)
    .eq("is_birthday", true)

  const existingDates = new Set(existingBirthdays?.map(m => m.milestone_date) || [])

  // Insert birthday milestones that don't exist yet
  const milestonesToInsert = birthdayMilestones.filter(
    m => !existingDates.has(m.milestone_date)
  )

  if (milestonesToInsert.length > 0) {
    await supabase.from("milestones").insert(milestonesToInsert)
  }

  // Fetch all milestones
  const { data: milestones } = await supabase
    .from("milestones")
    .select("*")
    .eq("user_id", user.id)
    .order("milestone_date", { ascending: true })

  // Fetch documented weeks
  const { data: weeks } = await supabase
    .from("weeks")
    .select("*")
    .eq("user_id", user.id)

  const { count: documentedCount } = await supabase
    .from("weeks")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .eq("is_documented", true)

  const milestoneCount = milestones?.length || 0

  return (
    <div className="min-h-screen bg-stone-50">
      <DashboardHeader profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <WeekStats
          weeksLived={weeksLived}
          weeksDocumented={documentedCount || 0}
          milestoneCount={milestoneCount}
          birthDate={profile.date_of_birth}
        />

        <WeekGrid 
          weeksLived={weeksLived} 
          documentedWeeks={weeks || []} 
          milestones={milestones || []}
          birthDate={profile.date_of_birth}
          userId={user.id} 
        />
      </main>
    </div>
  )
}
