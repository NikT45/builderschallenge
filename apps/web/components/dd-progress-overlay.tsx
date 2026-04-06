"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useDDProgress } from "@/hooks/useDDProgress"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { Task, TaskTrigger, TaskContent, TaskItem } from "@/components/ai-elements/task"
import type { AgentName, DDReport } from "@/lib/types"

interface DDProgressOverlayProps {
  jobId: string
  company: string
  onComplete: (report: DDReport) => void
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
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (report && !isRunning) onComplete(report)
  }, [report, isRunning]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentAgent = AGENT_ORDER.find((a) => agents[a].status === "running") ?? null
  const currentLabel = currentAgent ? AGENT_LABELS[currentAgent] : null
  const currentActivities = currentAgent ? agents[currentAgent].activities : []
  const latestActivity = currentActivities.length > 0 ? currentActivities[currentActivities.length - 1] : null

  const displayCompany = profile?.name ?? company

  return (
    <div className="w-full">
      {/* "Anvil is working" header */}
      <div className="mb-2 flex items-center gap-2 px-1">
        <Shimmer
          as="span"
          className="font-mono text-[11px] font-semibold tracking-wide"
          duration={2.5}
          spread={3}
        >
          Anvil is working
        </Shimmer>
        <span className="font-mono text-[10px] text-muted-foreground/60">
          {displayCompany}
        </span>
      </div>

      {/* Main card using Task (collapsible) */}
      <motion.div
        className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Task defaultOpen={false} open={open} onOpenChange={setOpen}>
          {/* Single-line trigger */}
          <TaskTrigger title={currentLabel ?? "Starting…"}>
            <div
              className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-muted/50"
              onClick={() => setOpen((o) => !o)}
            >
              {/* Status dot */}
              {isRunning ? (
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-40" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
              ) : errorMessage ? (
                <span className="size-2 shrink-0 rounded-full bg-destructive" />
              ) : (
                <span className="size-2 shrink-0 rounded-full bg-green-500" />
              )}

              {/* Task title + streaming activity */}
              <div className="min-w-0 flex-1">
                {currentLabel ? (
                  <div className="flex items-baseline gap-1.5">
                    <span className="shrink-0 text-[12px] font-medium text-foreground">
                      {currentLabel}
                    </span>
                    <AnimatePresence mode="wait">
                      {latestActivity && (
                        <motion.span
                          key={latestActivity}
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          transition={{ duration: 0.2 }}
                          className="truncate font-mono text-[10px] text-muted-foreground"
                        >
                          {latestActivity}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                ) : errorMessage ? (
                  <span className="text-[12px] font-medium text-destructive">{errorMessage}</span>
                ) : !isRunning && report ? (
                  <span className="text-[12px] font-medium text-foreground">Complete</span>
                ) : (
                  <span className="text-[12px] font-medium text-muted-foreground">Starting…</span>
                )}
              </div>

              {/* Chevron */}
              <motion.svg
                className="size-3.5 shrink-0 text-muted-foreground/50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </div>
          </TaskTrigger>

          {/* Expanded activity log */}
          <TaskContent className="border-t border-border/50 px-3 py-2">
            {currentActivities.length === 0 ? (
              <TaskItem className="font-mono text-[10px]">Initializing…</TaskItem>
            ) : (
              <div className="relative ml-[3px]">
                {currentActivities.length > 1 && (
                  <div
                    className="absolute left-[1.5px] top-[6px] w-px border-l border-dashed border-muted-foreground/25"
                    style={{ height: "calc(100% - 12px)" }}
                  />
                )}
                <ul className="space-y-0.5">
                  {currentActivities.map((activity, i) => (
                    <motion.li
                      key={`${currentAgent}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: i * 0.02 }}
                      className="relative flex items-center gap-2.5 py-0.5"
                    >
                      {i === currentActivities.length - 1 && isRunning ? (
                        <span className="relative z-10 size-[5px] shrink-0 animate-pulse rounded-full bg-primary" />
                      ) : (
                        <span className="relative z-10 size-[5px] shrink-0 rounded-full bg-muted-foreground/30" />
                      )}
                      <TaskItem className="truncate font-mono text-[10px]">{activity}</TaskItem>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </TaskContent>
        </Task>
      </motion.div>
    </div>
  )
}
