"use client"

import { cn } from "@workspace/ui/lib/utils"
import { useDDProgress } from "@/hooks/useDDProgress"
import type { AgentName } from "@/lib/types"

const AGENT_LABELS: Record<AgentName, string> = {
  financial: "Financial Analysis",
  risk: "Risk Assessment",
  competitive: "Competitive Landscape",
  management: "Management & Governance",
}

const AGENT_ORDER: AgentName[] = ["financial", "risk", "competitive", "management"]

interface DDProgressOverlayProps {
  jobId: string
  company: string
  onComplete: (report: { reportId: string; company: string; markdown: string; createdAt: number }) => void
}

export function DDProgressOverlay({ jobId, company, onComplete }: DDProgressOverlayProps) {
  const { isRunning, overallPct, agents, synthesisStarted, report } = useDDProgress(jobId)

  // Fire callback when report arrives
  if (report && !isRunning) {
    onComplete(report)
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-[8px] border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-foreground">
            {report ? "Report complete" : synthesisStarted ? "Synthesizing report…" : "Running due diligence…"}
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">{company}</p>
        </div>
        <span className="font-mono text-[12px] font-medium text-primary">{overallPct}%</span>
      </div>

      {/* Overall progress bar */}
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${overallPct}%` }}
        />
      </div>

      {/* Agent rows */}
      <div className="space-y-3">
        {AGENT_ORDER.map((agent) => {
          const a = agents[agent]
          return (
            <div key={agent}>
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusDot status={a.status} />
                  <span className="text-[12px] text-foreground">{AGENT_LABELS[agent]}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground capitalize">
                  {a.status}
                </span>
              </div>
              <div className="h-0.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    a.status === "done" ? "bg-primary" : a.status === "error" ? "bg-destructive" : "bg-primary/40"
                  )}
                  style={{
                    width: a.status === "done" ? "100%" : a.status === "running" ? "60%" : "0%",
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Synthesis state */}
      {synthesisStarted && (
        <div className="mt-4 rounded-[5px] border border-border bg-muted/40 px-3 py-2">
          <p className="font-mono text-[11px] text-muted-foreground">
            {report ? "✓ Report synthesized" : "Synthesizing all sections into final report…"}
          </p>
        </div>
      )}
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "size-1.5 rounded-full",
        status === "done" ? "bg-primary" :
        status === "running" ? "animate-pulse bg-primary/70" :
        status === "error" ? "bg-destructive" :
        "bg-muted-foreground/30"
      )}
    />
  )
}
