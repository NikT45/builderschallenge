"use client"

import { useRef, useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@workspace/ui/lib/utils"
import { useChat } from "@/hooks/useChat"
import { DDProgressOverlay } from "@/components/dd-progress-overlay"
import type { DDReport } from "@/lib/types"

interface ChatViewProps {
  onReportComplete: (report: DDReport) => void
}

const SUGGESTED_PROMPTS = [
  "Summarize AAPL Q4 earnings",
  "Red flags in TSLA's latest 10-K",
  "Run a full due diligence on Nvidia",
  "Compare MSFT vs GOOGL margins",
]

export function ChatView({ onReportComplete }: ChatViewProps) {
  const { messages, isStreaming, ddJobId, ddCompany, sendMessage, clearDdJob } = useChat()
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isStreaming) return
    setInput("")
    await sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReportComplete = (report: DDReport) => {
    onReportComplete(report)
    clearDdJob()
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex h-full flex-col">
      {/* Messages / Empty state */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          // Centered new chat state
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

            {/* Input centered */}
            <div className="w-full max-w-xl">
              <ChatInput
                value={input}
                onChange={setInput}
                onKeyDown={handleKeyDown}
                onSend={handleSend}
                isStreaming={isStreaming}
                autoFocus
              />
              <p className="mt-2 px-1 text-center font-mono text-[10px] text-muted-foreground/40">
                Agent has access to SEC EDGAR, earnings transcripts, and uploaded documents.
              </p>
            </div>

            {/* Suggested prompts */}
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
          // Message thread
          <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-[8px] px-3.5 py-2.5 text-[13px] leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-1.5 list-disc pl-4 last:mb-0">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-1.5 list-decimal pl-4 last:mb-0">{children}</ol>,
                        li: ({ children }) => <li className="mb-0.5">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        code: ({ children }) => <code className="rounded bg-background/60 px-1 py-0.5 font-mono text-[11px]">{children}</code>,
                        h1: ({ children }) => <h1 className="mb-1 mt-2 text-[14px] font-bold first:mt-0">{children}</h1>,
                        h2: ({ children }) => <h2 className="mb-1 mt-2 text-[13px] font-semibold first:mt-0">{children}</h2>,
                        h3: ({ children }) => <h3 className="mb-1 mt-1.5 text-[13px] font-medium first:mt-0">{children}</h3>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                  {msg.isStreaming && (
                    <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse rounded-full bg-current opacity-70" />
                  )}
                </div>
              </div>
            ))}

            {/* DD Progress inline */}
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

      {/* Input — only shown at bottom when there are messages */}
      {!isEmpty && (
        <div className="border-t border-border p-4">
          <div className="mx-auto max-w-2xl">
            <ChatInput
              value={input}
              onChange={setInput}
              onKeyDown={handleKeyDown}
              onSend={handleSend}
              isStreaming={isStreaming}
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface ChatInputProps {
  value: string
  onChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onSend: () => void
  isStreaming: boolean
  autoFocus?: boolean
}

function ChatInput({ value, onChange, onKeyDown, onSend, isStreaming, autoFocus }: ChatInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-[8px] border border-border bg-background px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-ring/40">
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={isStreaming}
        className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50"
        placeholder="Ask about a company, filing, or financial metric…"
      />
      <button
        onClick={onSend}
        disabled={!value.trim() || isStreaming}
        className="flex size-7 items-center justify-center rounded-[4px] bg-primary transition-opacity hover:opacity-80 disabled:opacity-30"
      >
        <svg
          className="size-3.5 text-primary-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  )
}
