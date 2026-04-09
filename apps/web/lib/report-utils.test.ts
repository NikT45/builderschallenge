import { describe, expect, it } from "vitest"
import type { StructuredReport } from "@/lib/types"
import {
  KEYWORD_GROUPS,
  SUMMARY_KEYWORDS,
  cleanText,
  collectActionItems,
  collectDataGaps,
  collectSummaryGaps,
  normalizeReport,
  pickMetrics,
} from "@/lib/report-utils"

const baseReport: StructuredReport = {
  company: { name: "Example Co", isPublic: true, description: "" },
  executiveSummary: {
    verdict: "Cautious",
    verdictRationale: "",
    thesis: "",
    keyPoints: [],
    whatWouldChangeVerdict: "",
  },
  financial: {
    summary: "",
    keyMetrics: [],
    revenueHistory: [],
    profitability: { commentary: "" },
    balanceSheet: { commentary: "" },
    cashFlow: { commentary: "" },
    strengths: [],
    concerns: [],
  },
  market: {
    summary: "",
    positioning: "Niche",
    positioningRationale: "",
    moat: { strength: "Moderate", description: "", durability: "" },
    competitors: [],
    marketTrends: [],
    porters: {
      competitiveRivalry: "",
      supplierPower: "",
      buyerPower: "",
      threatOfSubstitutes: "",
      threatOfNewEntrants: "",
    },
  },
  risk: {
    summary: "",
    factors: [],
    redFlags: [],
    overallRiskLevel: "Medium",
  },
  management: {
    summary: "",
    rating: "Adequate",
    ratingRationale: "",
    keyExecutives: [],
    governance: { commentary: "" },
    compensation: "",
    trackRecord: "",
    concerns: [],
  },
  keyQuestions: [],
  sources: [],
  metadata: {
    generatedAt: new Date().toISOString(),
    dataSources: [],
    confidenceNote: "",
  },
}

describe("normalizeReport", () => {
  it("fills in missing moat data", () => {
    const normalized = normalizeReport({
      ...baseReport,
      market: {
        summary: "",
        positioning: undefined,
        positioningRationale: undefined,
        moat: undefined,
        competitors: null as unknown as [],
        marketTrends: null as unknown as [],
        porters: undefined,
      },
    } as StructuredReport)

    expect(normalized.market.moat.strength).toBe("None")
    expect(normalized.market.moat.description).toBe("")
    expect(normalized.market.positioning).toBe("Niche")
    expect(normalized.market.competitors).toEqual([])
  })

  it("preserves provided moat data", () => {
    const normalized = normalizeReport({
      ...baseReport,
      market: {
        ...baseReport.market,
        moat: { strength: "Strong", description: "CUDA ecosystem", durability: "High" },
      },
    } as StructuredReport)

    expect(normalized.market.moat.strength).toBe("Strong")
    expect(normalized.market.moat.description).toBe("CUDA ecosystem")
  })
})

describe("pickMetrics", () => {
  it("extracts metrics that match keyword buckets without duplicates", () => {
    const metrics = [
      { label: "EV/EBITDA", value: "12x" },
      { label: "YoY Revenue Growth", value: "45%" },
      { label: "EV/EBITDA", value: "13x" },
      { label: "Net Margin", value: "55%" },
    ]

    const valuation = pickMetrics(metrics, KEYWORD_GROUPS.valuation)
    const growth = pickMetrics(metrics, SUMMARY_KEYWORDS.growth)

    expect(valuation).toHaveLength(1)
    expect(valuation[0]).toMatchObject({ value: "12x" })
    expect(growth).toHaveLength(1)
    expect(growth[0]).toMatchObject({ value: "45%" })
  })
})

describe("collectActionItems", () => {
  it("prioritizes high severity risks and appends key questions", () => {
    const report = normalizeReport({
      ...baseReport,
      risk: {
        summary: "",
        overallRiskLevel: "Medium",
        factors: [
          {
            category: "Market",
            name: "Customer Concentration",
            severity: "High",
            description: "Top 3 hyperscalers dominate revenue",
          },
          {
            category: "Operational",
            name: "Supply Chain",
            severity: "Low",
            description: "",
          },
        ],
        redFlags: [],
      },
      keyQuestions: ["How resilient is CUDA lock-in?"],
    } as StructuredReport)

    const items = collectActionItems(report.risk, report.keyQuestions, 4)
    expect(items[0]).toContain("Customer Concentration")
    expect(items[0]).toContain("Top 3 hyperscalers")
    expect(items).toContain("Discuss with management: How resilient is CUDA lock-in?")
    expect(items).toHaveLength(2)
  })
})

describe("gap detection", () => {
  it("flags missing competitive, financial, and governance data", () => {
    const report = normalizeReport({
      ...baseReport,
      financial: { ...baseReport.financial, keyMetrics: [] },
      market: { ...baseReport.market, competitors: [] },
      risk: { ...baseReport.risk, factors: [] },
      management: { ...baseReport.management, governance: { commentary: "" } },
    } as StructuredReport)

    expect(collectDataGaps(report)).toEqual([
      "Financial narrative missing or thin",
      "Key financial metrics not supplied",
      "Competitive set not described",
      "Risk factors not enumerated",
      "Governance commentary absent",
    ])
    expect(collectSummaryGaps(report)).toEqual([
      "Key metrics were not provided.",
      "Competitive landscape not described.",
      "Risk factors missing.",
      "Governance analysis pending.",
    ])
  })
})

describe("cleanText", () => {
  it("strips markdown artifacts and trailing JSON noise", () => {
    const dirty = '**Bold** insight with _emphasis_ and trailing junk", "other": {"foo": "bar"}}'
    expect(cleanText(dirty)).toBe("Bold insight with emphasis and trailing junk")
  })
})
