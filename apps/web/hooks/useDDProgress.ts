"use client"

import { useState, useEffect, useRef } from "react"
import { streamDDProgress } from "@/lib/api"
import { readSSEStream } from "@/lib/sse"
import type { AgentName, AgentStatus, DDReport, CompanyProfile, StructuredReport } from "@/lib/types"

interface AgentState {
  status: AgentStatus
  preview?: string
  activities: string[]
}

interface DDProgressState {
  isRunning: boolean
  overallPct: number
  agents: Record<AgentName, AgentState>
  synthesisStarted: boolean
  profile: CompanyProfile | null
  report: DDReport | null
  errorMessage: string | null
}

const DEFAULT_AGENTS: Record<AgentName, AgentState> = {
  intake: { status: "queued", activities: [] },
  financial: { status: "queued", activities: [] },
  market: { status: "queued", activities: [] },
  risk: { status: "queued", activities: [] },
  management: { status: "queued", activities: [] },
  synthesis: { status: "queued", activities: [] },
}

const RECONNECT_DELAYS = [2000, 4000, 8000, 15000, 30000]

export function useDDProgress(jobId: string | null): DDProgressState {
  const [state, setState] = useState<DDProgressState>({
    isRunning: false,
    overallPct: 0,
    agents: { ...DEFAULT_AGENTS },
    synthesisStarted: false,
    profile: null,
    report: null,
    errorMessage: null,
  })

  const attemptRef = useRef(0)

  useEffect(() => {
    if (!jobId) {
      setState({
        isRunning: false,
        overallPct: 0,
        agents: { ...DEFAULT_AGENTS },
        synthesisStarted: false,
        profile: null,
        report: null,
        errorMessage: null,
      })
      attemptRef.current = 0
      return
    }

    setState((s) => ({ ...s, isRunning: true }))
    attemptRef.current = 0
    let cancelled = false
    let retryTimeout: ReturnType<typeof setTimeout>

    async function connect() {
      try {
        const response = await streamDDProgress(jobId!)
        if (!response.ok || cancelled) return

        for await (const event of readSSEStream(response)) {
          if (cancelled) return

          if (event.type === "intake_complete") {
            setState((s) => ({ ...s, profile: event.profile }))
          } else if (event.type === "tool_activity" && event.agent) {
            const agent = event.agent
            setState((s) => ({
              ...s,
              agents: {
                ...s.agents,
                [agent]: {
                  ...s.agents[agent],
                  activities: [...s.agents[agent].activities, event.description],
                },
              },
            }))
          } else if (event.type === "agent_progress") {
            setState((s) => ({
              ...s,
              overallPct: Math.max(s.overallPct, event.overallPct),
              agents: {
                ...s.agents,
                [event.agent]: { ...s.agents[event.agent], status: event.status, preview: event.preview },
              },
            }))
          } else if (event.type === "synthesis_started") {
            setState((s) => ({ ...s, synthesisStarted: true }))
          } else if (event.type === "report_complete") {
            setState((s) => ({
              ...s,
              isRunning: false,
              overallPct: 100,
              report: {
                reportId: event.reportId,
                company: event.company,
                report: event.report as StructuredReport,
                createdAt: Date.now(),
              },
            }))
            return
          } else if (event.type === "error") {
            console.error("DD error:", event.message)
            setState((s) => ({ ...s, isRunning: false, errorMessage: event.message }))
            return
          }
        }

        if (!cancelled) scheduleReconnect()
      } catch (err) {
        if (!cancelled) {
          console.warn("DD stream error, reconnecting…", err)
          scheduleReconnect()
        }
      }
    }

    function scheduleReconnect() {
      const delay = RECONNECT_DELAYS[Math.min(attemptRef.current, RECONNECT_DELAYS.length - 1)]
      attemptRef.current++
      console.log(`[useDDProgress] reconnect attempt ${attemptRef.current} in ${delay}ms`)
      retryTimeout = setTimeout(() => {
        if (!cancelled) connect()
      }, delay)
    }

    connect()

    return () => {
      cancelled = true
      clearTimeout(retryTimeout)
    }
  }, [jobId])

  return state
}
