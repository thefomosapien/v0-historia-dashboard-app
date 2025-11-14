import type { NextRequest, NextResponse } from "next/server"

// Authentication is handled at the page level instead
export async function middleware(request: NextRequest) {
  // Just pass through - authentication happens in individual pages
  return
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
