"use client"

import { useEffect } from "react"
import { useDDProgress } from "@/hooks/useDDProgress"
import { AgentPlan } from "@/components/ui/agent-plan"
import type { PlanTask, PlanTaskStatus } from "@/components/ui/agent-plan"
import type { AgentName, DDReport } from "@/lib/types"

interface DDProgressOverlayProps {
  jobId: string
  company: string
  onComplete: (report: { reportId: string; company: string; markdown: string; createdAt: number }) => void
}

function mapStatus(s: string): PlanTaskStatus {
  if (s === "done") return "completed"
  if (s === "running") return "in-progress"
  if (s === "error") return "failed"
  return "pending"
}

const AGENT_LABELS: Record<AgentName, string> = {
  financial: "Financial Analysis",
  risk: "Risk Assessment",
  competitive: "Competitive Landscape",
  management: "Management & Governance",
}

const AGENT_ORDER: AgentName[] = ["financial", "risk", "competitive", "management"]

export function DDProgressOverlay({ jobId, company, onComplete }: DDProgressOverlayProps) {
  const { isRunning, agents, synthesisStarted, report } = useDDProgress(jobId)

  useEffect(() => {
    if (report && !isRunning) onComplete(report)
  }, [report, isRunning]) // eslint-disable-line react-hooks/exhaustive-deps

  const synthesisStatus: PlanTaskStatus = report
    ? "completed"
    : synthesisStarted
    ? "in-progress"
    : "pending"

  const tasks: PlanTask[] = [
    ...AGENT_ORDER.map((agent) => ({
      id: agent,
      title: AGENT_LABELS[agent],
      status: mapStatus(agents[agent].status),
    })),
    {
      id: "synthesis",
      title: "Synthesis",
      status: synthesisStatus,
    },
  ]

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center gap-2 px-1">
        <span className="shrink-0 size-1.5 animate-pulse rounded-full bg-primary" />
        <span className="font-mono text-[10px] text-muted-foreground">
          Due diligence · {company}
        </span>
      </div>
      <AgentPlan tasks={tasks} />
    </div>
  )
}
