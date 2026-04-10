"use client"

import { useEffect, useRef, useState } from "react"
import { AppSidebar, type Tab } from "@/components/app-sidebar"
import { ChatView } from "@/components/chat-view"
import { ReportViewer } from "@/components/report-viewer"
import { listReports, saveReport, listChats } from "@/lib/db"
import { uploadDocument, listDocuments, deleteDocument, type DocumentItem } from "@/lib/api"
import { createClient } from "@/utils/supabase/client"
import type { ChatListItem } from "@/components/app-sidebar"
import type { DDReport, Verdict } from "@/lib/types"

// ─── Reports Panel ───────────────────────────────────────────────────────────

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
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] font-medium text-foreground">{r.company}</p>
                    <VerdictPill verdict={r.report.executiveSummary.verdict} />
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {r.report.company.isPublic ? "Public" : "Private"} ·{" "}
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <svg className="size-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const bg =
    verdict === "Favorable" ? "bg-green-600" :
    verdict === "Cautious" ? "bg-amber-600" :
    "bg-red-600"
  return (
    <span className={`rounded-[3px] px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wide text-white ${bg}`}>
      {verdict}
    </span>
  )
}

// ─── Documents ───────────────────────────────────────────────────────────────

function DocumentsPanel() {
  const [docs, setDocs] = useState<DocumentItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadDocs = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      const items = await listDocuments(data.user?.id)
      setDocs(Array.isArray(items) ? items : [])
    } catch { /* silent */ }
  }

  useEffect(() => { loadDocs() }, [])

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      for (const file of Array.from(files)) {
        await uploadDocument(file, data.user?.id)
      }
      await loadDocs()
    } catch (e) {
      console.error("Upload failed:", e)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteDocument(id)
    setDocs((prev) => prev.filter((d) => d.id !== id))
  }

  const fmtSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[52px] items-center justify-between border-b border-border px-6">
        <div>
          <h1 className="text-[13px] font-semibold text-foreground">Documents</h1>
          <p className="font-mono text-[10px] text-muted-foreground">Source files & filings</p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-[5px] border border-border bg-secondary px-3 py-1.5 font-mono text-[11px] text-secondary-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "+ Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md,.csv,.json"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
          onClick={() => inputRef.current?.click()}
          className={`mb-4 flex cursor-pointer flex-col items-center gap-3 rounded-[8px] border-2 border-dashed px-8 py-8 transition-colors ${
            dragOver ? "border-primary/60 bg-primary/5" : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40"
          }`}
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <svg className="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[12px] font-medium text-foreground">Drop files or click to browse</p>
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">PDF, TXT, MD, CSV, JSON</p>
          </div>
        </div>

        {docs.length === 0 ? (
          <p className="text-center font-mono text-[11px] text-muted-foreground/40">No documents uploaded yet</p>
        ) : (
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 rounded-[6px] border border-border bg-card px-3 py-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-[4px] border border-border bg-muted">
                  <svg className="size-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-foreground">{doc.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {fmtSize(doc.size)} · {new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="flex size-6 items-center justify-center rounded-[4px] text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

function SettingsPanel() {
  const [email, setEmail] = useState<string | null>(null)
  const [signingOut, setSigningOut] = useState(false)
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? null)
        setUserCreatedAt(data.user.created_at ?? null)
      }
    })
  }, [])

  const handleSignOut = async () => {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[52px] items-center border-b border-border px-6">
        <div>
          <h1 className="text-[13px] font-semibold text-foreground">Settings</h1>
          <p className="font-mono text-[10px] text-muted-foreground">Account & preferences</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-lg space-y-6">

          {/* Account */}
          <section>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Account</h2>
            <div className="rounded-[7px] border border-border bg-card divide-y divide-border">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-mono text-[11px] text-muted-foreground">Email</span>
                <span className="font-mono text-[12px] text-foreground">{email ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-mono text-[11px] text-muted-foreground">Member since</span>
                <span className="font-mono text-[12px] text-foreground">
                  {userCreatedAt
                    ? new Date(userCreatedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                    : "—"}
                </span>
              </div>
            </div>
          </section>

          {/* Data */}
          <section>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Data</h2>
            <div className="rounded-[7px] border border-border bg-card divide-y divide-border">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-[12px] font-medium text-foreground">Documents & embeddings</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5">Uploaded files are scoped to your account</p>
                </div>
                <span className="rounded-[3px] bg-green-600/10 px-2 py-0.5 font-mono text-[10px] font-medium text-green-600">Private</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-[12px] font-medium text-foreground">Due diligence reports</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5">Reports and chat history are isolated per user</p>
                </div>
                <span className="rounded-[3px] bg-green-600/10 px-2 py-0.5 font-mono text-[10px] font-medium text-green-600">Private</span>
              </div>
            </div>
          </section>

          {/* Sign out */}
          <section>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Session</h2>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full rounded-[5px] border border-destructive/40 bg-destructive/5 py-2 font-mono text-[12px] font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </section>

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
  const [chats, setChats] = useState<ChatListItem[]>([])
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | undefined>(undefined)
  // A version key forces ChatView to remount when user picks a different chat
  // or starts a new chat, so useChat re-initializes with the new id.
  const [chatKey, setChatKey] = useState(0)

  const refreshChats = () => {
    listChats()
      .then((rows) => setChats(rows.map((r) => ({ id: r.id, title: r.title }))))
      .catch((e) => console.error("Failed to load chats:", e))
  }

  // Hydrate reports + chats from Supabase on mount, and load current user
  useEffect(() => {
    listReports()
      .then(setReports)
      .catch((e) => console.error("Failed to load reports:", e))
    refreshChats()
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.id) setUserId(data.user.id)
    })
  }, [])

  const handleReportComplete = async (report: DDReport, chatId: string | null): Promise<DDReport> => {
    // Persist to Supabase; use the returned id so it's stable
    let saved = report
    try {
      const dbId = await saveReport(report, chatId)
      saved = { ...report, reportId: dbId }
    } catch (e) {
      console.error("Failed to save report:", e)
    }
    setReports((prev) => (prev.some((r) => r.reportId === saved.reportId) ? prev : [saved, ...prev]))
    return saved
  }

  const handleOpenReportById = (reportId: string) => {
    const found = reports.find((r) => r.reportId === reportId)
    if (found) {
      setOpenReport(found)
      setActiveTab("reports")
    }
  }

  const handleOpenReport = (report: DDReport) => {
    setOpenReport(report)
    setActiveTab("reports")
  }

  const handleChatCreated = (newChatId: string) => {
    // Do NOT call setSelectedChatId here — it would change initialChatId on the
    // live ChatView, triggering the loadMessages effect and wiping in-progress state.
    // The internal chatId inside useChat is already set; just refresh the sidebar.
    refreshChats()
  }

  const handleSelectChat = (id: string) => {
    setSelectedChatId(id)
    setChatKey((k) => k + 1)
    setOpenReport(null)
  }

  const handleNewChat = () => {
    setSelectedChatId(null)
    setChatKey((k) => k + 1)
    setOpenReport(null)
  }

  const renderMain = () => {
    if (activeTab === "reports") {
      if (openReport) return <ReportViewer report={openReport} />
      return <ReportsPanel reports={reports} onOpen={handleOpenReport} />
    }
    if (activeTab === "documents") return <DocumentsPanel />
    if (activeTab === "settings") return <SettingsPanel />
    return (
      <ChatView
        key={chatKey}
        initialChatId={selectedChatId}
        onChatCreated={handleChatCreated}
        onReportComplete={handleReportComplete}
        onOpenReportById={handleOpenReportById}
        userId={userId}
      />
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setOpenReport(null) }}
        chats={chats}
        activeChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        {renderMain()}
      </main>
    </div>
  )
}
