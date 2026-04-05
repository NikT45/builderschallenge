"use client"

import { useState } from "react"
import { AppSidebar, type Tab } from "@/components/app-sidebar"

// ─── Chat ────────────────────────────────────────────────────────────────────

function ChatPanel() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-[52px] items-center justify-between border-b border-border px-6">
        <div>
          <h1 className="text-[13px] font-semibold text-foreground">Chat</h1>
          <p className="font-mono text-[10px] text-muted-foreground">New conversation</p>
        </div>
        <button className="rounded-[5px] border border-border bg-secondary px-3 py-1.5 font-mono text-[11px] text-secondary-foreground transition-colors hover:bg-muted">
          + New Chat
        </button>
      </div>

      {/* Messages area */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-border bg-muted">
          <svg className="size-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">What would you like to analyze?</p>
          <p className="mt-1 max-w-sm text-[12px] text-muted-foreground">
            Ask about a company's financials, request a diligence report, or upload
            documents for the agent to review.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Summarize AAPL Q4 earnings",
            "Red flags in latest 10-K",
            "Compare margins vs peers",
          ].map((prompt) => (
            <button
              key={prompt}
              className="rounded-[5px] border border-border bg-muted px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2 rounded-[7px] border border-border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring/40">
          <input
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            placeholder="Ask about a company, filing, or financial metric…"
          />
          <button className="flex size-7 items-center justify-center rounded-[4px] bg-primary transition-opacity hover:opacity-80">
            <svg className="size-3.5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="mt-1.5 px-1 font-mono text-[10px] text-muted-foreground/40">
          Agent has access to SEC EDGAR, earnings transcripts, and uploaded documents.
        </p>
      </div>
    </div>
  )
}

// ─── Reports ─────────────────────────────────────────────────────────────────

function ReportsPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[52px] items-center justify-between border-b border-border px-6">
        <div>
          <h1 className="text-[13px] font-semibold text-foreground">Reports</h1>
          <p className="font-mono text-[10px] text-muted-foreground">Saved diligence reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-[5px] border border-border bg-secondary px-3 py-1.5 font-mono text-[11px] text-secondary-foreground transition-colors hover:bg-muted">
            Export
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-border bg-muted">
          <svg className="size-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">No reports yet</p>
          <p className="mt-1 max-w-xs text-[12px] text-muted-foreground">
            Reports are generated when you ask the agent to produce a diligence
            summary. They will appear here for review, export, or comparison.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-[4px] border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">PDF</span>
          <span className="rounded-[4px] border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">Markdown</span>
          <span className="rounded-[4px] border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">JSON</span>
        </div>
      </div>
    </div>
  )
}

// ─── Documents ───────────────────────────────────────────────────────────────

function DocumentsPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[52px] items-center justify-between border-b border-border px-6">
        <div>
          <h1 className="text-[13px] font-semibold text-foreground">Documents</h1>
          <p className="font-mono text-[10px] text-muted-foreground">Source files & filings</p>
        </div>
        <button className="rounded-[5px] border border-border bg-secondary px-3 py-1.5 font-mono text-[11px] text-secondary-foreground transition-colors hover:bg-muted">
          + Upload
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        {/* Drop zone */}
        <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-[8px] border-2 border-dashed border-border bg-muted/30 px-8 py-10 transition-colors hover:border-primary/40 hover:bg-muted/50">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <svg className="size-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-medium text-foreground">Drop files here</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              PDFs, 10-Ks, earnings transcripts, Excel models
            </p>
          </div>
          <button className="rounded-[5px] border border-border bg-background px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted">
            Browse files
          </button>
        </div>
        <p className="max-w-xs font-mono text-[10px] text-muted-foreground/50">
          Uploaded documents are indexed and made available to the agent during analysis.
        </p>
      </div>
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

function SettingsPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[52px] items-center border-b border-border px-6">
        <div>
          <h1 className="text-[13px] font-semibold text-foreground">Settings</h1>
          <p className="font-mono text-[10px] text-muted-foreground">Preferences & API keys</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-lg space-y-8">
          {/* API Keys */}
          <section>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              API Keys
            </h2>
            <div className="space-y-3 rounded-[7px] border border-border bg-card p-4">
              {[
                { label: "Anthropic API Key", placeholder: "sk-ant-…" },
                { label: "SEC EDGAR API Key", placeholder: "Optional" },
              ].map(({ label, placeholder }) => (
                <div key={label} className="space-y-1">
                  <label className="font-mono text-[11px] text-muted-foreground">{label}</label>
                  <input
                    type="password"
                    placeholder={placeholder}
                    className="w-full rounded-[5px] border border-border bg-background px-3 py-1.5 font-mono text-[12px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Model */}
          <section>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Model
            </h2>
            <div className="space-y-2 rounded-[7px] border border-border bg-card p-4">
              <label className="font-mono text-[11px] text-muted-foreground">Claude Model</label>
              <select className="w-full rounded-[5px] border border-border bg-background px-3 py-1.5 font-mono text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40">
                <option value="claude-opus-4-6">claude-opus-4-6 (Most capable)</option>
                <option value="claude-sonnet-4-6">claude-sonnet-4-6 (Balanced)</option>
                <option value="claude-haiku-4-5">claude-haiku-4-5 (Fast)</option>
              </select>
            </div>
          </section>

          {/* Export Format */}
          <section>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Export Format
            </h2>
            <div className="space-y-2 rounded-[7px] border border-border bg-card p-4">
              <label className="font-mono text-[11px] text-muted-foreground">Default report format</label>
              <div className="flex gap-2">
                {["Markdown", "PDF", "JSON"].map((fmt) => (
                  <button
                    key={fmt}
                    className={`rounded-[5px] border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                      fmt === "Markdown"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <button className="w-full rounded-[5px] bg-primary py-2 font-mono text-[12px] font-medium text-primary-foreground transition-opacity hover:opacity-80">
            Save settings
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────

const panels: Record<Tab, React.FC> = {
  chat: ChatPanel,
  reports: ReportsPanel,
  documents: DocumentsPanel,
  settings: SettingsPanel,
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("chat")
  const ActivePanel = panels[activeTab]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <ActivePanel />
      </main>
    </div>
  )
}
