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

        {/* Top-left wordmark */}
        <p className="absolute left-14 top-10 z-10 text-[24px] font-extralight tracking-[-0.02em] text-foreground/80" style={{ animation: "anvil-fade 0.4s ease both" }}>
          Anvil Due Diligence
        </p>

        {/* Hero copy */}
        <div className="max-w-xl" style={{ animation: "anvil-fade 0.5s 0.08s ease both" }}>

          {/* Headline */}
          <h1
            className="text-[60px] font-thin leading-[1.05] tracking-[-0.02em] text-foreground/80"
          >
            Financial research,<br />
            done at machine<br />
            speed.
          </h1>

          {/* Descriptor */}
          <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Five specialist agents, SEC EDGAR integration, and semantic document search — assembled into a single research environment.
          </p>

        </div>

        {/* Pipeline animation — full width, centered */}
        <div className="mt-10 w-full select-none flex flex-col items-center" style={{ position: "relative", zIndex: 3 }}>
            <svg viewBox="0 0 578 194" width="100%" style={{ maxWidth: "780px" }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <style>{`
                  /* Base state */
                  .wf-group { stroke: oklch(0.5 0 0 / 0.48); fill: none; }
                  .wf-ring  { stroke-width: 1.25; fill: oklch(0.5 0 0 / 0); }
                  .wf-icon  { fill: none; stroke-width: 1; stroke-linecap: round; stroke-linejoin: round; }
                  .wf-path  { fill: none; stroke-width: 1; stroke-dasharray: 4 6; stroke-linecap: round; stroke: oklch(0.5 0 0 / 0.38); }
                  .wf-lbl   {
                    font-family: ui-monospace, 'Geist Mono', monospace;
                    font-size: 8px; text-transform: uppercase;
                    letter-spacing: 0.09em; text-anchor: middle;
                    fill: oklch(0.5 0 0 / 0.58);
                  }

                  /* ══ GROUP STROKE — inherited by ring + icon ══ */
                  @keyframes gs-q {
                    0%, 100% { stroke: oklch(0.52 0.105 223.128 / 0.7); }
                    7%       { stroke: oklch(0.52 0.105 223.128); }
                    15%, 85% { stroke: oklch(0.5 0 0 / 0.48); }
                  }
                  @keyframes gs-c {
                    0%, 12%, 100% { stroke: oklch(0.5 0 0 / 0.48); }
                    17%           { stroke: oklch(0.52 0.105 223.128); }
                    24%, 85%      { stroke: oklch(0.5 0 0 / 0.48); }
                  }
                  @keyframes gs-a {
                    0%, 24%, 100% { stroke: oklch(0.5 0 0 / 0.48); }
                    30%           { stroke: oklch(0.52 0.105 223.128); }
                    38%, 85%      { stroke: oklch(0.5 0 0 / 0.48); }
                  }
                  @keyframes gs-s {
                    0%, 42%, 100% { stroke: oklch(0.5 0 0 / 0.48); }
                    48%           { stroke: oklch(0.52 0.105 223.128); }
                    55%, 85%      { stroke: oklch(0.5 0 0 / 0.48); }
                  }
                  @keyframes gs-r {
                    0%, 54%, 100% { stroke: oklch(0.5 0 0 / 0.48); }
                    60%, 90%      { stroke: oklch(0.648 0.2 131.684); }
                    93%, 100%     { stroke: oklch(0.5 0 0 / 0.48); }
                  }

                  /* ══ RING FILL ══ */
                  @keyframes rf-q {
                    0%, 100% { fill: oklch(0.52 0.105 223.128 / 0.12); }
                    7%       { fill: oklch(0.52 0.105 223.128 / 0.22); }
                    15%, 85% { fill: oklch(0.5 0 0 / 0); }
                  }
                  @keyframes rf-c {
                    0%, 12%, 100% { fill: oklch(0.5 0 0 / 0); }
                    17%           { fill: oklch(0.52 0.105 223.128 / 0.18); }
                    24%, 85%      { fill: oklch(0.5 0 0 / 0); }
                  }
                  @keyframes rf-a {
                    0%, 24%, 100% { fill: oklch(0.5 0 0 / 0); }
                    30%           { fill: oklch(0.52 0.105 223.128 / 0.18); }
                    38%, 85%      { fill: oklch(0.5 0 0 / 0); }
                  }
                  @keyframes rf-s {
                    0%, 42%, 100% { fill: oklch(0.5 0 0 / 0); }
                    48%           { fill: oklch(0.52 0.105 223.128 / 0.18); }
                    55%, 85%      { fill: oklch(0.5 0 0 / 0); }
                  }
                  @keyframes rf-r {
                    0%, 54%, 100% { fill: oklch(0.5 0 0 / 0); }
                    60%, 90%      { fill: oklch(0.648 0.2 131.684 / 0.22); }
                    93%, 100%     { fill: oklch(0.5 0 0 / 0); }
                  }

                  /* ══ PATH FLOW ══ */
                  @keyframes kp-1 {
                    0%, 5%    { stroke: oklch(0.5 0 0 / 0.38); stroke-dashoffset: 60; }
                    10%       { stroke: oklch(0.52 0.105 223.128); stroke-dashoffset: 0; }
                    15%       { stroke: oklch(0.5 0 0 / 0.06); stroke-dashoffset: -60; }
                    16%, 100% { stroke: oklch(0.5 0 0 / 0.38); stroke-dashoffset: 60; }
                  }
                  @keyframes kp-2 {
                    0%, 16%   { stroke: oklch(0.5 0 0 / 0.38); stroke-dashoffset: 80; }
                    22%       { stroke: oklch(0.52 0.105 223.128); stroke-dashoffset: 10; }
                    28%       { stroke: oklch(0.5 0 0 / 0.06); stroke-dashoffset: -60; }
                    30%, 100% { stroke: oklch(0.5 0 0 / 0.38); stroke-dashoffset: 80; }
                  }
                  @keyframes kp-3 {
                    0%, 34%   { stroke: oklch(0.5 0 0 / 0.38); stroke-dashoffset: 80; }
                    40%       { stroke: oklch(0.52 0.105 223.128); stroke-dashoffset: 10; }
                    46%       { stroke: oklch(0.5 0 0 / 0.06); stroke-dashoffset: -60; }
                    48%, 100% { stroke: oklch(0.5 0 0 / 0.38); stroke-dashoffset: 80; }
                  }
                  @keyframes kp-4 {
                    0%, 50%   { stroke: oklch(0.5 0 0 / 0.38); stroke-dashoffset: 55; }
                    55%       { stroke: oklch(0.648 0.2 131.684); stroke-dashoffset: 0; }
                    60%       { stroke: oklch(0.5 0 0 / 0.06); stroke-dashoffset: -55; }
                    61%, 100% { stroke: oklch(0.5 0 0 / 0.38); stroke-dashoffset: 55; }
                  }

                  /* ══ LABELS ══ */
                  @keyframes kl-q {
                    0%, 100% { fill: oklch(0.52 0.105 223.128 / 0.7); }
                    13%, 85% { fill: oklch(0.5 0 0 / 0.58); }
                  }
                  @keyframes kl-r {
                    0%, 54%   { fill: oklch(0.5 0 0 / 0.58); }
                    60%, 90%  { fill: oklch(0.648 0.2 131.684); }
                    93%, 100% { fill: oklch(0.5 0 0 / 0.58); }
                  }

                  /* ══ APPLY ══ */
                  .gs-q { animation: gs-q 12s ease-in-out infinite; }
                  .gs-c { animation: gs-c 12s ease-in-out infinite; }
                  .gs-a { animation: gs-a 12s ease-in-out infinite; }
                  .gs-s { animation: gs-s 12s ease-in-out infinite; }
                  .gs-r { animation: gs-r 12s ease-in-out infinite; }
                  .rf-q { animation: rf-q 12s ease-in-out infinite; }
                  .rf-c { animation: rf-c 12s ease-in-out infinite; }
                  .rf-a { animation: rf-a 12s ease-in-out infinite; }
                  .rf-s { animation: rf-s 12s ease-in-out infinite; }
                  .rf-r { animation: rf-r 12s ease-in-out infinite; }
                  .ap-1 { animation: kp-1 12s linear infinite; }
                  .ap-2 { animation: kp-2 12s linear infinite; }
                  .ap-3 { animation: kp-3 12s linear infinite; }
                  .ap-4 { animation: kp-4 12s linear infinite; }
                  .al-q { animation: kl-q 12s ease-in-out infinite; }
                  .al-r { animation: kl-r 12s ease-in-out infinite; }
                `}</style>
              </defs>

              {/* ── PATHS (behind nodes) ── */}
              <path className="wf-path ap-1" d="M 64 88 L 156 88" />
              <path className="wf-path ap-2" d="M 184 88 C 232 88 268 22 303 22" />
              <path className="wf-path ap-2" d="M 184 88 C 230 88 268 66 303 66"  style={{ animationDelay: "0.14s" }} />
              <path className="wf-path ap-2" d="M 184 88 C 230 88 268 110 303 110" style={{ animationDelay: "0.28s" }} />
              <path className="wf-path ap-2" d="M 184 88 C 232 88 268 154 303 154" style={{ animationDelay: "0.42s" }} />
              <path className="wf-path ap-3" d="M 327 22 C 362 22 402 88 436 88" />
              <path className="wf-path ap-3" d="M 327 66 C 362 66 402 88 436 88"  style={{ animationDelay: "0.14s" }} />
              <path className="wf-path ap-3" d="M 327 110 C 362 110 402 88 436 88" style={{ animationDelay: "0.28s" }} />
              <path className="wf-path ap-3" d="M 327 154 C 362 154 402 88 436 88" style={{ animationDelay: "0.42s" }} />
              <path className="wf-path ap-4" d="M 464 88 L 529 88" />

              {/* ── QUERY NODE — person/user ── */}
              <g className="wf-group gs-q" transform="translate(50,88)">
                <circle className="wf-ring rf-q" r="14" />
                <g className="wf-icon">
                  <circle cx="0" cy="-4" r="3" />
                  <path d="M -5 5 A 5 4 0 0 1 5 5" />
                </g>
              </g>

              {/* ── CHAT NODE — terminal/AI ── */}
              <g className="wf-group gs-c" transform="translate(170,88)">
                <circle className="wf-ring rf-c" r="14" />
                <g className="wf-icon">
                  <path d="M -5 -4 L -2 -4 M -5 4 L -2 4 M -5 -4 L -5 4" />
                  <path d="M 5 -4 L 2 -4 M 5 4 L 2 4 M 5 -4 L 5 4" />
                  <line x1="-1.5" y1="0" x2="1.5" y2="0" />
                </g>
              </g>

              {/* ── FINANCIAL NODE — bar chart ── */}
              <g className="wf-group gs-a" transform="translate(315,22)">
                <circle className="wf-ring rf-a" r="12" />
                <g className="wf-icon" transform="scale(0.88)">
                  <line x1="-5" y1="4" x2="5" y2="4" />
                  <line x1="-3.5" y1="4" x2="-3.5" y2="-1" />
                  <line x1="0"    y1="4" x2="0"    y2="-4" />
                  <line x1="3.5"  y1="4" x2="3.5"  y2="1" />
                </g>
              </g>

              {/* ── RISK NODE — warning triangle ── */}
              <g className="wf-group gs-a" transform="translate(315,66)" style={{ animationDelay: "0.14s" }}>
                <circle className="wf-ring rf-a" r="12" style={{ animationDelay: "0.14s" }} />
                <g className="wf-icon" transform="scale(0.85)">
                  <path d="M 0 -5.5 L 5.5 4 L -5.5 4 Z" />
                  <line x1="0" y1="-2.5" x2="0" y2="1" />
                </g>
              </g>

              {/* ── COMPETITIVE NODE — crosshair ── */}
              <g className="wf-group gs-a" transform="translate(315,110)" style={{ animationDelay: "0.28s" }}>
                <circle className="wf-ring rf-a" r="12" style={{ animationDelay: "0.28s" }} />
                <g className="wf-icon">
                  <circle cx="0" cy="0" r="3.5" />
                  <line x1="0" y1="-6.5" x2="0" y2="-5" />
                  <line x1="0" y1="5"    x2="0" y2="6.5" />
                  <line x1="-6.5" y1="0" x2="-5" y2="0" />
                  <line x1="5"    y1="0" x2="6.5" y2="0" />
                </g>
              </g>

              {/* ── MANAGEMENT NODE — org chart ── */}
              <g className="wf-group gs-a" transform="translate(315,154)" style={{ animationDelay: "0.42s" }}>
                <circle className="wf-ring rf-a" r="12" style={{ animationDelay: "0.42s" }} />
                <g className="wf-icon" transform="scale(0.8)">
                  <rect x="-2" y="-7" width="4" height="3" />
                  <line x1="0"    y1="-4" x2="0"    y2="-1.5" />
                  <line x1="-4.5" y1="-1.5" x2="4.5" y2="-1.5" />
                  <line x1="-4.5" y1="-1.5" x2="-4.5" y2="1" />
                  <line x1="0"    y1="-1.5" x2="0"    y2="1" />
                  <line x1="4.5"  y1="-1.5" x2="4.5"  y2="1" />
                  <rect x="-6" y="1" width="3" height="2.5" />
                  <rect x="-1.5" y="1" width="3" height="2.5" />
                  <rect x="3" y="1" width="3" height="2.5" />
                </g>
              </g>

              {/* ── SYNTHESIS NODE — merge/funnel ── */}
              <g className="wf-group gs-s" transform="translate(450,88)">
                <circle className="wf-ring rf-s" r="14" />
                <g className="wf-icon">
                  <path d="M -6.5 -4 C -2 -4 -0.5 0 0 0" />
                  <path d="M -6.5 4 C -2 4 -0.5 0 0 0" />
                  <line x1="0" y1="0" x2="6.5" y2="0" />
                  <path d="M 4 -2.5 L 6.5 0 L 4 2.5" />
                </g>
              </g>

              {/* ── REPORT NODE — diamond + document lines ── */}
              <g className="wf-group gs-r" transform="translate(545,88)">
                <polygon className="wf-ring rf-r" points="0,-17 17,0 0,17 -17,0" />
                <g className="wf-icon">
                  <path d="M -5 -6 L 3.5 -6 L 6 -3.5 L 6 6 L -5 6 Z" />
                  <line x1="3.5" y1="-6"  x2="3.5" y2="-3.5" />
                  <line x1="3.5" y1="-3.5" x2="6"   y2="-3.5" />
                  <line x1="-3"  y1="-1"  x2="4"    y2="-1" />
                  <line x1="-3"  y1="1.5" x2="4"    y2="1.5" />
                  <line x1="-3"  y1="4"   x2="1.5"  y2="4" />
                </g>
              </g>

              {/* ── LABELS ── */}
              <text className="wf-lbl al-q" x="50"  y="116">Query</text>
              <text className="wf-lbl"      x="170" y="116">Chat</text>
              <text className="wf-lbl"      x="315" y="48" >Financial</text>
              <text className="wf-lbl"      x="315" y="92" >Risk</text>
              <text className="wf-lbl"      x="315" y="136">Competitive</text>
              <text className="wf-lbl"      x="315" y="180">Management</text>
              <text className="wf-lbl"      x="450" y="116">Synthesis</text>
              <text className="wf-lbl al-r" x="545" y="118">Report</text>
            </svg>
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
            className="mt-1 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.15em] transition-colors hover:bg-primary/5 disabled:opacity-50"
            style={{
              border: "1px solid var(--primary)",
              background: "white",
              color: "var(--primary)",
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
