"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { useChat } from "@/hooks/useChat"
import { DDProgressOverlay } from "@/components/dd-progress-overlay"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import type { DDReport } from "@/lib/types"

interface ChatViewProps {
  onReportComplete: (report: DDReport, chatId: string | null) => Promise<DDReport>
  onOpenReportById: (reportId: string) => void
  initialChatId?: string | null
  onChatCreated?: (chatId: string) => void
}

const SUGGESTED_PROMPTS = [
  "Summarize AAPL Q4 earnings",
  "Red flags in TSLA's latest 10-K",
  "Run a full due diligence on Nvidia",
  "Compare MSFT vs GOOGL margins",
]

export function ChatView({ onReportComplete, onOpenReportById, initialChatId = null, onChatCreated }: ChatViewProps) {
  const { messages, isStreaming, ddJobId, ddCompany, chatId, sendMessage, appendReportCard, clearDdJob, startDdJob } = useChat(initialChatId, onChatCreated)
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const [autoDdQueue, setAutoDdQueue] = useState<AutoDdRequest[]>([])
  const [autoDdRunning, setAutoDdRunning] = useState<AutoDdRequest | null>(null)
  const [isStartingAutoDd, setIsStartingAutoDd] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!ddJobId && !isStartingAutoDd && !autoDdRunning && autoDdQueue.length > 0) {
      const [next, ...rest] = autoDdQueue
      setAutoDdQueue(rest)
      setIsStartingAutoDd(true)
      startDdJob(next.company, next.prompt)
        .then(() => setAutoDdRunning(next))
        .catch((err) => {
          console.error("Failed to start auto DD job:", err)
        })
        .finally(() => setIsStartingAutoDd(false))
    }
  }, [autoDdQueue, autoDdRunning, ddJobId, isStartingAutoDd, startDdJob])

  useEffect(() => {
    if (!ddJobId && autoDdRunning && !isStartingAutoDd) {
      setAutoDdRunning(null)
    }
  }, [ddJobId, autoDdRunning, isStartingAutoDd])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isStreaming || ddJobId) return
    setInput("")
    enqueueAutoDdIfNeeded(text)
    await sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const enqueueAutoDdIfNeeded = (text: string) => {
    const tickers = extractTickers(text)
    if (tickers.length === 0) return
    const lower = text.toLowerCase()
    if (!FINANCE_KEYWORDS.some((kw) => lower.includes(kw))) return
    setAutoDdQueue((prev) => {
      const existing = new Set(prev.map((item) => item.company))
      if (autoDdRunning) existing.add(autoDdRunning.company)
      if (ddCompany) existing.add(ddCompany)
      const additions = tickers
        .filter((ticker) => !existing.has(ticker))
        .map((ticker) => ({ company: ticker, prompt: text }))
      if (additions.length === 0) return prev
      return [...prev, ...additions]
    })
  }

  const handleReportComplete = async (report: DDReport) => {
    try {
      const saved = await onReportComplete(report, chatId)
      const verdict = saved.report.executiveSummary.verdict
      const tone =
        verdict === "Favorable" ? "The outlook looks promising." :
        verdict === "Unfavorable" ? "There are some significant concerns worth reviewing." :
        "There are a few things worth paying attention to."
      appendReportCard(
        { reportId: saved.reportId, company: saved.company, verdict },
        `I just finished the due diligence report for **${saved.company}**. ${tone} Click below to view the full report.`
      )
    } catch (e) {
      console.error("Failed to handle report completion:", e)
    } finally {
      clearDdJob()
    }
  }

  const isEmpty = messages.length === 0
  const isLocked = isStreaming || !!ddJobId
  const autoDdQueuedTickers = Array.from(new Set(autoDdQueue.map((item) => item.company)))
  const autoDdActiveTicker = autoDdRunning?.company ?? null
  const showAutoDdBanner = Boolean(autoDdActiveTicker || autoDdQueuedTickers.length > 0)

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {showAutoDdBanner && (
          <div className="mx-auto mb-4 w-full max-w-2xl rounded-md border border-dashed border-border bg-muted/40 px-4 py-3 text-center text-[12px] text-muted-foreground">
            {autoDdActiveTicker ? (
              <span>
                Running SEC-backed diligence for <strong>{autoDdActiveTicker}</strong>
              </span>
            ) : (
              <span>Preparing diligence data…</span>
            )}
            {autoDdQueuedTickers.length > 0 && (
              <span className="ml-2 text-[11px] text-muted-foreground/80">Queued: {autoDdQueuedTickers.join(", ")}</span>
            )}
          </div>
        )}
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-10 items-center justify-center rounded-[6px] bg-primary">
                <span className="text-sm font-bold text-primary-foreground">⬡</span>
              </div>
              <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
                What would you like to analyze?
              </h1>
              <p className="max-w-sm text-[13px] text-muted-foreground">
                Ask about a company's financials, request a diligence report, or upload
                documents for the agent to review.
              </p>
            </div>
            <div className="w-full max-w-xl">
              <ChatInput
                value={input}
                onChange={setInput}
                onKeyDown={handleKeyDown}
                onSend={handleSend}
                disabled={isLocked}
                autoFocus
              />
              <p className="mt-2 px-1 text-center font-mono text-[10px] text-muted-foreground/40">
                Agent has access to SEC EDGAR, earnings transcripts, and uploaded documents.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-[5px] border border-border bg-muted px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-6">
            {messages.map((msg) => {
              if (msg.reportCard) {
                const { reportId, company, verdict } = msg.reportCard
                const verdictBg =
                  verdict === "Favorable" ? "bg-green-600" :
                  verdict === "Cautious" ? "bg-amber-600" :
                  "bg-red-600"
                return (
                  <div key={msg.id} className="flex flex-col items-start gap-2">
                    {msg.content && (
                      <Message from="assistant">
                        <MessageContent>
                          <MessageResponse>{msg.content}</MessageResponse>
                        </MessageContent>
                      </Message>
                    )}
                    <button
                      onClick={() => onOpenReportById(reportId)}
                      className="group flex w-full max-w-md items-center gap-3 rounded-[8px] border border-border bg-card px-3.5 py-3 text-left shadow-sm transition-colors hover:bg-muted"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-[6px] border border-border bg-muted">
                        <svg className="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-[13px] font-semibold text-foreground">{company}</p>
                          <span className={cn("rounded-[3px] px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wide text-white", verdictBg)}>
                            {verdict}
                          </span>
                        </div>
                        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                          Due diligence report · Click to open
                        </p>
                      </div>
                      <svg className="size-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                )
              }

              return (
                <Message key={msg.id} from={msg.role}>
                  <MessageContent>
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <>
                        <MessageResponse>{msg.content}</MessageResponse>
                        {msg.isStreaming && (
                          <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse rounded-full bg-current opacity-70" />
                        )}
                      </>
                    )}
                  </MessageContent>
                </Message>
              )
            })}

            {ddJobId && ddCompany && (
              <div className="flex justify-start">
                <div className="w-full max-w-lg">
                  <DDProgressOverlay
                    jobId={ddJobId}
                    company={ddCompany}
                    onComplete={handleReportComplete}
                  />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {!isEmpty && (
        <div className="border-t border-border p-4">
          <div className="mx-auto max-w-2xl">
            <ChatInput
              value={input}
              onChange={setInput}
              onKeyDown={handleKeyDown}
              onSend={handleSend}
              disabled={isLocked}
              placeholder={ddJobId ? "Waiting for report to complete…" : undefined}
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface AutoDdRequest {
  company: string
  prompt: string
}

const FINANCE_KEYWORDS = ["margin", "revenue", "profit", "cash", "compare", "valuation", "earnings", "financial", "analysis", "ratios", "filing", "10k", "10-q"]
const TICKER_STOPWORDS = new Set(["THE", "AND", "WITH", "THIS", "THAT", "WHAT", "NEED", "PLEASE", "THANK", "STAT", "SHOW", "DATA", "ABOUT", "WANT"])

function extractTickers(text: string): string[] {
  const matches = text.toUpperCase().match(/\b[A-Z]{1,5}\b/g) ?? []
  return matches.filter((word) => word.length >= 2 && !TICKER_STOPWORDS.has(word))
}

interface ChatInputProps {
  value: string
  onChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onSend: () => void
  disabled: boolean
  autoFocus?: boolean
  placeholder?: string
}

function ChatInput({ value, onChange, onKeyDown, onSend, disabled, autoFocus, placeholder }: ChatInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-[8px] border border-border bg-background px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-ring/40">
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50"
        placeholder={placeholder ?? "Ask about a company, filing, or financial metric…"}
      />
      <button
        onClick={onSend}
        disabled={!value.trim() || disabled}
        className="flex size-7 items-center justify-center rounded-[4px] bg-gradient-to-b from-[#6BC782] via-[#3AA1C9] to-[#1D4ED8] transition-opacity hover:opacity-80 disabled:opacity-30"
      >
        <svg className="size-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  )
}
