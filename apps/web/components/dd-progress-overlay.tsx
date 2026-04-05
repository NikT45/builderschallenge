"use client"

import { useEffect } from "react"
import { useDDProgress } from "@/hooks/useDDProgress"
import { AgentPlan } from "@/components/ui/agent-plan"
import type { PlanTask, PlanTaskStatus } from "@/components/ui/agent-plan"
import type { AgentName, DDReport } from "@/lib/types"

interface DDProgressOverlayProps {
  jobId: string
  company: string
  onComplete: (report: DDReport) => void
}

function mapStatus(s: string): PlanTaskStatus {
  if (s === "done") return "completed"
  if (s === "running") return "in-progress"
  if (s === "error") return "failed"
  return "pending"
}

const AGENT_LABELS: Record<AgentName, string> = {
  intake: "Company Intake",
  financial: "Financial Analysis",
  market: "Market & Competition",
  risk: "Risk Assessment",
  management: "Management & Governance",
  synthesis: "Synthesis & Verdict",
}

const AGENT_ORDER: AgentName[] = ["intake", "financial", "market", "risk", "management", "synthesis"]

export function DDProgressOverlay({ jobId, company, onComplete }: DDProgressOverlayProps) {
  const { isRunning, agents, profile, report, errorMessage } = useDDProgress(jobId)

  useEffect(() => {
    if (report && !isRunning) onComplete(report)
  }, [report, isRunning]) // eslint-disable-line react-hooks/exhaustive-deps

  const tasks: PlanTask[] = AGENT_ORDER.map((agent) => ({
    id: agent,
    title: AGENT_LABELS[agent],
    status: mapStatus(agents[agent].status),
  }))

  const displayCompany = profile?.name ?? company
  const profileBadge = profile
    ? profile.isPublic
      ? `Public · ${profile.ticker ?? "US"}`
      : "Private"
    : null

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center gap-2 px-1">
        <span
          className={`shrink-0 size-1.5 rounded-full ${
            errorMessage ? "bg-destructive" : isRunning ? "animate-pulse bg-primary" : "bg-primary"
          }`}
        />
        <span className="font-mono text-[10px] text-muted-foreground">
          Due diligence · {displayCompany}
        </span>
        {profileBadge && (
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
            {profileBadge}
          </span>
        )}
      </div>
      <AgentPlan tasks={tasks} />
      {errorMessage && (
        <div className="mt-2 rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1.5 font-mono text-[10px] text-destructive">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
