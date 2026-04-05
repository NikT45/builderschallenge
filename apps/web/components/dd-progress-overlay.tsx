"use client"

import { cn } from "@workspace/ui/lib/utils"
import { useDDProgress } from "@/hooks/useDDProgress"
import type { AgentName } from "@/lib/types"

const AGENT_LABELS: Record<AgentName, string> = {
  financial: "Financial",
  risk: "Risk",
  competitive: "Competitive",
  management: "Management",
}

const AGENT_ORDER: AgentName[] = ["financial", "risk", "competitive", "management"]

const DEFAULT_SUBTEXT: Record<AgentName, string> = {
  financial: "Analyzing financials…",
  risk: "Assessing risk factors…",
  competitive: "Mapping competitive landscape…",
  management: "Reviewing governance…",
}

interface DDProgressOverlayProps {
  jobId: string
  company: string
  onComplete: (report: { reportId: string; company: string; markdown: string; createdAt: number }) => void
}

export function DDProgressOverlay({ jobId, company, onComplete }: DDProgressOverlayProps) {
  const { isRunning, overallPct, agents, synthesisStarted, report } = useDDProgress(jobId)

  if (report && !isRunning) {
    onComplete(report)
  }

  const activeAgent = AGENT_ORDER.find((a) => agents[a].status === "running")

  const statusLabel = report
    ? "Report ready"
    : synthesisStarted
    ? "Synthesizing…"
    : activeAgent
    ? `${AGENT_LABELS[activeAgent]} · Running`
    : "Starting…"

  return (
    <div className="w-full rounded-[7px] border border-border bg-card px-4 py-3 shadow-sm">
      {/* Title row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          {/* Spinner or check */}
          {report ? (
            <span className="shrink-0 text-[11px] text-primary">✓</span>
          ) : (
            <span className="shrink-0 size-1.5 animate-pulse rounded-full bg-primary" />
          )}
          <span className="truncate text-[12px] font-medium text-foreground">{statusLabel}</span>
          <span className="shrink-0 text-[11px] text-muted-foreground/60">·</span>
          <span className="truncate font-mono text-[11px] text-muted-foreground">{company}</span>
        </div>
        <span className="shrink-0 font-mono text-[11px] font-medium text-primary">{overallPct}%</span>
      </div>

      {/* Overall bar */}
      <div className="my-2.5 h-px w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${overallPct}%` }}
        />
      </div>

      {/* Agent rows — single line each */}
      <div className="space-y-1">
        {AGENT_ORDER.map((agent) => {
          const a = agents[agent]
          const subtext = a.preview ?? (a.status === "running" ? DEFAULT_SUBTEXT[agent] : null)

          return (
            <div key={agent} className="flex items-center gap-2 py-0.5">
              <AgentIcon status={a.status} />
              <span
                className={cn(
                  "shrink-0 text-[11px] font-medium",
                  a.status === "done" ? "text-foreground" :
                  a.status === "running" ? "text-foreground" :
                  "text-muted-foreground/50"
                )}
              >
                {AGENT_LABELS[agent]}
              </span>
              {subtext && a.status !== "done" && (
                <>
                  <span className="text-[10px] text-muted-foreground/40">·</span>
                  <span className="min-w-0 truncate font-mono text-[10px] text-muted-foreground/70">
                    {subtext}
                  </span>
                </>
              )}
              {a.status === "done" && (
                <>
                  <span className="text-[10px] text-muted-foreground/40">·</span>
                  <span className="font-mono text-[10px] text-muted-foreground/50">done</span>
                </>
              )}
            </div>
          )
        })}

        {synthesisStarted && (
          <div className="flex items-center gap-2 py-0.5">
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                report ? "bg-primary" : "animate-pulse bg-primary/60"
              )}
            />
            <span className="text-[11px] font-medium text-foreground">Synthesis</span>
            <span className="text-[10px] text-muted-foreground/40">·</span>
            <span className="font-mono text-[10px] text-muted-foreground/70">
              {report ? "complete" : "building final report…"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function AgentIcon({ status }: { status: string }) {
  if (status === "done") {
    return <span className="shrink-0 text-[10px] text-primary">✓</span>
  }
  if (status === "error") {
    return <span className="shrink-0 text-[10px] text-destructive">✕</span>
  }
  if (status === "running") {
    return <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-primary/70" />
  }
  return <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/20" />
}
