"use client"

import { useState } from "react"
import { AppSidebar, type Tab } from "@/components/app-sidebar"
import { ChatView } from "@/components/chat-view"
import { ReportViewer } from "@/components/report-viewer"
import type { DDReport } from "@/lib/types"

// ─── Reports ─────────────────────────────────────────────────────────────────

function ReportsPanel({ reports, onOpen }: { reports: DDReport[]; onOpen: (r: DDReport) => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[52px] items-center justify-between border-b border-border px-6">
        <div>
          <h1 className="text-[13px] font-semibold text-foreground">Reports</h1>
          <p className="font-mono text-[10px] text-muted-foreground">Saved diligence reports</p>
        </div>
      </div>

      {reports.length === 0 ? (
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
              Ask the agent to run a due diligence report and it will appear here.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-[4px] border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">PDF</span>
            <span className="rounded-[4px] border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">Markdown</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-2">
            {reports.map((r) => (
              <button
                key={r.reportId}
                onClick={() => onOpen(r)}
                className="group flex w-full items-center justify-between rounded-[7px] border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted"
              >
                <div>
                  <p className="text-[13px] font-medium text-foreground">{r.company}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <svg className="size-4 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
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
            <p className="mt-0.5 text-[11px] text-muted-foreground">PDFs, 10-Ks, earnings transcripts, Excel models</p>
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
          <section>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">API Keys</h2>
            <div className="space-y-3 rounded-[7px] border border-border bg-card p-4">
              {[
                { label: "Anthropic API Key", placeholder: "sk-ant-…" },
                { label: "SEC EDGAR API Key", placeholder: "Optional" },
              ].map(({ label, placeholder }) => (
                <div key={label} className="space-y-1">
                  <label className="font-mono text-[11px] text-muted-foreground">{label}</label>
                  <input type="password" placeholder={placeholder} className="w-full rounded-[5px] border border-border bg-background px-3 py-1.5 font-mono text-[12px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/40" />
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Model</h2>
            <div className="space-y-2 rounded-[7px] border border-border bg-card p-4">
              <label className="font-mono text-[11px] text-muted-foreground">Claude Model</label>
              <select className="w-full rounded-[5px] border border-border bg-background px-3 py-1.5 font-mono text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40">
                <option value="claude-opus-4-6">claude-opus-4-6 (Most capable)</option>
                <option value="claude-sonnet-4-6">claude-sonnet-4-6 (Balanced)</option>
                <option value="claude-haiku-4-5">claude-haiku-4-5 (Fast)</option>
              </select>
            </div>
          </section>
          <section>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Export Format</h2>
            <div className="space-y-2 rounded-[7px] border border-border bg-card p-4">
              <label className="font-mono text-[11px] text-muted-foreground">Default report format</label>
              <div className="flex gap-2">
                {["Markdown", "PDF", "JSON"].map((fmt) => (
                  <button key={fmt} className={`rounded-[5px] border px-3 py-1.5 font-mono text-[11px] transition-colors ${fmt === "Markdown" ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:bg-muted"}`}>{fmt}</button>
                ))}
              </div>
            </div>
          </section>
          <button className="w-full rounded-[5px] bg-primary py-2 font-mono text-[12px] font-medium text-primary-foreground transition-opacity hover:opacity-80">Save settings</button>
        </div>
      </div>
    </div>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab | null>(null)
  const [reports, setReports] = useState<DDReport[]>([])
  const [openReport, setOpenReport] = useState<DDReport | null>(null)

  const handleReportComplete = (report: DDReport) => {
    setReports((prev) => {
      const exists = prev.some((r) => r.reportId === report.reportId)
      return exists ? prev : [report, ...prev]
    })
  }

  const handleOpenReport = (report: DDReport) => {
    setOpenReport(report)
    setActiveTab("reports")
  }

  const renderMain = () => {
    if (activeTab === "reports") {
      if (openReport) return <ReportViewer report={openReport} />
      return <ReportsPanel reports={reports} onOpen={handleOpenReport} />
    }
    if (activeTab === "documents") return <DocumentsPanel />
    if (activeTab === "settings") return <SettingsPanel />
    // null = new chat / active chat
    return <ChatView onReportComplete={handleReportComplete} />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setOpenReport(null) }} />
      <main className="flex flex-1 flex-col overflow-hidden">
        {renderMain()}
      </main>
    </div>
  )
}
