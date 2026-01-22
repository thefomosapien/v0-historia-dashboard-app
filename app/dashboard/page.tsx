import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import {
  DEV_MODE,
  MOCK_PROFILE,
  MOCK_USER,
  generateMockPhases,
  generateMockMemories,
  generateMockMilestones,
} from "@/lib/dev-mode"
import { DevBanner } from "@/components/dev-banner"
import type { Phase, Memory, Milestone } from "@/lib/types"

export default async function DashboardPage() {
  let user = MOCK_USER
  let profile = MOCK_PROFILE
  let phases: Phase[] = []
  let memories: Memory[] = []
  let milestones: Milestone[] = []

  if (DEV_MODE) {
    phases = generateMockPhases(MOCK_USER.id, MOCK_PROFILE.date_of_birth)
    memories = generateMockMemories(MOCK_USER.id, MOCK_PROFILE.date_of_birth)
    milestones = generateMockMilestones(MOCK_USER.id, MOCK_PROFILE.date_of_birth)
  } else {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      redirect("/auth/login")
    }

    user = authUser

    // Get user profile
    const { data: profiles } = await supabase.from("profiles").select("*").eq("id", user.id)

    profile = profiles?.[0]

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
        redirect("/auth/login")
      }

      profile = newProfile
    }

    if (!profile) {
      redirect("/auth/login")
    }

    // Generate birthday milestones
    const birthDate = new Date(profile.date_of_birth)
    const birthMonth = birthDate.getMonth()
    const birthDay = birthDate.getDate()
    const birthYear = birthDate.getFullYear()

    const birthdayMilestones = []
    for (let age = 1; age <= 100; age++) {
      const birthdayYear = birthYear + age
      const birthdayDate = new Date(birthdayYear, birthMonth, birthDay)
      birthdayMilestones.push({
        user_id: user.id,
        milestone_date: birthdayDate.toISOString().split("T")[0],
        title: `${age} in ${birthdayYear}`,
        is_birthday: true,
      })
    }

    // Check existing birthdays
    const { data: existingBirthdays } = await supabase
      .from("milestones")
      .select("milestone_date")
      .eq("user_id", user.id)
      .eq("is_birthday", true)

    const existingDates = new Set(existingBirthdays?.map((m) => m.milestone_date) || [])
    const milestonesToInsert = birthdayMilestones.filter((m) => !existingDates.has(m.milestone_date))

    if (milestonesToInsert.length > 0) {
      await supabase.from("milestones").insert(milestonesToInsert)
    }

    // Fetch all data
    const [phasesResult, memoriesResult, milestonesResult] = await Promise.all([
      supabase.from("phases").select("*").eq("user_id", user.id).order("start_date", { ascending: true }),
      supabase.from("memories").select("*").eq("user_id", user.id).order("memory_date", { ascending: true }),
      supabase.from("milestones").select("*").eq("user_id", user.id).order("milestone_date", { ascending: true }),
    ])

    phases = phasesResult.data || []
    memories = memoriesResult.data || []
    milestones = milestonesResult.data || []
  }

  // Calculate weeks lived
  const birthDate = new Date(profile.date_of_birth)
  const today = new Date()
  const weeksLived = Math.floor((today.getTime() - birthDate.getTime()) / (7 * 24 * 60 * 60 * 1000))

  return (
    <div className="min-h-screen bg-stone-50">
      <DevBanner />
      <DashboardHeader profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <DashboardClient
          userId={user.id}
          birthDate={profile.date_of_birth}
          weeksLived={weeksLived}
          initialPhases={phases}
          initialMemories={memories}
          initialMilestones={milestones}
        />
      </main>
    </div>
  )
}
