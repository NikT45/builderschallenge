"use client"

import { useState, useEffect, useRef } from "react"
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

const RECONNECT_DELAYS = [2000, 4000, 8000, 15000, 30000] // ms

export function useDDProgress(jobId: string | null): DDProgressState {
  const [state, setState] = useState<DDProgressState>({
    isRunning: false,
    overallPct: 0,
    agents: { ...DEFAULT_AGENTS },
    synthesisStarted: false,
    report: null,
  })

  const attemptRef = useRef(0)

  useEffect(() => {
    if (!jobId) {
      setState({
        isRunning: false,
        overallPct: 0,
        agents: { ...DEFAULT_AGENTS },
        synthesisStarted: false,
        report: null,
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
            return // done — no reconnect needed
          } else if (event.type === "error") {
            console.error("DD error:", event.message)
            setState((s) => ({ ...s, isRunning: false }))
            return
          }
        }

        // Stream ended without report_complete — reconnect
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
