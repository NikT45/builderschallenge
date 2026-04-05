"use client"

import { useState, useEffect } from "react"
import { streamDDProgress } from "@/lib/api"
import { readSSEStream } from "@/lib/sse"
import type { AgentName, AgentStatus, DDReport } from "@/lib/types"

interface AgentState {
  status: AgentStatus
  overallPct: number
  preview?: string
}

interface DDProgressState {
  isRunning: boolean
  overallPct: number
  agents: Record<AgentName, AgentState>
  synthesisStarted: boolean
  report: DDReport | null
}

const DEFAULT_AGENTS: Record<AgentName, AgentState> = {
  financial: { status: "queued", overallPct: 0 },
  risk: { status: "queued", overallPct: 0 },
  competitive: { status: "queued", overallPct: 0 },
  management: { status: "queued", overallPct: 0 },
}

export function useDDProgress(jobId: string | null): DDProgressState {
  const [state, setState] = useState<DDProgressState>({
    isRunning: false,
    overallPct: 0,
    agents: { ...DEFAULT_AGENTS },
    synthesisStarted: false,
    report: null,
  })

  useEffect(() => {
    if (!jobId) {
      setState({
        isRunning: false,
        overallPct: 0,
        agents: { ...DEFAULT_AGENTS },
        synthesisStarted: false,
        report: null,
      })
      return
    }

    setState((s) => ({ ...s, isRunning: true, overallPct: 0 }))

    let cancelled = false

    async function run() {
      const response = await streamDDProgress(jobId!)
      if (!response.ok || cancelled) return

      for await (const event of readSSEStream(response)) {
        if (cancelled) break

        if (event.type === "agent_progress") {
          setState((s) => ({
            ...s,
            overallPct: Math.max(s.overallPct, event.overallPct),
            agents: {
              ...s.agents,
              [event.agent]: {
                status: event.status,
                overallPct: event.overallPct,
                preview: event.preview,
              },
            },
          }))
        } else if (event.type === "synthesis_started") {
          setState((s) => ({ ...s, synthesisStarted: true, overallPct: 75 }))
        } else if (event.type === "report_complete") {
          setState((s) => ({
            ...s,
            isRunning: false,
            overallPct: 100,
            report: {
              reportId: event.reportId,
              company: event.company,
              markdown: event.markdown,
              createdAt: Date.now(),
            },
          }))
          break
        } else if (event.type === "error") {
          console.error("DD error:", event.message)
          setState((s) => ({ ...s, isRunning: false }))
          break
        }
      }
    }

    run().catch(console.error)
    return () => { cancelled = true }
  }, [jobId])

  return state
}
