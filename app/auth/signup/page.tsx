import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">Historia</h1>
          <p className="text-stone-600">Begin documenting your life's journey</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
