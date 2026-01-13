"use client"

import { DEV_MODE } from "@/lib/dev-mode"

export function DevBanner() {
  if (!DEV_MODE) return null

  return (
    <div className="bg-amber-500 text-amber-950 text-center py-2 px-4 text-sm font-medium">
      DEV MODE - Authentication bypassed, using mock data
    </div>
  )
}
