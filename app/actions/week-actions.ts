"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface SaveWeekData {
  weekNumber: number
  weekStartDate: string
  weekEndDate: string
  userId: string
  title: string | null
  content: string | null
  location: string | null
  chapter: string | null
  isMilestone: boolean
}

export async function saveWeek(data: SaveWeekData) {
  const supabase = await createClient()

  // Check if week already exists
  const { data: existingWeek } = await supabase
    .from("weeks")
    .select("id")
    .eq("user_id", data.userId)
    .eq("week_number", data.weekNumber)
    .single()

  const weekData = {
    user_id: data.userId,
    week_number: data.weekNumber,
    start_date: data.weekStartDate,
    end_date: data.weekEndDate,
    title: data.title,
    content: data.content,
    location: data.location,
    chapter: data.chapter,
    is_milestone: data.isMilestone,
    is_documented: true,
  }

  if (existingWeek) {
    // Update existing week
    const { error } = await supabase.from("weeks").update(weekData).eq("id", existingWeek.id)

    if (error) throw error
  } else {
    // Insert new week
    const { error } = await supabase.from("weeks").insert(weekData)

    if (error) throw error
  }

  revalidatePath("/dashboard")
  revalidatePath(`/week/${data.weekNumber}`)
}

export async function deleteWeek(weekId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("weeks").delete().eq("id", weekId)

  if (error) throw error

  revalidatePath("/dashboard")
}
