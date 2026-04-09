/* eslint-disable no-useless-escape */
import type { StructuredReport, Severity } from "@/lib/types"

export type KeyMetric = { label: string; value: string; note?: string }

export const KEYWORD_GROUPS = {
  valuation: ["ev/", "p/e", "peg", "multiple", "target", "yield"],
  growth: ["growth", "yoy", "qoq", "cagr", "expansion"],
  margin: ["margin", "operating", "gross", "net"],
  efficiency: ["turnover", "days", "cycle", "efficiency", "utilization"],
} as const

export const SUMMARY_KEYWORDS = {
  valuation: KEYWORD_GROUPS.valuation,
  growth: KEYWORD_GROUPS.growth,
} as const

export const severityWeight = (s: Severity): number =>
  s === "Critical" ? 4 : s === "High" ? 3 : s === "Medium" ? 2 : 1

// Force value to array — agents sometimes return objects, strings, or nulls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toArray = (v: unknown): any[] => (Array.isArray(v) ? v : [])

export function cleanText(raw: unknown): string {
  if (raw == null) return ""
  let text = typeof raw === "string" ? raw : String(raw)
  text = text.replace(/\*\*(.+?)\*\*/g, "$1")
  text = text.replace(/\*(.+?)\*/g, "$1")
  text = text.replace(/__(.+?)__/g, "$1")
  text = text.replace(/_(.+?)_/g, "$1")
  const jsonLeak = text.search(/",\s*"[a-zA-Z]+"\s*:\s*(?:\[|"|{)/)
  if (jsonLeak > 20) text = text.slice(0, jsonLeak)
  text = text.replace(/(?:(?:"|}|])|\s)+$/, "").trim()
  text = text.replace(/^(?:\[|\{|\"])+\s*/, "").trim()
  return text
}

export function stringifyValue(value: unknown): string {
  if (typeof value === "string") return cleanText(value)
  if (typeof value === "object" && value !== null && "text" in value) {
    return cleanText(String((value as { text: unknown }).text))
  }
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>
    if (typeof obj.description === "string") return cleanText(obj.description)
    if (typeof obj.name === "string") return cleanText(obj.name)
    return cleanText(JSON.stringify(value))
  }
  return String(value ?? "")
}

export function normalizeReport(report: StructuredReport): StructuredReport {
  return {
    company: report.company ?? { name: "Unknown", isPublic: false, description: "" },
    executiveSummary: {
      verdict: report.executiveSummary?.verdict ?? "Cautious",
      verdictRationale: report.executiveSummary?.verdictRationale ?? "",
      thesis: report.executiveSummary?.thesis ?? "",
      keyPoints: toArray(report.executiveSummary?.keyPoints),
      whatWouldChangeVerdict: report.executiveSummary?.whatWouldChangeVerdict ?? "",
    },
    financial: {
      summary: report.financial?.summary ?? "",
      keyMetrics: toArray(report.financial?.keyMetrics),
      revenueHistory: toArray(report.financial?.revenueHistory),
      profitability: {
        grossMargin: report.financial?.profitability?.grossMargin,
        operatingMargin: report.financial?.profitability?.operatingMargin,
        netMargin: report.financial?.profitability?.netMargin,
        commentary: report.financial?.profitability?.commentary ?? "",
      },
      balanceSheet: {
        cashPosition: report.financial?.balanceSheet?.cashPosition,
        totalDebt: report.financial?.balanceSheet?.totalDebt,
        netDebt: report.financial?.balanceSheet?.netDebt,
        commentary: report.financial?.balanceSheet?.commentary ?? "",
      },
      cashFlow: {
        operatingCashFlow: report.financial?.cashFlow?.operatingCashFlow,
        freeCashFlow: report.financial?.cashFlow?.freeCashFlow,
        commentary: report.financial?.cashFlow?.commentary ?? "",
      },
      strengths: toArray(report.financial?.strengths),
      concerns: toArray(report.financial?.concerns),
      dataLimitations: report.financial?.dataLimitations,
    },
    market: {
      summary: report.market?.summary ?? "",
      positioning: report.market?.positioning ?? "Niche",
      positioningRationale: report.market?.positioningRationale ?? "",
      moat: {
        strength: report.market?.moat?.strength ?? "None",
        description: report.market?.moat?.description ?? "",
        durability: report.market?.moat?.durability ?? "",
      },
      competitors: toArray(report.market?.competitors),
      tamEstimate: report.market?.tamEstimate,
      tamRationale: report.market?.tamRationale,
      marketTrends: toArray(report.market?.marketTrends),
      porters: report.market?.porters ?? {
        competitiveRivalry: "",
        supplierPower: "",
        buyerPower: "",
        threatOfSubstitutes: "",
        threatOfNewEntrants: "",
      },
    },
    risk: {
      summary: report.risk?.summary ?? "",
      factors: toArray(report.risk?.factors),
      redFlags: toArray(report.risk?.redFlags),
      overallRiskLevel: report.risk?.overallRiskLevel ?? "Medium",
    },
    management: {
      summary: report.management?.summary ?? "",
      rating: report.management?.rating ?? "Adequate",
      ratingRationale: report.management?.ratingRationale ?? "",
      keyExecutives: toArray(report.management?.keyExecutives),
      governance: {
        insiderOwnership: report.management?.governance?.insiderOwnership,
        boardIndependence: report.management?.governance?.boardIndependence,
        shareStructure: report.management?.governance?.shareStructure,
        commentary: report.management?.governance?.commentary ?? "",
      },
      compensation: report.management?.compensation ?? "",
      trackRecord: report.management?.trackRecord ?? "",
      concerns: toArray(report.management?.concerns),
    },
    keyQuestions: toArray(report.keyQuestions),
    sources: toArray(report.sources),
    metadata: {
      generatedAt: report.metadata?.generatedAt ?? new Date().toISOString(),
      dataSources: toArray(report.metadata?.dataSources),
      confidenceNote: report.metadata?.confidenceNote ?? "",
    },
  }
}

export function pickMetrics(metrics: KeyMetric[], keywords: readonly string[]): KeyMetric[] {
  const seen = new Set<string>()
  return metrics.filter((metric) => {
    const key = metric.label?.toLowerCase?.() ?? ""
    if (!key) return false
    if (seen.has(key)) return false
    const matches = keywords.some((kw) => key.includes(kw))
    if (matches) seen.add(key)
    return matches
  })
}

export function collectActionItems(
  risk: StructuredReport["risk"],
  keyQuestions: string[],
  limit = 6
): string[] {
  const items: string[] = []
  risk.factors
    .filter((factor) => severityWeight(factor.severity) >= 3)
    .forEach((factor) => {
      const detail = cleanText(factor.mitigation || factor.description)
      items.push(`${factor.name}: ${detail || "Deep dive required"}`)
    })
  keyQuestions.forEach((question) => {
    const text = cleanText(question)
    if (text) items.push(`Discuss with management: ${text}`)
  })
  return items.filter(Boolean).slice(0, limit)
}

export function collectDataGaps(report: StructuredReport): string[] {
  const normalized = normalizeReport(report)
  const gaps: string[] = []
  if (!cleanText(normalized.financial.summary)) gaps.push("Financial narrative missing or thin")
  if (normalized.financial.keyMetrics.length === 0) gaps.push("Key financial metrics not supplied")
  if (normalized.market.competitors.length === 0) gaps.push("Competitive set not described")
  if (normalized.risk.factors.length === 0) gaps.push("Risk factors not enumerated")
  if (!normalized.management.governance.commentary) gaps.push("Governance commentary absent")
  return gaps
}

export function collectSummaryGaps(report: StructuredReport): string[] {
  const normalized = normalizeReport(report)
  const gaps: string[] = []
  if (!normalized.financial.keyMetrics.length) gaps.push("Key metrics were not provided.")
  if (!normalized.market.competitors.length) gaps.push("Competitive landscape not described.")
  if (!normalized.risk.factors.length) gaps.push("Risk factors missing.")
  if (!normalized.management.governance.commentary) gaps.push("Governance analysis pending.")
  return gaps
}
