"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@workspace/ui/components/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  async function handleSignIn() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push("/home")
    }
    setLoading(false)
  }

  async function handleSignUp() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      setError("Check your email to confirm your account.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="mb-10">
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground">
            Builders Challenge
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {mode === "signin" ? "Welcome back." : "Create account."}
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive font-mono">{error}</p>
          )}

          <div className="flex gap-2 pt-2">
            {mode === "signin" ? (
              <>
                <Button
                  className="flex-1"
                  onClick={handleSignIn}
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setMode("signup"); setError(null) }}
                  disabled={loading}
                >
                  Sign up
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="flex-1"
                  onClick={handleSignUp}
                  disabled={loading}
                >
                  {loading ? "Creating…" : "Create account"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setMode("signin"); setError(null) }}
                  disabled={loading}
                >
                  Sign in
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
