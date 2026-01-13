"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from 'next/navigation'
import Image from "next/image"

interface DashboardHeaderProps {
  profile: {
    full_name: string | null
    email: string
  }
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/historia-logo.svg"
            alt="Historia"
            width={160}
            height={40}
            className="h-10 w-auto"
            priority
          />
          {/* </CHANGE> */}
          <p className="text-sm text-stone-600">Welcome back, {profile.full_name || profile.email}</p>
        </div>

        <Button variant="outline" onClick={handleSignOut} className="border-stone-300 bg-transparent">
          Sign Out
        </Button>
      </div>
    </header>
  )
}
