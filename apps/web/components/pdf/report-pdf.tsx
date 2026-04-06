"use client"

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { StructuredReport, Severity, Verdict, MgmtRating, MoatStrength } from "@/lib/types"

// ─── Palette ────────────────────────────────────────────────────────────────
// Institutional tone: navy, charcoal, muted accents. No amber/forge/web-app colors.

const C = {
  navy:      "#1B2A4A",
  navyLight: "#2C3E6B",
  charcoal:  "#1C1C1E",
  text:      "#2D2D2F",
  textLight: "#555558",
  textMuted: "#8A8A8E",
  rule:      "#D1D1D6",
  ruleFaint: "#E5E5EA",
  bg:        "#F8F8FA",
  bgAlt:     "#F2F2F4",
  white:     "#FFFFFF",
  green:     "#1A7A4C",
  amber:     "#A16207",
  red:       "#B91C1C",
  orange:    "#C2410C",
}

const verdictColor = (v: Verdict) =>
  v === "Favorable" ? C.green : v === "Cautious" ? C.amber : C.red

const severityColor = (s: Severity) =>
  s === "Critical" ? C.red : s === "High" ? C.orange : s === "Medium" ? C.amber : C.green

const ratingColor = (r: MgmtRating) =>
  r === "Exceptional" || r === "Strong" ? C.green : r === "Adequate" ? C.amber : C.red

const moatColor = (m: MoatStrength) =>
  m === "Strong" ? C.green : m === "Moderate" ? C.amber : m === "Weak" ? C.orange : C.red

// ─── Styles ─────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  // Page
  page: {
    paddingTop: 54,
    paddingBottom: 52,
    paddingHorizontal: 60,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: C.text,
    lineHeight: 1.55,
  },

  // ── Cover page ──
  cover: {
    padding: 0,
    fontFamily: "Helvetica",
    color: C.charcoal,
    backgroundColor: C.white,
  },
  coverTop: {
    paddingTop: 72,
    paddingHorizontal: 60,
    paddingBottom: 32,
  },
  coverFirmName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
    color: C.navy,
    textTransform: "uppercase",
    marginBottom: 48,
  },
  coverRule: {
    height: 2,
    backgroundColor: C.navy,
    marginBottom: 24,
  },
  coverTypeLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: C.textMuted,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  coverCompany: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: C.charcoal,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  coverSubline: {
    fontSize: 10.5,
    color: C.textLight,
    marginBottom: 40,
  },
  coverMeta: {
    paddingHorizontal: 60,
    paddingTop: 28,
    paddingBottom: 28,
    borderTopWidth: 0.5,
    borderTopColor: C.rule,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  coverMetaItem: {
    width: "50%",
    marginBottom: 14,
  },
  coverMetaLabel: {
    fontSize: 7.5,
    letterSpacing: 1,
    color: C.textMuted,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  coverMetaVal: {
    fontSize: 10,
    color: C.text,
  },
  coverVerdict: {
    marginHorizontal: 60,
    marginTop: 8,
    padding: 18,
    borderWidth: 0.5,
    borderColor: C.rule,
  },
  coverVerdictRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  coverVerdictLabel: {
    fontSize: 7.5,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: C.textMuted,
    fontFamily: "Helvetica-Bold",
  },
  coverVerdictVal: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  coverVerdictRationale: {
    fontSize: 9.5,
    color: C.textLight,
    lineHeight: 1.55,
  },
  coverFooter: {
    position: "absolute",
    bottom: 36,
    left: 60,
    right: 60,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: C.rule,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coverFooterText: {
    fontSize: 7,
    color: C.textMuted,
    letterSpacing: 0.3,
  },

  // ── Running header / footer ──
  header: {
    position: "absolute",
    top: 24,
    left: 60,
    right: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: C.ruleFaint,
  },
  headerText: {
    fontSize: 7,
    letterSpacing: 0.8,
    color: C.textMuted,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  headerRight: {
    fontSize: 7,
    color: C.textMuted,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 60,
    right: 60,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: C.ruleFaint,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: C.textMuted,
    letterSpacing: 0.3,
  },

  // ── Sections ──
  sectionNum: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    color: C.navy,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: C.charcoal,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  sectionRule: {
    height: 1.5,
    backgroundColor: C.navy,
    width: 32,
    marginBottom: 16,
  },
  sectionIntro: {
    fontSize: 9.5,
    color: C.textLight,
    marginBottom: 16,
    lineHeight: 1.6,
  },

  // ── Subsections ──
  subhead: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: C.charcoal,
    marginTop: 16,
    marginBottom: 6,
  },
  body: {
    fontSize: 9.5,
    color: C.text,
    lineHeight: 1.55,
    marginBottom: 6,
  },

  // ── Bullets ──
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingRight: 8,
  },
  bulletDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.navy,
    marginRight: 8,
    marginTop: 5,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: C.text,
    lineHeight: 1.55,
  },

  // ── Tables ──
  table: {
    marginVertical: 8,
  },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: C.navy,
    paddingBottom: 5,
    paddingHorizontal: 6,
  },
  tableHeadCell: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    color: C.navy,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: C.ruleFaint,
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: C.ruleFaint,
    backgroundColor: C.bg,
  },
  tableCell: {
    fontSize: 9,
    color: C.text,
    lineHeight: 1.4,
  },

  // ── Stat card (inline rating boxes) ──
  statRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderWidth: 0.5,
    borderColor: C.rule,
  },
  statLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    color: C.textMuted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  statNote: {
    fontSize: 8.5,
    color: C.textLight,
    lineHeight: 1.45,
  },

  // ── Metrics grid ──
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
    marginBottom: 12,
  },
  metricCard: {
    width: "33.333%",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  metricInner: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: C.rule,
  },
  metricLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    color: C.textMuted,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: C.charcoal,
  },
  metricNote: {
    fontSize: 7.5,
    color: C.textMuted,
    marginTop: 2,
  },

  // ── Risk / red-flag callouts ──
  redFlagRow: {
    flexDirection: "row",
    marginBottom: 5,
    padding: 8,
    borderLeftWidth: 2,
    borderLeftColor: C.red,
    backgroundColor: "#FEF2F2",
  },

  // ── Badge ──
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: C.white,
    borderRadius: 1,
  },

  // ── Thesis callout ──
  thesisBlock: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderLeftWidth: 2,
    borderLeftColor: C.navy,
    marginBottom: 16,
    backgroundColor: C.bg,
  },
  thesisText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.charcoal,
    lineHeight: 1.55,
  },

  // ── Disclaimer ──
  disclaimer: {
    fontSize: 7,
    color: C.textMuted,
    letterSpacing: 0.3,
    lineHeight: 1.6,
  },
})

// ─── Helpers ────────────────────────────────────────────────────────────────

const RunningChrome = ({ company, section }: { company: string; section: string }) => (
  <>
    <View style={s.header} fixed>
      <Text style={s.headerText}>Anvil Research  |  {section}</Text>
      <Text style={s.headerRight}>{company}</Text>
    </View>
    <View style={s.footer} fixed>
      <Text style={s.footerText}>Confidential — For Investment Analysis Only</Text>
      <Text
        style={s.footerText}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </View>
  </>
)

const Bullet = ({ text }: { text: unknown }) => {
  const val = str(text)
  if (!val) return null
  return (
    <View style={s.bulletRow}>
      <View style={s.bulletDot} />
      <Text style={s.bulletText}>{val}</Text>
    </View>
  )
}

// Wrap body text with clean() and skip empty
const Body = ({ children, muted }: { children: string; muted?: boolean }) => {
  const val = clean(children)
  if (!val) return null
  return <Text style={muted ? [s.body, { color: C.textMuted }] : s.body}>{val}</Text>
}

const Badge = ({ text, color }: { text: string; color: string }) => (
  <Text style={[s.badge, { backgroundColor: color }]}>{text}</Text>
)

const SectionHead = ({ num, title }: { num: string; title: string }) => (
  <View>
    <Text style={s.sectionNum}>Section {num}</Text>
    <Text style={s.sectionTitle}>{title}</Text>
    <View style={s.sectionRule} />
  </View>
)

// ─── Normalizer ─────────────────────────────────────────────────────────────

// Force value to array — agents sometimes return objects, strings, or nulls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const arr = (v: unknown): any[] => (Array.isArray(v) ? v : [])

// Strip markdown bold/italic markers and trim JSON artifacts that agents
// sometimes leak into text fields (e.g. `"trackRecord": "..."`, trailing `}}]`).
function clean(raw: unknown): string {
  if (raw == null) return ""
  let t = typeof raw === "string" ? raw : String(raw)
  // Remove markdown bold/italic: **text** → text, *text* → text, __text__ → text
  t = t.replace(/\*\*(.+?)\*\*/g, "$1")
  t = t.replace(/\*(.+?)\*/g, "$1")
  t = t.replace(/__(.+?)__/g, "$1")
  // Truncate at JSON structure leaking (agent concatenated fields)
  const jsonLeak = t.search(/",\s*"[a-zA-Z]+"\s*:\s*[\["{]/)
  if (jsonLeak > 20) t = t.slice(0, jsonLeak)
  // Strip trailing JSON artifacts like }}] or "}]
  t = t.replace(/["\s}\]]+$/, "").trim()
  // Strip leading JSON artifacts like ["  or {"
  t = t.replace(/^[\[{"]+\s*/, "").trim()
  return t
}

// Coerce anything (string, { text }, object) to a clean renderable string
const str = (v: unknown): string => {
  if (typeof v === "string") return clean(v)
  if (typeof v === "object" && v !== null && "text" in v) return clean(String((v as { text: unknown }).text))
  if (typeof v === "object" && v !== null) {
    // Try to extract a meaningful string from common shapes
    const o = v as Record<string, unknown>
    if (typeof o.description === "string") return clean(o.description)
    if (typeof o.name === "string") return clean(o.name)
    return clean(JSON.stringify(v))
  }
  return String(v ?? "")
}

function normalize(r: StructuredReport): StructuredReport {
  return {
    company: r.company ?? { name: "Unknown", isPublic: false, description: "" },
    executiveSummary: {
      verdict: r.executiveSummary?.verdict ?? "Cautious",
      verdictRationale: r.executiveSummary?.verdictRationale ?? "",
      thesis: r.executiveSummary?.thesis ?? "",
      keyPoints: arr(r.executiveSummary?.keyPoints),
      whatWouldChangeVerdict: r.executiveSummary?.whatWouldChangeVerdict ?? "",
    },
    financial: {
      summary: r.financial?.summary ?? "",
      keyMetrics: arr(r.financial?.keyMetrics),
      revenueHistory: arr(r.financial?.revenueHistory),
      profitability: r.financial?.profitability ?? { commentary: "" },
      balanceSheet: r.financial?.balanceSheet ?? { commentary: "" },
      cashFlow: r.financial?.cashFlow ?? { commentary: "" },
      strengths: arr(r.financial?.strengths),
      concerns: arr(r.financial?.concerns),
      dataLimitations: r.financial?.dataLimitations,
    },
    market: {
      summary: r.market?.summary ?? "",
      positioning: r.market?.positioning ?? "Niche",
      positioningRationale: r.market?.positioningRationale ?? "",
      moat: r.market?.moat ?? { strength: "None", description: "", durability: "" },
      competitors: arr(r.market?.competitors),
      tamEstimate: r.market?.tamEstimate,
      tamRationale: r.market?.tamRationale,
      marketTrends: arr(r.market?.marketTrends),
      porters: r.market?.porters ?? {
        competitiveRivalry: "",
        supplierPower: "",
        buyerPower: "",
        threatOfSubstitutes: "",
        threatOfNewEntrants: "",
      },
    },
    risk: {
      summary: r.risk?.summary ?? "",
      factors: arr(r.risk?.factors),
      redFlags: arr(r.risk?.redFlags),
      overallRiskLevel: r.risk?.overallRiskLevel ?? "Medium",
    },
    management: {
      summary: r.management?.summary ?? "",
      rating: r.management?.rating ?? "Adequate",
      ratingRationale: r.management?.ratingRationale ?? "",
      keyExecutives: arr(r.management?.keyExecutives),
      governance: r.management?.governance ?? { commentary: "" },
      compensation: r.management?.compensation ?? "",
      trackRecord: r.management?.trackRecord ?? "",
      concerns: arr(r.management?.concerns),
    },
    keyQuestions: arr(r.keyQuestions),
    sources: arr(r.sources),
    metadata: {
      generatedAt: r.metadata?.generatedAt ?? new Date().toISOString(),
      dataSources: arr(r.metadata?.dataSources),
      confidenceNote: r.metadata?.confidenceNote ?? "",
    },
  }
}

// ─── Document ───────────────────────────────────────────────────────────────

export function DDReportPDF({ report: rawReport }: { report: StructuredReport }) {
  const report = normalize(rawReport)
  const { company, executiveSummary, financial, market, risk, management, keyQuestions, metadata } = report
  const generatedDate = new Date(metadata.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Document
      title={`Due Diligence Report — ${company.name}`}
      author="Anvil Research"
      subject="Due Diligence Report"
    >
      {/* ═══════════════════════ COVER ═══════════════════════ */}
      <Page size="LETTER" style={s.cover}>
        <View style={s.coverTop}>
          <Text style={s.coverFirmName}>Anvil Research</Text>
          <View style={s.coverRule} />
          <Text style={s.coverTypeLabel}>Due Diligence Report</Text>
          <Text style={s.coverCompany}>{company.name}</Text>
          <Text style={s.coverSubline}>
            {company.isPublic ? `${company.ticker ?? "—"} · ${company.sector ?? "Public Company"}` : "Private Company"}
            {company.hq ? ` · ${company.hq}` : ""}
          </Text>
        </View>

        <View style={s.coverMeta}>
          <View style={s.coverMetaItem}>
            <Text style={s.coverMetaLabel}>Date</Text>
            <Text style={s.coverMetaVal}>{generatedDate}</Text>
          </View>
          <View style={s.coverMetaItem}>
            <Text style={s.coverMetaLabel}>Type</Text>
            <Text style={s.coverMetaVal}>{company.isPublic ? "Public (SEC Registrant)" : "Private"}</Text>
          </View>
          {company.industry && (
            <View style={s.coverMetaItem}>
              <Text style={s.coverMetaLabel}>Industry</Text>
              <Text style={s.coverMetaVal}>{company.industry}</Text>
            </View>
          )}
          {company.founded && (
            <View style={s.coverMetaItem}>
              <Text style={s.coverMetaLabel}>Founded</Text>
              <Text style={s.coverMetaVal}>{company.founded}</Text>
            </View>
          )}
          {company.employees && (
            <View style={s.coverMetaItem}>
              <Text style={s.coverMetaLabel}>Employees</Text>
              <Text style={s.coverMetaVal}>{company.employees}</Text>
            </View>
          )}
          {company.website && (
            <View style={s.coverMetaItem}>
              <Text style={s.coverMetaLabel}>Website</Text>
              <Text style={s.coverMetaVal}>{company.website}</Text>
            </View>
          )}
        </View>

        <View style={s.coverVerdict}>
          <View style={s.coverVerdictRow}>
            <Text style={s.coverVerdictLabel}>Investment Verdict</Text>
            <Text style={[s.coverVerdictVal, { color: verdictColor(executiveSummary.verdict) }]}>
              {executiveSummary.verdict}
            </Text>
          </View>
          <Text style={s.coverVerdictRationale}>{executiveSummary.verdictRationale}</Text>
        </View>

        <View style={s.coverFooter} fixed>
          <Text style={s.coverFooterText}>Confidential — For Internal Use Only</Text>
          <Text style={s.coverFooterText}>{generatedDate}</Text>
        </View>
      </Page>

      {/* ═══════════════ 1. EXECUTIVE SUMMARY ═══════════════ */}
      <Page size="LETTER" style={s.page}>
        <RunningChrome company={company.name} section="Executive Summary" />
        <SectionHead num="1" title="Executive Summary" />

        <View style={s.thesisBlock}>
          <Text style={s.thesisText}>{clean(executiveSummary.thesis)}</Text>
        </View>

        {/* Summary ratings row */}
        <View style={s.statRow}>
          <View style={s.statBox}>
            <Text style={s.statLabel}>Verdict</Text>
            <Text style={[s.statValue, { color: verdictColor(executiveSummary.verdict) }]}>{executiveSummary.verdict}</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statLabel}>Risk Level</Text>
            <Text style={[s.statValue, { color: severityColor(risk.overallRiskLevel) }]}>{risk.overallRiskLevel}</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statLabel}>Management</Text>
            <Text style={[s.statValue, { color: ratingColor(management.rating) }]}>{management.rating}</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statLabel}>Moat</Text>
            <Text style={[s.statValue, { color: moatColor(market.moat.strength) }]}>{market.moat.strength || "N/A"}</Text>
          </View>
        </View>

        <Text style={s.subhead}>Company Overview</Text>
        <Body>{company.description}</Body>

        <Text style={s.subhead}>Key Findings</Text>
        {executiveSummary.keyPoints.map((p, i) => (
          <Bullet key={i} text={p} />
        ))}

        <Text style={s.subhead}>What Would Change the Verdict</Text>
        <Body>{executiveSummary.whatWouldChangeVerdict}</Body>

        {metadata.confidenceNote && (
          <>
            <Text style={s.subhead}>Confidence Note</Text>
            <Text style={[s.body, { color: C.textMuted }]}>{clean(metadata.confidenceNote)}</Text>
          </>
        )}
      </Page>

      {/* ═══════════════ 2. FINANCIAL ANALYSIS ═══════════════ */}
      <Page size="LETTER" style={s.page}>
        <RunningChrome company={company.name} section="Financial Analysis" />
        <SectionHead num="2" title="Financial Analysis" />
        <Text style={s.sectionIntro}>{clean(financial.summary)}</Text>

        {financial.keyMetrics.length > 0 && (
          <>
            <Text style={s.subhead}>Key Metrics</Text>
            <View style={s.metricsGrid}>
              {financial.keyMetrics.map((m, i) => (
                <View key={i} style={s.metricCard}>
                  <View style={s.metricInner}>
                    <Text style={s.metricLabel}>{m.label}</Text>
                    <Text style={s.metricValue}>{m.value}</Text>
                    {m.note && <Text style={s.metricNote}>{m.note}</Text>}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {financial.revenueHistory.length > 0 && (
          <>
            <Text style={s.subhead}>Revenue History</Text>
            <View style={s.table}>
              <View style={s.tableHead}>
                <Text style={[s.tableHeadCell, { width: "30%" }]}>Period</Text>
                <Text style={[s.tableHeadCell, { width: "40%" }]}>Revenue</Text>
                <Text style={[s.tableHeadCell, { width: "30%" }]}>YoY Change</Text>
              </View>
              {financial.revenueHistory.map((r, i) => (
                <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCell, { width: "30%" }]}>{r.period}</Text>
                  <Text style={[s.tableCell, { width: "40%", fontFamily: "Helvetica-Bold" }]}>{r.value}</Text>
                  <Text style={[s.tableCell, { width: "30%" }]}>{r.yoyPct ?? "—"}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={s.subhead}>Profitability</Text>
        <Body>{financial.profitability.commentary}</Body>

        <Text style={s.subhead}>Balance Sheet</Text>
        <Body>{financial.balanceSheet.commentary}</Body>

        <Text style={s.subhead}>Cash Flow</Text>
        <Body>{financial.cashFlow.commentary}</Body>

        {financial.strengths.length > 0 && (
          <>
            <Text style={s.subhead}>Strengths</Text>
            {financial.strengths.map((x, i) => <Bullet key={i} text={x} />)}
          </>
        )}

        {financial.concerns.length > 0 && (
          <>
            <Text style={s.subhead}>Concerns</Text>
            {financial.concerns.map((x, i) => <Bullet key={i} text={x} />)}
          </>
        )}

        {financial.dataLimitations && (
          <>
            <Text style={s.subhead}>Data Limitations</Text>
            <Text style={[s.body, { color: C.textMuted }]}>{clean(financial.dataLimitations ?? "")}</Text>
          </>
        )}
      </Page>

      {/* ═══════════════ 3. MARKET & COMPETITION ═══════════════ */}
      <Page size="LETTER" style={s.page}>
        <RunningChrome company={company.name} section="Market & Competition" />
        <SectionHead num="3" title="Market & Competitive Landscape" />
        <Text style={s.sectionIntro}>{clean(market.summary)}</Text>

        <View style={s.statRow}>
          <View style={s.statBox}>
            <Text style={s.statLabel}>Market Positioning</Text>
            <Text style={[s.statValue, { color: C.navy }]}>{market.positioning}</Text>
            <Text style={s.statNote}>{clean(market.positioningRationale)}</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statLabel}>Competitive Moat</Text>
            <Text style={[s.statValue, { color: moatColor(market.moat.strength) }]}>{market.moat.strength || "N/A"}</Text>
            <Text style={s.statNote}>{clean(market.moat.description)}</Text>
          </View>
        </View>

        <Text style={s.subhead}>Moat Durability</Text>
        <Body>{market.moat.durability}</Body>

        {market.competitors.length > 0 && (
          <>
            <Text style={s.subhead}>Competitive Set</Text>
            <View style={s.table}>
              <View style={s.tableHead}>
                <Text style={[s.tableHeadCell, { width: "25%" }]}>Competitor</Text>
                <Text style={[s.tableHeadCell, { width: "75%" }]}>Relative Positioning</Text>
              </View>
              {market.competitors.map((c, i) => (
                <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCell, { width: "25%", fontFamily: "Helvetica-Bold" }]}>{c.name}</Text>
                  <Text style={[s.tableCell, { width: "75%" }]}>{clean(c.relativePositioning ?? "")}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {market.tamEstimate && (
          <>
            <Text style={s.subhead}>Total Addressable Market</Text>
            <Text style={s.body}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{clean(String(market.tamEstimate))}</Text>
              {market.tamRationale ? ` — ${clean(market.tamRationale)}` : ""}
            </Text>
          </>
        )}

        {market.marketTrends.length > 0 && (
          <>
            <Text style={s.subhead}>Market Trends</Text>
            {market.marketTrends.map((t, i) => <Bullet key={i} text={t} />)}
          </>
        )}

        {(() => {
          const forces = [
            ["Competitive Rivalry", market.porters.competitiveRivalry],
            ["Supplier Power", market.porters.supplierPower],
            ["Buyer Power", market.porters.buyerPower],
            ["Threat of Substitutes", market.porters.threatOfSubstitutes],
            ["Threat of New Entrants", market.porters.threatOfNewEntrants],
          ].filter(([, val]) => clean(String(val ?? "")))
          if (!forces.length) return null
          return (
            <>
              <Text style={s.subhead}>Porter&apos;s Five Forces</Text>
              <View style={s.table}>
                <View style={s.tableHead}>
                  <Text style={[s.tableHeadCell, { width: "30%" }]}>Force</Text>
                  <Text style={[s.tableHeadCell, { width: "70%" }]}>Assessment</Text>
                </View>
                {forces.map(([name, val], i) => (
                  <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                    <Text style={[s.tableCell, { width: "30%", fontFamily: "Helvetica-Bold" }]}>{name}</Text>
                    <Text style={[s.tableCell, { width: "70%" }]}>{clean(String(val ?? ""))}</Text>
                  </View>
                ))}
              </View>
            </>
          )
        })()}
      </Page>

      {/* ═══════════════ 4. RISK ASSESSMENT ═══════════════ */}
      <Page size="LETTER" style={s.page}>
        <RunningChrome company={company.name} section="Risk Assessment" />
        <SectionHead num="4" title="Risk Assessment" />
        <Text style={s.sectionIntro}>{clean(risk.summary)}</Text>

        <View style={[s.statRow, { gap: 0 }]}>
          <View style={[s.statBox, { flex: 0, width: 140 }]}>
            <Text style={s.statLabel}>Overall Risk</Text>
            <Badge text={risk.overallRiskLevel} color={severityColor(risk.overallRiskLevel)} />
          </View>
        </View>

        {risk.factors.length > 0 && (
          <>
            <Text style={s.subhead}>Risk Factor Matrix</Text>
            <View style={s.table}>
              <View style={s.tableHead}>
                <Text style={[s.tableHeadCell, { width: "18%" }]}>Category</Text>
                <Text style={[s.tableHeadCell, { width: "22%" }]}>Risk</Text>
                <Text style={[s.tableHeadCell, { width: "12%" }]}>Severity</Text>
                <Text style={[s.tableHeadCell, { width: "48%" }]}>Description</Text>
              </View>
              {risk.factors.map((f, i) => (
                <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCell, { width: "18%", fontSize: 8.5 }]}>{f.category}</Text>
                  <Text style={[s.tableCell, { width: "22%", fontFamily: "Helvetica-Bold", fontSize: 8.5 }]}>{f.name}</Text>
                  <View style={{ width: "12%", justifyContent: "center" }}>
                    <Badge text={f.severity} color={severityColor(f.severity)} />
                  </View>
                  <Text style={[s.tableCell, { width: "48%", fontSize: 8.5 }]}>{clean(f.description)}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {risk.redFlags.length > 0 && (
          <>
            <Text style={s.subhead}>Red Flags</Text>
            {risk.redFlags.map((r, i) => (
              <View key={i} style={s.redFlagRow}>
                <Text style={s.bulletText}>{str(r)}</Text>
              </View>
            ))}
          </>
        )}
      </Page>

      {/* ═══════════════ 5. MANAGEMENT ═══════════════ */}
      <Page size="LETTER" style={s.page}>
        <RunningChrome company={company.name} section="Management & Governance" />
        <SectionHead num="5" title="Management & Governance" />
        <Text style={s.sectionIntro}>{clean(management.summary)}</Text>

        <View style={s.statRow}>
          <View style={s.statBox}>
            <Text style={s.statLabel}>Management Rating</Text>
            <Text style={[s.statValue, { color: ratingColor(management.rating) }]}>{management.rating}</Text>
            <Text style={s.statNote}>{clean(management.ratingRationale)}</Text>
          </View>
        </View>

        {management.keyExecutives.length > 0 && (
          <>
            <Text style={s.subhead}>Key Executives</Text>
            <View style={s.table}>
              <View style={s.tableHead}>
                <Text style={[s.tableHeadCell, { width: "22%" }]}>Name</Text>
                <Text style={[s.tableHeadCell, { width: "20%" }]}>Title</Text>
                <Text style={[s.tableHeadCell, { width: "10%" }]}>Tenure</Text>
                <Text style={[s.tableHeadCell, { width: "48%" }]}>Background</Text>
              </View>
              {management.keyExecutives.map((e, i) => (
                <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCell, { width: "22%", fontFamily: "Helvetica-Bold", fontSize: 8.5 }]}>{e.name}</Text>
                  <Text style={[s.tableCell, { width: "20%", fontSize: 8.5 }]}>{e.title}</Text>
                  <Text style={[s.tableCell, { width: "10%", fontSize: 8.5 }]}>{e.tenure ?? "—"}</Text>
                  <Text style={[s.tableCell, { width: "48%", fontSize: 8.5 }]}>{clean(e.background)}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={s.subhead}>Governance</Text>
        <Body>{management.governance.commentary}</Body>

        <Text style={s.subhead}>Compensation Alignment</Text>
        <Body>{management.compensation}</Body>

        <Text style={s.subhead}>Track Record</Text>
        <Body>{management.trackRecord}</Body>

        {management.concerns.length > 0 && (
          <>
            <Text style={s.subhead}>Concerns</Text>
            {management.concerns.map((c, i) => <Bullet key={i} text={c} />)}
          </>
        )}
      </Page>

      {/* ═══════════════ 6. KEY QUESTIONS & APPENDIX ═══════════════ */}
      <Page size="LETTER" style={s.page}>
        <RunningChrome company={company.name} section="Key Questions" />
        <SectionHead num="6" title="Key Questions for Management" />
        <Text style={s.sectionIntro}>
          Critical questions an investor should address with management before committing capital.
        </Text>

        {keyQuestions.map((q, i) => (
          <View key={i} style={{ flexDirection: "row", marginBottom: 10 }}>
            <Text style={{ width: 24, fontSize: 9.5, fontFamily: "Helvetica-Bold", color: C.navy }}>
              {i + 1}.
            </Text>
            <Text style={{ flex: 1, fontSize: 9.5, color: C.text, lineHeight: 1.55 }}>{str(q)}</Text>
          </View>
        ))}

        <View style={{ marginTop: 28, paddingTop: 14, borderTopWidth: 0.5, borderTopColor: C.rule }}>
          <Text style={s.subhead}>Methodology & Sources</Text>
          <Text style={s.body}>
            This report synthesizes data from the following sources:
          </Text>
          {metadata.dataSources.map((x, i) => <Bullet key={i} text={x} />)}
          {metadata.confidenceNote && (
            <Text style={[s.body, { marginTop: 10, color: C.textMuted }]}>{metadata.confidenceNote}</Text>
          )}
        </View>

        <View style={{ marginTop: 24, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: C.rule }}>
          <Text style={s.disclaimer}>
            DISCLAIMER — This report was prepared by Anvil Research for informational purposes only. It does not
            constitute investment advice, a recommendation, or an offer to buy or sell securities. Information herein
            is derived from sources believed to be reliable but is not guaranteed as to accuracy or completeness.
            Recipients should conduct their own independent due diligence and consult with qualified financial,
            legal, and tax advisors before making investment decisions. Past performance is not indicative of future
            results. Anvil Research assumes no liability for actions taken based on this report.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
