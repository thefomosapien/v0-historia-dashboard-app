import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">Historia</h1>
          <p className="text-stone-600">Welcome back to your story</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-stone-600 mt-6">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-lime-600 hover:text-lime-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
