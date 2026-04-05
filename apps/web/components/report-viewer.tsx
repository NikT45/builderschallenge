"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { DDReportPDF } from "@/components/pdf/report-pdf"
import type { DDReport, Severity, Verdict, MgmtRating, MoatStrength } from "@/lib/types"

// PDFDownloadLink needs to be client-only
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
)

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  { ssr: false, loading: () => <PDFLoading /> }
)

function PDFLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <p className="font-mono text-[10px] text-muted-foreground">Rendering PDF…</p>
      </div>
    </div>
  )
}

interface ReportViewerProps {
  report: DDReport
}

type Tab = "pdf" | "summary"

export function ReportViewer({ report }: ReportViewerProps) {
  const [tab, setTab] = useState<Tab>("pdf")
  const r = report.report
  const filename = `Anvil-DD-${r.company.name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-border bg-card px-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-[13px] font-semibold text-foreground">{r.company.name}</h1>
            <VerdictPill verdict={r.executiveSummary.verdict} />
            {r.company.isPublic && r.company.ticker && (
              <span className="rounded-[3px] border border-border bg-muted px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                {r.company.ticker}
              </span>
            )}
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">
            {r.company.isPublic ? "Public" : "Private"} ·{" "}
            {new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="flex items-center rounded-[5px] border border-border bg-background p-0.5">
            <TabBtn active={tab === "pdf"} onClick={() => setTab("pdf")}>PDF</TabBtn>
            <TabBtn active={tab === "summary"} onClick={() => setTab("summary")}>Summary</TabBtn>
          </div>

          {/* Download */}
          <PDFDownloadLink
            document={<DDReportPDF report={r} />}
            fileName={filename}
            className="rounded-[5px] bg-primary px-3 py-1.5 font-mono text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-80"
          >
            {({ loading }) => (loading ? "Preparing…" : "Download PDF")}
          </PDFDownloadLink>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden bg-muted/30">
        {tab === "pdf" ? (
          <PDFViewer width="100%" height="100%" style={{ border: "none" }} showToolbar={false}>
            <DDReportPDF report={r} />
          </PDFViewer>
        ) : (
          <SummaryView report={r} />
        )}
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-[4px] px-2.5 py-1 font-mono text-[10px] font-medium transition-colors",
        active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

// ─── On-screen Summary view (quick scan) ─────────────────────────────────────

function SummaryView({ report }: { report: import("@/lib/types").StructuredReport }) {
  const { company, executiveSummary, financial, market, risk, management, keyQuestions } = report

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-8 py-8">
        {/* Exec Summary Hero */}
        <div className={cn(
          "rounded-[8px] border-l-2 bg-card p-5 shadow-sm",
          verdictBorderClass(executiveSummary.verdict)
        )}>
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
            Investment Thesis
          </p>
          <p className="mt-2 text-[15px] font-medium italic leading-relaxed text-foreground">
            &ldquo;{executiveSummary.thesis}&rdquo;
          </p>
        </div>

        {/* Section grid */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <StatCard
            label="Verdict"
            value={executiveSummary.verdict}
            color={verdictTextClass(executiveSummary.verdict)}
          />
          <StatCard label="Risk Level" value={risk.overallRiskLevel} color={severityTextClass(risk.overallRiskLevel)} />
          <StatCard label="Management" value={management.rating} color={mgmtTextClass(management.rating)} />
          <StatCard label="Moat" value={market.moat.strength} color={moatTextClass(market.moat.strength)} />
        </div>

        {/* Key Findings */}
        <Section title="Key Findings">
          <ul className="space-y-2">
            {executiveSummary.keyPoints.map((pt, i) => (
              <li key={i} className="flex gap-3 text-[13px] text-foreground/90">
                <span className="shrink-0 text-primary">▸</span>
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Financial snapshot */}
        {financial.keyMetrics.length > 0 && (
          <Section title="Financial Snapshot">
            <div className="grid grid-cols-3 gap-3">
              {financial.keyMetrics.slice(0, 6).map((m, i) => (
                <div key={i} className="rounded-[6px] border-l-2 border-primary bg-muted/40 px-3 py-2">
                  <p className="font-mono text-[9px] uppercase tracking-wide text-muted-foreground">{m.label}</p>
                  <p className="mt-0.5 font-mono text-[15px] font-bold text-foreground">{m.value}</p>
                  {m.note && <p className="mt-0.5 text-[10px] text-muted-foreground">{m.note}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Top risks */}
        {risk.factors.length > 0 && (
          <Section title="Top Risks">
            <div className="space-y-1.5">
              {risk.factors
                .slice()
                .sort((a, b) => severityWeight(b.severity) - severityWeight(a.severity))
                .slice(0, 5)
                .map((f, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-[5px] border border-border bg-card px-3 py-2">
                    <SeverityBadge severity={f.severity} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-foreground">{f.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{f.description}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
                      {f.category}
                    </span>
                  </div>
                ))}
            </div>
          </Section>
        )}

        {/* Key questions */}
        <Section title="Key Questions for Management">
          <ol className="space-y-2.5">
            {keyQuestions.map((q, i) => (
              <li key={i} className="flex gap-3 text-[13px] text-foreground/90">
                <span className="shrink-0 font-mono text-[12px] font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* Meta */}
        <div className="mt-10 border-t border-border pt-4">
          <p className="font-mono text-[9px] italic text-muted-foreground">
            {report.metadata.confidenceNote}
          </p>
          <p className="mt-1 font-mono text-[9px] text-muted-foreground/60">
            Sources: {report.metadata.dataSources.join(" · ")}
          </p>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{title}</h2>
      {children}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-[6px] border border-border bg-card px-3 py-2.5">
      <p className="font-mono text-[9px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 text-[16px] font-bold", color)}>{value}</p>
    </div>
  )
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  return (
    <span className={cn("rounded-[3px] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide", verdictBgClass(verdict))}>
      {verdict}
    </span>
  )
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn("shrink-0 rounded-[3px] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-white", severityBgClass(severity))}>
      {severity}
    </span>
  )
}

// ─── Color helpers ────────────────────────────────────────────────────────────

const verdictBgClass = (v: Verdict) =>
  v === "Favorable" ? "bg-green-600 text-white" :
  v === "Cautious" ? "bg-amber-600 text-white" :
  "bg-red-600 text-white"

const verdictBorderClass = (v: Verdict) =>
  v === "Favorable" ? "border-green-600" :
  v === "Cautious" ? "border-amber-600" :
  "border-red-600"

const verdictTextClass = (v: Verdict) =>
  v === "Favorable" ? "text-green-600" :
  v === "Cautious" ? "text-amber-600" :
  "text-red-600"

const severityBgClass = (s: Severity) =>
  s === "Critical" ? "bg-red-600" :
  s === "High" ? "bg-orange-600" :
  s === "Medium" ? "bg-amber-600" :
  "bg-green-600"

const severityTextClass = (s: Severity) =>
  s === "Critical" ? "text-red-600" :
  s === "High" ? "text-orange-600" :
  s === "Medium" ? "text-amber-600" :
  "text-green-600"

const severityWeight = (s: Severity) =>
  s === "Critical" ? 4 : s === "High" ? 3 : s === "Medium" ? 2 : 1

const mgmtTextClass = (r: MgmtRating) =>
  r === "Exceptional" ? "text-green-600" :
  r === "Strong" ? "text-green-600" :
  r === "Adequate" ? "text-amber-600" :
  "text-red-600"

const moatTextClass = (m: MoatStrength) =>
  m === "Strong" ? "text-green-600" :
  m === "Moderate" ? "text-amber-600" :
  m === "Weak" ? "text-orange-600" :
  "text-red-600"
