export type AgentName = "financial" | "risk" | "competitive" | "management"
export type AgentStatus = "queued" | "running" | "done" | "error"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

export interface DDReport {
  reportId: string
  company: string
  markdown: string
  createdAt: number
}

export interface ChatSession {
  id: string
  title: string
  createdAt: number
}

export type SSEEvent =
  | { type: "text_delta"; delta: string }
  | { type: "dd_triggered"; company: string; ddJobId: string }
  | { type: "done" }
  | { type: "error"; message: string }
  | { type: "started"; jobId: string; company: string }
  | { type: "agent_progress"; agent: AgentName; status: AgentStatus; overallPct: number; preview?: string }
  | { type: "synthesis_started" }
  | { type: "synthesis_delta"; delta: string }
  | { type: "report_complete"; reportId: string; markdown: string; company: string }
