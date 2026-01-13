import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/historia-logo.svg"
              alt="Historia"
              width={400}
              height={120}
              className="h-24 w-auto"
              priority
            />
          </div>
          {/* </CHANGE> */}
          <p className="text-xl md:text-2xl text-stone-600 mb-4 text-balance">Your Life, Week by Week</p>
          <p className="text-lg text-stone-600 mb-12 max-w-2xl mx-auto text-pretty">
            Document your life's journey one week at a time. Reflect on your experiences, track your growth, and create
            a visual timeline of your story.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-800 text-white text-lg px-8">
              <Link href="/auth/signup">Start Your Journey</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-stone-300 text-slate-900 text-lg px-8 bg-transparent"
            >
              <Link href="/auth/login">Log In</Link>
            </Button>
          </div>

          <div className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-slate-900 mb-2">Weekly Reflections</h3>
              <p className="text-stone-600">Document each week of your life with thoughts, moods, and memories</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-slate-900 mb-2">Visual Timeline</h3>
              <p className="text-stone-600">See your entire life laid out in a beautiful grid visualization</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-slate-900 mb-2">Personal Archive</h3>
              <p className="text-stone-600">Build a private, searchable archive of your life's story</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
