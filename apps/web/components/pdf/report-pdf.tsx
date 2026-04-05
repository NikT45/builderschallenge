"use client"

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import type { StructuredReport, Severity, Verdict, MgmtRating, MoatStrength } from "@/lib/types"

// ─── Typography ──────────────────────────────────────────────────────────────

let fontsRegistered = false
function ensureFonts() {
  if (fontsRegistered) return
  fontsRegistered = true
  Font.register({
    family: "Inter",
    fonts: [
      { src: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf", fontWeight: 400 },
      { src: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.ttf", fontWeight: 500 },
      { src: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7SUc.ttf", fontWeight: 600 },
      { src: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa05L7SUc.ttf", fontWeight: 700 },
    ],
  })
  Font.register({
    family: "JetBrainsMono",
    src: "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTPw.ttf",
  })
}

// ─── Brand palette ───────────────────────────────────────────────────────────

const COLORS = {
  ink: "#0A0A0A",
  charcoal: "#1F1F1F",
  gray900: "#171717",
  gray700: "#404040",
  gray500: "#737373",
  gray400: "#A3A3A3",
  gray300: "#D4D4D4",
  gray200: "#E5E5E5",
  gray100: "#F5F5F5",
  gray50: "#FAFAFA",
  accent: "#D97706", // amber-600 (anvil/forge tone)
  accentDark: "#92400E",
  green: "#059669",
  red: "#DC2626",
  amber: "#D97706",
  blue: "#2563EB",
  white: "#FFFFFF",
}

const verdictColor = (v: Verdict) =>
  v === "Favorable" ? COLORS.green : v === "Cautious" ? COLORS.amber : COLORS.red

const severityColor = (s: Severity) =>
  s === "Critical" ? COLORS.red :
  s === "High" ? "#EA580C" :
  s === "Medium" ? COLORS.amber :
  COLORS.green

const ratingColor = (r: MgmtRating) =>
  r === "Exceptional" ? COLORS.green :
  r === "Strong" ? "#16A34A" :
  r === "Adequate" ? COLORS.amber :
  COLORS.red

const moatColor = (m: MoatStrength) =>
  m === "Strong" ? COLORS.green :
  m === "Moderate" ? COLORS.amber :
  m === "Weak" ? "#EA580C" :
  COLORS.red

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 56,
    fontFamily: "Inter",
    fontSize: 9.5,
    color: COLORS.gray900,
    lineHeight: 1.5,
  },
  // Cover
  coverPage: {
    padding: 0,
    fontFamily: "Inter",
    color: COLORS.ink,
    backgroundColor: COLORS.white,
  },
  coverHeader: {
    backgroundColor: COLORS.ink,
    paddingTop: 48,
    paddingHorizontal: 56,
    paddingBottom: 40,
    color: COLORS.white,
  },
  coverBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  coverBrandMark: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.accent,
    color: COLORS.ink,
    fontSize: 11,
    fontWeight: 700,
    textAlign: "center",
    paddingTop: 3,
  },
  coverBrandText: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 2,
    color: COLORS.white,
  },
  coverBrandTag: {
    fontSize: 8,
    fontWeight: 400,
    color: COLORS.gray400,
    marginLeft: 8,
    letterSpacing: 1,
  },
  coverLabel: {
    fontSize: 8,
    fontWeight: 500,
    letterSpacing: 2,
    color: COLORS.accent,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  coverCompanyName: {
    fontSize: 34,
    fontWeight: 700,
    color: COLORS.white,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  coverSub: {
    fontSize: 11,
    color: COLORS.gray300,
    marginBottom: 0,
  },
  coverBody: {
    paddingHorizontal: 56,
    paddingTop: 40,
    paddingBottom: 40,
  },
  coverMetaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    marginBottom: 32,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.gray300,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray300,
    paddingTop: 16,
    paddingBottom: 16,
  },
  coverMetaItem: {
    width: "50%",
    marginBottom: 12,
  },
  coverMetaLabel: {
    fontSize: 7,
    letterSpacing: 1.2,
    color: COLORS.gray500,
    textTransform: "uppercase",
    fontWeight: 600,
    marginBottom: 3,
  },
  coverMetaValue: {
    fontSize: 11,
    color: COLORS.gray900,
    fontWeight: 500,
  },
  verdictCard: {
    marginTop: 24,
    padding: 20,
    borderLeftWidth: 3,
    backgroundColor: COLORS.gray50,
  },
  verdictLabel: {
    fontSize: 7,
    letterSpacing: 1.2,
    color: COLORS.gray500,
    textTransform: "uppercase",
    fontWeight: 600,
    marginBottom: 6,
  },
  verdictText: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  verdictRationale: {
    fontSize: 10,
    color: COLORS.gray700,
    lineHeight: 1.6,
  },
  coverFooter: {
    position: "absolute",
    bottom: 32,
    left: 56,
    right: 56,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.gray300,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coverFooterText: {
    fontSize: 7,
    color: COLORS.gray500,
    letterSpacing: 0.5,
  },

  // Standard page header/footer
  pageHeader: {
    position: "absolute",
    top: 22,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray200,
  },
  pageHeaderLeft: {
    fontSize: 7,
    letterSpacing: 1.2,
    color: COLORS.gray500,
    fontWeight: 600,
    textTransform: "uppercase",
  },
  pageHeaderRight: {
    fontSize: 7,
    color: COLORS.gray400,
    fontFamily: "JetBrainsMono",
  },
  pageFooter: {
    position: "absolute",
    bottom: 22,
    left: 56,
    right: 56,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.gray200,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pageFooterText: {
    fontSize: 7,
    color: COLORS.gray500,
    letterSpacing: 0.5,
  },

  // Sections
  sectionNumber: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: COLORS.accent,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: COLORS.ink,
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  sectionIntro: {
    fontSize: 9.5,
    color: COLORS.gray700,
    marginBottom: 14,
    lineHeight: 1.6,
  },

  // Subsection
  subhead: {
    fontSize: 10,
    fontWeight: 600,
    color: COLORS.ink,
    marginTop: 14,
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  body: {
    fontSize: 9.5,
    color: COLORS.gray700,
    lineHeight: 1.55,
    marginBottom: 4,
  },

  // Lists
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingRight: 4,
  },
  bullet: {
    fontSize: 9.5,
    color: COLORS.accent,
    marginRight: 6,
    fontWeight: 700,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: COLORS.gray700,
    lineHeight: 1.55,
  },

  // Tables
  table: {
    marginVertical: 8,
    borderRadius: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.ink,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 7.5,
    letterSpacing: 0.8,
    color: COLORS.white,
    fontWeight: 600,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray200,
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray200,
    backgroundColor: COLORS.gray50,
  },
  tableCell: {
    fontSize: 9,
    color: COLORS.gray900,
    lineHeight: 1.4,
  },

  // Badges
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 2,
    fontSize: 7,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Key metrics grid
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
    marginBottom: 12,
  },
  metricCard: {
    width: "33.333%",
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  metricInner: {
    padding: 10,
    backgroundColor: COLORS.gray50,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.accent,
  },
  metricLabel: {
    fontSize: 7,
    letterSpacing: 0.8,
    color: COLORS.gray500,
    textTransform: "uppercase",
    fontWeight: 600,
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 13,
    color: COLORS.ink,
    fontWeight: 700,
    fontFamily: "JetBrainsMono",
  },
  metricNote: {
    fontSize: 7.5,
    color: COLORS.gray500,
    marginTop: 2,
  },

  // Executive summary
  execBlock: {
    padding: 14,
    backgroundColor: COLORS.gray50,
    borderLeftWidth: 2,
    marginBottom: 14,
  },
  execThesis: {
    fontSize: 11,
    color: COLORS.ink,
    fontWeight: 500,
    lineHeight: 1.5,
    marginBottom: 8,
    fontStyle: "italic",
  },
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

const Header = ({ company, section }: { company: string; section: string }) => (
  <>
    <View style={styles.pageHeader} fixed>
      <Text style={styles.pageHeaderLeft}>ANVIL · {section}</Text>
      <Text style={styles.pageHeaderRight}>{company}</Text>
    </View>
    <View style={styles.pageFooter} fixed>
      <Text style={styles.pageFooterText}>CONFIDENTIAL · FOR INVESTMENT ANALYSIS</Text>
      <Text
        style={styles.pageFooterText}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  </>
)

const Bullet = ({ children }: { children: string }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bullet}>▸</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
)

const Badge = ({ text, color }: { text: string; color: string }) => (
  <Text style={[styles.badge, { backgroundColor: color, color: COLORS.white }]}>{text}</Text>
)

const SectionHeading = ({ number, title }: { number: string; title: string }) => (
  <View>
    <Text style={styles.sectionNumber}>Section {number}</Text>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
)

// ─── Main Document ───────────────────────────────────────────────────────────

// Defensive normalizer — guarantees all arrays/objects exist before rendering.
// Agents submitting partial data or old-schema reports shouldn't crash the PDF.
function normalize(r: StructuredReport): StructuredReport {
  return {
    company: r.company ?? { name: "Unknown", isPublic: false, description: "" },
    executiveSummary: {
      verdict: r.executiveSummary?.verdict ?? "Cautious",
      verdictRationale: r.executiveSummary?.verdictRationale ?? "",
      thesis: r.executiveSummary?.thesis ?? "",
      keyPoints: r.executiveSummary?.keyPoints ?? [],
      whatWouldChangeVerdict: r.executiveSummary?.whatWouldChangeVerdict ?? "",
    },
    financial: {
      summary: r.financial?.summary ?? "",
      keyMetrics: r.financial?.keyMetrics ?? [],
      revenueHistory: r.financial?.revenueHistory ?? [],
      profitability: r.financial?.profitability ?? { commentary: "" },
      balanceSheet: r.financial?.balanceSheet ?? { commentary: "" },
      cashFlow: r.financial?.cashFlow ?? { commentary: "" },
      strengths: r.financial?.strengths ?? [],
      concerns: r.financial?.concerns ?? [],
      dataLimitations: r.financial?.dataLimitations,
    },
    market: {
      summary: r.market?.summary ?? "",
      positioning: r.market?.positioning ?? "Niche",
      positioningRationale: r.market?.positioningRationale ?? "",
      moat: r.market?.moat ?? { strength: "None", description: "", durability: "" },
      competitors: r.market?.competitors ?? [],
      tamEstimate: r.market?.tamEstimate,
      tamRationale: r.market?.tamRationale,
      marketTrends: r.market?.marketTrends ?? [],
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
      factors: r.risk?.factors ?? [],
      redFlags: r.risk?.redFlags ?? [],
      overallRiskLevel: r.risk?.overallRiskLevel ?? "Medium",
    },
    management: {
      summary: r.management?.summary ?? "",
      rating: r.management?.rating ?? "Adequate",
      ratingRationale: r.management?.ratingRationale ?? "",
      keyExecutives: r.management?.keyExecutives ?? [],
      governance: r.management?.governance ?? { commentary: "" },
      compensation: r.management?.compensation ?? "",
      trackRecord: r.management?.trackRecord ?? "",
      concerns: r.management?.concerns ?? [],
    },
    keyQuestions: r.keyQuestions ?? [],
    sources: r.sources ?? [],
    metadata: r.metadata ?? {
      generatedAt: new Date().toISOString(),
      dataSources: [],
      confidenceNote: "",
    },
  }
}

export function DDReportPDF({ report: rawReport }: { report: StructuredReport }) {
  ensureFonts()
  const report = normalize(rawReport)
  const { company, executiveSummary, financial, market, risk, management, keyQuestions, metadata } = report
  const generatedDate = new Date(metadata.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Document
      title={`Anvil DD Report — ${company.name}`}
      author="Anvil AI Research"
      subject="Due Diligence Report"
    >
      {/* ═══ COVER PAGE ═══ */}
      <Page size="LETTER" style={styles.coverPage}>
        <View style={styles.coverHeader}>
          <View style={styles.coverBrand}>
            <Text style={styles.coverBrandMark}>⬡</Text>
            <Text style={styles.coverBrandText}>ANVIL</Text>
            <Text style={styles.coverBrandTag}>AI RESEARCH</Text>
          </View>
          <Text style={styles.coverLabel}>Due Diligence Report</Text>
          <Text style={styles.coverCompanyName}>{company.name}</Text>
          <Text style={styles.coverSub}>
            {company.isPublic ? `${company.ticker ?? ""} · ${company.sector ?? "Public Company"}` : "Private Company"}
            {company.hq ? ` · ${company.hq}` : ""}
          </Text>
        </View>

        <View style={styles.coverBody}>
          <View style={styles.coverMetaGrid}>
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaLabel}>Generated</Text>
              <Text style={styles.coverMetaValue}>{generatedDate}</Text>
            </View>
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaLabel}>Company Type</Text>
              <Text style={styles.coverMetaValue}>{company.isPublic ? "Public (SEC Registrant)" : "Private"}</Text>
            </View>
            {company.founded && (
              <View style={styles.coverMetaItem}>
                <Text style={styles.coverMetaLabel}>Founded</Text>
                <Text style={styles.coverMetaValue}>{company.founded}</Text>
              </View>
            )}
            {company.employees && (
              <View style={styles.coverMetaItem}>
                <Text style={styles.coverMetaLabel}>Employees</Text>
                <Text style={styles.coverMetaValue}>{company.employees}</Text>
              </View>
            )}
            {company.industry && (
              <View style={styles.coverMetaItem}>
                <Text style={styles.coverMetaLabel}>Industry</Text>
                <Text style={styles.coverMetaValue}>{company.industry}</Text>
              </View>
            )}
            {company.website && (
              <View style={styles.coverMetaItem}>
                <Text style={styles.coverMetaLabel}>Website</Text>
                <Text style={styles.coverMetaValue}>{company.website}</Text>
              </View>
            )}
          </View>

          <View style={[styles.verdictCard, { borderLeftColor: verdictColor(executiveSummary.verdict) }]}>
            <Text style={styles.verdictLabel}>Investment Verdict</Text>
            <Text style={[styles.verdictText, { color: verdictColor(executiveSummary.verdict) }]}>
              {executiveSummary.verdict.toUpperCase()}
            </Text>
            <Text style={styles.verdictRationale}>{executiveSummary.verdictRationale}</Text>
          </View>
        </View>

        <View style={styles.coverFooter} fixed>
          <Text style={styles.coverFooterText}>CONFIDENTIAL — FOR INTERNAL USE</Text>
          <Text style={styles.coverFooterText}>{metadata.dataSources.join(" · ").toUpperCase()}</Text>
        </View>
      </Page>

      {/* ═══ EXECUTIVE SUMMARY ═══ */}
      <Page size="LETTER" style={styles.page}>
        <Header company={company.name} section="Executive Summary" />
        <SectionHeading number="01" title="Executive Summary" />

        <View style={[styles.execBlock, { borderLeftColor: verdictColor(executiveSummary.verdict) }]}>
          <Text style={styles.execThesis}>&ldquo;{executiveSummary.thesis}&rdquo;</Text>
        </View>

        <Text style={styles.subhead}>Company Overview</Text>
        <Text style={styles.body}>{company.description}</Text>

        <Text style={styles.subhead}>Key Findings</Text>
        {executiveSummary.keyPoints.map((point, i) => (
          <Bullet key={i}>{point}</Bullet>
        ))}

        <Text style={styles.subhead}>What Would Change the Verdict</Text>
        <Text style={styles.body}>{executiveSummary.whatWouldChangeVerdict}</Text>

        <Text style={styles.subhead}>Confidence Note</Text>
        <Text style={[styles.body, { fontStyle: "italic", color: COLORS.gray500 }]}>{metadata.confidenceNote}</Text>
      </Page>

      {/* ═══ FINANCIAL ANALYSIS ═══ */}
      <Page size="LETTER" style={styles.page}>
        <Header company={company.name} section="Financial Analysis" />
        <SectionHeading number="02" title="Financial Analysis" />
        <Text style={styles.sectionIntro}>{financial.summary}</Text>

        {financial.keyMetrics.length > 0 && (
          <>
            <Text style={styles.subhead}>Key Metrics</Text>
            <View style={styles.metricsGrid}>
              {financial.keyMetrics.map((m, i) => (
                <View key={i} style={styles.metricCard}>
                  <View style={styles.metricInner}>
                    <Text style={styles.metricLabel}>{m.label}</Text>
                    <Text style={styles.metricValue}>{m.value}</Text>
                    {m.note && <Text style={styles.metricNote}>{m.note}</Text>}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {financial.revenueHistory.length > 0 && (
          <>
            <Text style={styles.subhead}>Revenue History</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: "30%" }]}>Period</Text>
                <Text style={[styles.tableHeaderCell, { width: "40%" }]}>Revenue</Text>
                <Text style={[styles.tableHeaderCell, { width: "30%" }]}>YoY</Text>
              </View>
              {financial.revenueHistory.map((r, i) => (
                <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={[styles.tableCell, { width: "30%" }]}>{r.period}</Text>
                  <Text style={[styles.tableCell, { width: "40%", fontFamily: "JetBrainsMono" }]}>{r.value}</Text>
                  <Text style={[styles.tableCell, { width: "30%", fontFamily: "JetBrainsMono" }]}>{r.yoyPct ?? "—"}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.subhead}>Profitability</Text>
        <Text style={styles.body}>{financial.profitability.commentary}</Text>

        <Text style={styles.subhead}>Balance Sheet</Text>
        <Text style={styles.body}>{financial.balanceSheet.commentary}</Text>

        <Text style={styles.subhead}>Cash Flow</Text>
        <Text style={styles.body}>{financial.cashFlow.commentary}</Text>

        {financial.strengths.length > 0 && (
          <>
            <Text style={styles.subhead}>Financial Strengths</Text>
            {financial.strengths.map((s, i) => <Bullet key={i}>{s}</Bullet>)}
          </>
        )}

        {financial.concerns.length > 0 && (
          <>
            <Text style={styles.subhead}>Financial Concerns</Text>
            {financial.concerns.map((s, i) => <Bullet key={i}>{s}</Bullet>)}
          </>
        )}

        {financial.dataLimitations && (
          <>
            <Text style={styles.subhead}>Data Limitations</Text>
            <Text style={[styles.body, { fontStyle: "italic", color: COLORS.gray500 }]}>{financial.dataLimitations}</Text>
          </>
        )}
      </Page>

      {/* ═══ MARKET & COMPETITION ═══ */}
      <Page size="LETTER" style={styles.page}>
        <Header company={company.name} section="Market & Competition" />
        <SectionHeading number="03" title="Market & Competitive Landscape" />
        <Text style={styles.sectionIntro}>{market.summary}</Text>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
          <View style={{ flex: 1, padding: 10, backgroundColor: COLORS.gray50, borderLeftWidth: 2, borderLeftColor: COLORS.blue }}>
            <Text style={styles.metricLabel}>Positioning</Text>
            <Text style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginTop: 2 }}>{market.positioning}</Text>
            <Text style={[styles.body, { marginTop: 4, fontSize: 8.5 }]}>{market.positioningRationale}</Text>
          </View>
          <View style={{ flex: 1, padding: 10, backgroundColor: COLORS.gray50, borderLeftWidth: 2, borderLeftColor: moatColor(market.moat.strength) }}>
            <Text style={styles.metricLabel}>Moat</Text>
            <Text style={{ fontSize: 13, fontWeight: 700, color: moatColor(market.moat.strength), marginTop: 2 }}>{market.moat.strength}</Text>
            <Text style={[styles.body, { marginTop: 4, fontSize: 8.5 }]}>{market.moat.description}</Text>
          </View>
        </View>

        <Text style={styles.subhead}>Moat Durability</Text>
        <Text style={styles.body}>{market.moat.durability}</Text>

        {market.competitors.length > 0 && (
          <>
            <Text style={styles.subhead}>Competitive Set</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: "28%" }]}>Competitor</Text>
                <Text style={[styles.tableHeaderCell, { width: "72%" }]}>Relative Positioning</Text>
              </View>
              {market.competitors.map((c, i) => (
                <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={[styles.tableCell, { width: "28%", fontWeight: 600 }]}>{c.name}</Text>
                  <Text style={[styles.tableCell, { width: "72%" }]}>{c.relativePositioning}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {market.tamEstimate && (
          <>
            <Text style={styles.subhead}>Total Addressable Market</Text>
            <Text style={styles.body}>
              <Text style={{ fontWeight: 700, fontFamily: "JetBrainsMono" }}>{market.tamEstimate}</Text>
              {market.tamRationale ? ` — ${market.tamRationale}` : ""}
            </Text>
          </>
        )}

        <Text style={styles.subhead}>Market Trends</Text>
        {market.marketTrends.map((t, i) => <Bullet key={i}>{t}</Bullet>)}

        <Text style={styles.subhead}>Porter's Five Forces</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: "30%" }]}>Force</Text>
            <Text style={[styles.tableHeaderCell, { width: "70%" }]}>Assessment</Text>
          </View>
          {[
            ["Competitive Rivalry", market.porters.competitiveRivalry],
            ["Supplier Power", market.porters.supplierPower],
            ["Buyer Power", market.porters.buyerPower],
            ["Threat of Substitutes", market.porters.threatOfSubstitutes],
            ["Threat of New Entrants", market.porters.threatOfNewEntrants],
          ].map(([name, val], i) => (
            <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={[styles.tableCell, { width: "30%", fontWeight: 600 }]}>{name}</Text>
              <Text style={[styles.tableCell, { width: "70%" }]}>{val}</Text>
            </View>
          ))}
        </View>
      </Page>

      {/* ═══ RISK ASSESSMENT ═══ */}
      <Page size="LETTER" style={styles.page}>
        <Header company={company.name} section="Risk Assessment" />
        <SectionHeading number="04" title="Risk Assessment" />
        <Text style={styles.sectionIntro}>{risk.summary}</Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14, padding: 10, backgroundColor: COLORS.gray50, borderLeftWidth: 2, borderLeftColor: severityColor(risk.overallRiskLevel) }}>
          <Text style={{ fontSize: 7, letterSpacing: 1.2, color: COLORS.gray500, fontWeight: 600, textTransform: "uppercase", marginRight: 10 }}>
            Overall Risk Level
          </Text>
          <Badge text={risk.overallRiskLevel} color={severityColor(risk.overallRiskLevel)} />
        </View>

        {risk.factors.length > 0 && (
          <>
            <Text style={styles.subhead}>Risk Factor Matrix</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: "20%" }]}>Category</Text>
                <Text style={[styles.tableHeaderCell, { width: "28%" }]}>Risk</Text>
                <Text style={[styles.tableHeaderCell, { width: "12%" }]}>Severity</Text>
                <Text style={[styles.tableHeaderCell, { width: "40%" }]}>Description</Text>
              </View>
              {risk.factors.map((f, i) => (
                <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={[styles.tableCell, { width: "20%", fontSize: 8 }]}>{f.category}</Text>
                  <Text style={[styles.tableCell, { width: "28%", fontWeight: 600, fontSize: 8.5 }]}>{f.name}</Text>
                  <View style={{ width: "12%" }}>
                    <Badge text={f.severity} color={severityColor(f.severity)} />
                  </View>
                  <Text style={[styles.tableCell, { width: "40%", fontSize: 8 }]}>{f.description}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {risk.redFlags.length > 0 && (
          <>
            <Text style={styles.subhead}>Red Flags</Text>
            {risk.redFlags.map((r, i) => (
              <View key={i} style={[styles.bulletRow, { padding: 8, backgroundColor: "#FEF2F2", marginBottom: 4, borderLeftWidth: 2, borderLeftColor: COLORS.red }]}>
                <Text style={[styles.bullet, { color: COLORS.red }]}>⚠</Text>
                <Text style={[styles.bulletText, { color: COLORS.gray900 }]}>{r}</Text>
              </View>
            ))}
          </>
        )}
      </Page>

      {/* ═══ MANAGEMENT ═══ */}
      <Page size="LETTER" style={styles.page}>
        <Header company={company.name} section="Management" />
        <SectionHeading number="05" title="Management & Governance" />
        <Text style={styles.sectionIntro}>{management.summary}</Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14, padding: 10, backgroundColor: COLORS.gray50, borderLeftWidth: 2, borderLeftColor: ratingColor(management.rating) }}>
          <Text style={{ fontSize: 7, letterSpacing: 1.2, color: COLORS.gray500, fontWeight: 600, textTransform: "uppercase", marginRight: 10 }}>
            Management Rating
          </Text>
          <Badge text={management.rating} color={ratingColor(management.rating)} />
          <Text style={[styles.body, { marginLeft: 10, fontSize: 8.5, flex: 1 }]}>{management.ratingRationale}</Text>
        </View>

        {management.keyExecutives.length > 0 && (
          <>
            <Text style={styles.subhead}>Key Executives</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: "22%" }]}>Name</Text>
                <Text style={[styles.tableHeaderCell, { width: "18%" }]}>Title</Text>
                <Text style={[styles.tableHeaderCell, { width: "12%" }]}>Tenure</Text>
                <Text style={[styles.tableHeaderCell, { width: "48%" }]}>Background</Text>
              </View>
              {management.keyExecutives.map((e, i) => (
                <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={[styles.tableCell, { width: "22%", fontWeight: 600, fontSize: 8.5 }]}>{e.name}</Text>
                  <Text style={[styles.tableCell, { width: "18%", fontSize: 8 }]}>{e.title}</Text>
                  <Text style={[styles.tableCell, { width: "12%", fontSize: 8 }]}>{e.tenure ?? "—"}</Text>
                  <Text style={[styles.tableCell, { width: "48%", fontSize: 8 }]}>{e.background}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.subhead}>Governance</Text>
        <Text style={styles.body}>{management.governance.commentary}</Text>

        <Text style={styles.subhead}>Compensation Alignment</Text>
        <Text style={styles.body}>{management.compensation}</Text>

        <Text style={styles.subhead}>Track Record</Text>
        <Text style={styles.body}>{management.trackRecord}</Text>

        {management.concerns.length > 0 && (
          <>
            <Text style={styles.subhead}>Concerns</Text>
            {management.concerns.map((c, i) => <Bullet key={i}>{c}</Bullet>)}
          </>
        )}
      </Page>

      {/* ═══ KEY QUESTIONS & APPENDIX ═══ */}
      <Page size="LETTER" style={styles.page}>
        <Header company={company.name} section="Key Questions" />
        <SectionHeading number="06" title="Key Questions for Management" />
        <Text style={styles.sectionIntro}>
          Sharp questions an investor should put to management before committing capital.
        </Text>

        {keyQuestions.map((q, i) => (
          <View key={i} style={{ marginBottom: 10, paddingLeft: 22, position: "relative" }}>
            <Text style={{ position: "absolute", left: 0, top: 0, fontSize: 12, fontWeight: 700, color: COLORS.accent, fontFamily: "JetBrainsMono" }}>
              {String(i + 1).padStart(2, "0")}
            </Text>
            <Text style={{ fontSize: 10, color: COLORS.gray900, lineHeight: 1.55 }}>{q}</Text>
          </View>
        ))}

        <View style={{ marginTop: 24, paddingTop: 14, borderTopWidth: 0.5, borderTopColor: COLORS.gray200 }}>
          <Text style={styles.subhead}>Methodology & Sources</Text>
          <Text style={styles.body}>
            This report synthesizes primary data from the following sources:
          </Text>
          {metadata.dataSources.map((s, i) => <Bullet key={i}>{s}</Bullet>)}
          <Text style={[styles.body, { marginTop: 10, fontStyle: "italic", color: COLORS.gray500, fontSize: 8.5 }]}>
            {metadata.confidenceNote}
          </Text>
        </View>

        <View style={{ marginTop: 20, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: COLORS.gray200 }}>
          <Text style={{ fontSize: 7, color: COLORS.gray400, letterSpacing: 0.5, lineHeight: 1.6 }}>
            DISCLAIMER — This report was generated by Anvil AI Research for informational purposes only. It does not
            constitute investment advice, a recommendation, or an offer to buy or sell securities. Information is
            derived from public sources believed to be reliable but is not guaranteed as to accuracy or completeness.
            Readers should conduct their own due diligence and consult with qualified professionals before making
            investment decisions.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
