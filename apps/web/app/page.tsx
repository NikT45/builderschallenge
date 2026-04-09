"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

const FEATURES = [
  { label: "SEC EDGAR", desc: "Live filings & XBRL data" },
  { label: "5-Agent Pipeline", desc: "Parallel research synthesis" },
  { label: "Document RAG", desc: "Semantic search over uploads" },
  { label: "Market Data", desc: "Real-time quotes & multiples" },
]

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
    if (error) setError(error.message)
    else router.push("/home")
    setLoading(false)
  }

  async function handleSignUp() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else setError("Check your email to confirm your account.")
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mode === "signin" ? handleSignIn() : handleSignUp()
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-background">


      {/* ── Left panel — Hero ───────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col justify-center overflow-hidden pl-14 pr-16 py-12">

        {/* Green dot grid — fades out toward top via mask */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.897 0.196 126.665) 1.8px, transparent 1.8px)",
            backgroundSize: "28px 28px",
            WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 60%)",
            maskImage: "linear-gradient(to top, black 0%, transparent 60%)",
            zIndex: 0,
          }}
        />

        {/* Blue gradient — top to transparent going down */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to bottom, oklch(0.52 0.105 223.128 / 0.25) 0%, transparent 55%)", zIndex: 1 }}
        />

        {/* Hero copy */}
        <div className="max-w-xl" style={{ animation: "anvil-fade 0.5s 0.08s ease both" }}>

          {/* Headline */}
          <h1
            className="text-[60px] font-thin leading-[1.05] tracking-[-0.02em] text-foreground/80"
          >
            Research-grade<br />
            AI for serious<br />
            investors.
          </h1>

          {/* Descriptor */}
          <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Five specialist agents, SEC EDGAR integration, and semantic document search — assembled into a single research environment.
          </p>

          {/* Feature grid */}
          {/* <div className="mt-10 grid grid-cols-2 gap-px border border-border bg-border">
            {FEATURES.map((f) => (
              <div key={f.label} className="bg-background px-4 py-3">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/80">
                  {f.label}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div> */}
        </div>

      </div>

      {/* ── Right panel — Auth form ─────────────────────────────────── */}
      <div
        className="relative flex w-[400px] shrink-0 flex-col justify-center border-l border-border px-10 py-12"
        style={{ background: "var(--sidebar)", animation: "anvil-slide 0.45s 0.05s ease both" }}
      >

        {/* Mode toggle tabs */}
        <div className="mb-8 flex border border-border">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null) }}
              className="flex-1 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors"
              style={{
                background: mode === m ? "var(--primary)" : "transparent",
                color: mode === m ? "var(--primary-foreground)" : "var(--muted-foreground)",
              }}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="border border-border bg-background px-3 py-2.5 font-mono text-[12px] text-foreground/80 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
              style={{ borderRadius: 0 }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border border-border bg-background px-3 py-2.5 font-mono text-[12px] text-foreground/80 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
              style={{ borderRadius: 0 }}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="font-mono text-[10px] text-destructive">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              background: "linear-gradient(to right, var(--primary), var(--chart-3))",
              borderRadius: 0,
            }}
          >
            {loading
              ? mode === "signin" ? "Signing in…" : "Creating…"
              : mode === "signin" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        {/* Bottom note */}
        <p className="mt-8 font-mono text-[10px] text-muted-foreground/40">
          Your research is private and encrypted.
        </p>
      </div>

      <style>{`
        @keyframes anvil-fade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes anvil-slide {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
