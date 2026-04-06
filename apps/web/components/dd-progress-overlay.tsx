"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDDProgress } from "@/hooks/useDDProgress"
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
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (report && !isRunning) onComplete(report)
  }, [report, isRunning]) // eslint-disable-line react-hooks/exhaustive-deps

  // Find current active agent
  const currentAgent = AGENT_ORDER.find((a) => agents[a].status === "running") ?? null
  const currentLabel = currentAgent ? AGENT_LABELS[currentAgent] : null
  const currentActivities = currentAgent ? agents[currentAgent].activities : []
  const latestActivity = currentActivities.length > 0 ? currentActivities[currentActivities.length - 1] : null

  const displayCompany = profile?.name ?? company

  return (
    <div className="w-full">
      {/* Shiny "Anvil is working" text */}
      <div className="mb-2 flex items-center gap-2 px-1">
        <span className="relative font-mono text-[11px] font-semibold tracking-wide">
          <span className="anvil-shiny-text">Anvil is working</span>
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/60">
          {displayCompany}
        </span>
      </div>

      {/* Main card */}
      <motion.div
        className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] }}
      >
        {/* Single-line current task */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
        >
          {/* Pulsing dot */}
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

          {/* Task title + activity */}
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
              <span className="text-[12px] font-medium text-muted-foreground">Starting...</span>
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
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </button>

        {/* Expanded: activity log for current agent */}
        <AnimatePresence>
          {expanded && currentAgent && currentActivities.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] }}
              className="overflow-hidden"
            >
              <div className="border-t border-border/50 px-3 py-2">
                <ul className="space-y-0.5">
                  {currentActivities.map((activity, i) => (
                    <motion.li
                      key={`${currentAgent}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: i * 0.02 }}
                      className="flex items-center gap-2 py-0.5"
                    >
                      {i === currentActivities.length - 1 && isRunning ? (
                        <span className="size-1 shrink-0 animate-pulse rounded-full bg-primary" />
                      ) : (
                        <span className="size-1 shrink-0 rounded-full bg-muted-foreground/30" />
                      )}
                      <span className="truncate font-mono text-[10px] text-muted-foreground">
                        {activity}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* CSS for shiny text */}
      <style dangerouslySetInnerHTML={{ __html: `
        .anvil-shiny-text {
          background: linear-gradient(
            120deg,
            hsl(var(--foreground)) 0%,
            hsl(var(--foreground)) 35%,
            hsl(var(--primary)) 50%,
            hsl(var(--foreground)) 65%,
            hsl(var(--foreground)) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: anvil-shimmer 2.5s ease-in-out infinite;
        }
        @keyframes anvil-shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: -100% 50%; }
        }
      ` }} />
    </div>
  )
}
