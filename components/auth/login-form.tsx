"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error("Supabase configuration missing. Please check your environment variables.")
      }

      const supabase = createClient()

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      router.push("/dashboard")
    } catch (err: any) {
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        setError("Unable to connect to authentication service. Please check your internet connection and try again.")
      } else {
        setError(err.message || "Invalid email or password")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-stone-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Log In</CardTitle>
        <CardDescription>Continue your journey</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="border-stone-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="border-stone-300"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
            {loading ? "Logging in..." : "Log In"}
          </Button>

          <p className="text-center text-sm text-stone-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-lime-600 hover:text-lime-700 font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
